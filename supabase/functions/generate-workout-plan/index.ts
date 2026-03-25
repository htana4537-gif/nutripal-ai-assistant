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
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { client_id, date, workout_type, focus_area } = await req.json();
    console.log('Generating workout plan:', { client_id, date, workout_type });

    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    if (!client) {
      return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

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
  "exercises": [{"name": "اسم التمرين", "sets": 0, "reps": "0", "rest_seconds": 0, "notes": ""}],
  "duration_minutes": 0, "calories_burned": 0, "notes": ""
}`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
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
      console.error('AI API error:', aiResponse.status);
      throw new Error('AI service unavailable');
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices[0].message.content;

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse workout plan');

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

    if (saveError) throw new Error('Failed to save workout plan');

    return new Response(
      JSON.stringify({ message: 'تم إنشاء خطة التمرين بنجاح', workout_plan: savedPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-workout-plan:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
