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

    const { image_url, client_id, conversation_id } = await req.json();
    console.log('Analyzing food image for client:', client_id);

    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    let systemPrompt = `أنت خبير تغذية متخصص في تحليل صور الطعام وحساب السعرات الحرارية. قم بتحليل الصورة وتقديم تقدير دقيق للسعرات والقيم الغذائية.`;
    
    if (client) {
      systemPrompt += `\n\nمعلومات العميل:`;
      if (client.daily_calorie_goal) systemPrompt += `\n- هدف السعرات اليومي: ${client.daily_calorie_goal} سعر`;
      if (client.dietary_preferences?.length) systemPrompt += `\n- التفضيلات الغذائية: ${client.dietary_preferences.join(', ')}`;
      if (client.allergies?.length) systemPrompt += `\n- الحساسية: ${client.allergies.join(', ')}`;
    }

    systemPrompt += `\n\nقدم تحليلاً يتضمن:
1. تحديد نوع الطعام
2. تقدير السعرات الحرارية
3. القيم الغذائية (بروتين، كربوهيدرات، دهون)
4. حجم الحصة التقريبي
5. تقييم صحي للوجبة
6. نصائح تحسين إذا لزم الأمر`;

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
          {
            role: 'user',
            content: [
              { type: 'text', text: 'حلل هذه الصورة للطعام وقدم تقييماً تغذوياً كاملاً' },
              { type: 'image_url', image_url: { url: image_url } }
            ]
          }
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
    console.error('Error in analyze-food-image:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
