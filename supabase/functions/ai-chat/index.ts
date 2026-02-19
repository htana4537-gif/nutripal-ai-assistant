import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${Deno.env.get("GEMINI_API_KEY")}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini error: ${errText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من الإجابة. يرجى المحاولة مرة أخرى.";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ text: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.", error: error.message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
