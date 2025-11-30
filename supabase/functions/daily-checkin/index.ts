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
    const { client_id } = await req.json();
    console.log('Generating daily check-in for client:', client_id);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client info
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    // Get recent progress logs
    const { data: recentLogs } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('client_id', client_id)
      .order('log_date', { ascending: false })
      .limit(7);

    // Get today's meal plan
    const today = new Date().toISOString().split('T')[0];
    const { data: todayMeals } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('client_id', client_id)
      .eq('date', today);

    // Build context
    let context = `أنشئ رسالة متابعة يومية مخصصة للعميل:`;
    
    if (client.full_name) context += `\nالاسم: ${client.full_name}`;
    if (client.target_weight) context += `\nالوزن المستهدف: ${client.target_weight} كجم`;
    if (client.daily_calorie_goal) context += `\nهدف السعرات: ${client.daily_calorie_goal} سعر`;

    if (recentLogs?.length) {
      const latestLog = recentLogs[0];
      context += `\n\nآخر سجل تقدم:`;
      if (latestLog.weight) context += `\n- الوزن: ${latestLog.weight} كجم`;
      if (latestLog.mood) context += `\n- المزاج: ${latestLog.mood}`;
      if (latestLog.energy_level) context += `\n- مستوى الطاقة: ${latestLog.energy_level}/10`;
    }

    if (todayMeals?.length) {
      context += `\n\nلديك ${todayMeals.length} وجبة مخططة لليوم.`;
    }

    context += `\n\nاكتب رسالة تحفيزية قصيرة (2-3 جمل) تشجع العميل على متابعة أهدافه الصحية. اجعلها شخصية وإيجابية.`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'أنت مساعد تغذية ودود يرسل رسائل متابعة يومية للعملاء.' },
          { role: 'user', content: context }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const message = aiData.choices[0].message.content;

    console.log('Daily check-in message generated successfully');

    return new Response(
      JSON.stringify({ 
        message,
        telegram_id: client.telegram_id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in daily-checkin:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});