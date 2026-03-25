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

    const { message, client_id, conversation_id } = await req.json();
    console.log('Processing nutrition text for client:', client_id);

    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })
      .limit(20);

    const conversationHistory = messages?.map(msg => ({
      role: msg.sender_type === 'user' ? 'user' : 'assistant',
      content: msg.content || ''
    })) || [];

    let systemPrompt = `أنت مساعد تغذية ذكي متخصص في تقديم استشارات غذائية شخصية باللغة العربية.`;
    
    if (client) {
      systemPrompt += `\n\nمعلومات العميل:`;
      if (client.full_name) systemPrompt += `\n- الاسم: ${client.full_name}`;
      if (client.weight) systemPrompt += `\n- الوزن: ${client.weight} كجم`;
      if (client.height) systemPrompt += `\n- الطول: ${client.height} سم`;
      if (client.age) systemPrompt += `\n- العمر: ${client.age} سنة`;
      if (client.gender) systemPrompt += `\n- الجنس: ${client.gender}`;
      if (client.activity_level) systemPrompt += `\n- مستوى النشاط: ${client.activity_level}`;
      if (client.daily_calorie_goal) systemPrompt += `\n- هدف السعرات اليومي: ${client.daily_calorie_goal} سعر`;
      if (client.target_weight) systemPrompt += `\n- الوزن المستهدف: ${client.target_weight} كجم`;
      if (client.dietary_preferences?.length) systemPrompt += `\n- التفضيلات الغذائية: ${client.dietary_preferences.join(', ')}`;
      if (client.allergies?.length) systemPrompt += `\n- الحساسية: ${client.allergies.join(', ')}`;
      if (client.health_conditions?.length) systemPrompt += `\n- الحالات الصحية: ${client.health_conditions.join(', ')}`;
    }

    systemPrompt += `\n\nقدم نصائح واضحة ومفيدة ومخصصة بناءً على احتياجات العميل. استخدم لغة ودية ومشجعة.`;

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
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      throw new Error('AI service unavailable');
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-nutrition-text:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
