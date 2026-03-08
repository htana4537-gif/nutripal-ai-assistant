import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { client_id, date, workout_type, focus_area } = await req.json();
    console.log('Generating workout plan:', { client_id, date, workout_type, focus_area });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    if (!client) throw new Error('Client not found');

    let prompt = `أنشئ خطة تمرين مخصصة بصيغة JSON.`;
    prompt += `\nنوع التمرين: ${workout_type || 'متنوع'}`;
    if (focus_area) prompt += `\nالمنطقة المستهدفة: ${focus_area}`;
    
    prompt += `\n\nمعلومات العميل:`;
    if (client.weight) prompt += `\n- الوزن: ${client.weight} كجم`;
    if (client.height) prompt += `\n- الطول: ${client.height} سم`;
    if (client.age) prompt += `\n- العمر: ${client.age} سنة`;
    if (client.gender) prompt += `\n- الجنس: ${client.gender}`;
    if (client.activity_level) prompt += `\n- مستوى النشاط: ${client.activity_level}`;
    if (client.health_conditions?.length) prompt += `\n- حالات صحية: ${client.health_conditions.join(', ')}`;

    prompt += `\n\nأرجع JSON بهذا الشكل:
{
  "exercises": [
    {
      "name": "اسم التمرين",
      "sets": عدد_المجموعات,
      "reps": "عدد_التكرارات",
      "rest_seconds": ثوان_الراحة,
      "notes": "ملاحظات"
    }
  ],
  "duration_minutes": مدة_التمرين,
  "calories_burned": السعرات_المحروقة,
  "notes": "ملاحظات عامة"
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'أنت مدرب لياقة بدنية متخصص في تصميم خطط تمارين مخصصة وآمنة.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'تم تجاوز حد الطلبات، حاول لاحقاً' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'يرجى إضافة رصيد للمتابعة' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices[0].message.content;

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse workout plan JSON');

    const workoutPlan = JSON.parse(jsonMatch[0]);

    const { data: savedPlan, error: saveError } = await supabase
      .from('workout_plans')
      .insert({
        client_id,
        date: date || new Date().toISOString().split('T')[0],
        workout_type: workout_type || 'متنوع',
        exercises: workoutPlan.exercises,
        duration_minutes: workoutPlan.duration_minutes,
        calories_burned: workoutPlan.calories_burned,
        notes: workoutPlan.notes,
        status: 'planned'
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({ message: 'تم إنشاء خطة التمرين بنجاح', workout_plan: savedPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-workout-plan:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
