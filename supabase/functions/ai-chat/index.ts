import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
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

    const { messages, userMessage, imageData } = await req.json();

    const systemPrompt = `أنت مساعد ذكي متخصص في التغذية والصحة واللياقة البدنية. اسمك "مساعد التغذية الذكي".
    
    مهامك:
    - تحليل الوجبات والأطعمة وحساب السعرات الحرارية والقيم الغذائية
    - إنشاء خطط غذائية مخصصة بناءً على الأهداف والاحتياجات
    - الإجابة على أسئلة التغذية والصحة
    - تحليل صور الطعام وتقدير قيمها الغذائية
    - تقديم نصائح للوصول لأهداف الوزن واللياقة
    - دعم عملاء خبراء التغذية ومتابعتهم
    
    قواعد:
    - دائماً اجب باللغة العربية
    - كن دقيقاً وعلمياً في معلوماتك الغذائية
    - قدم إجابات منظمة ومفيدة
    - إذا طلب المستخدم خطة غذائية، اجعلها مفصلة وعملية
    - كن ودوداً ومشجعاً`;

    const geminiMessages = (messages || []).map((m: { role: string; text: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const userParts: any[] = [];
    if (userMessage) userParts.push({ text: userMessage });
    if (imageData?.data) {
      userParts.push({
        inline_data: {
          mime_type: imageData.mimeType || "image/jpeg",
          data: imageData.data,
        },
      });
    }

    if (userParts.length === 0) userParts.push({ text: "مرحباً" });

    geminiMessages.push({ role: "user", parts: userParts });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...geminiMessages.map((m: any) => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.parts.map((p: any) => p.text).join('\n'),
          })),
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "عذراً، لم أتمكن من الإجابة. يرجى المحاولة مرة أخرى.";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ text: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
