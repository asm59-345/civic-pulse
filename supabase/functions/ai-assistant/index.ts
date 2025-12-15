import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CITIZEN_SYSTEM_PROMPT = `You are SGH AI Assistant - a helpful civic grievance assistant for the Smart Grievance Hub platform in India.

Your role is to help citizens:
- Understand how to file grievances (complaints about public services)
- Explain the grievance resolution process
- Help track existing grievances
- Answer questions about required documents and timelines
- Provide guidance on different complaint categories (Public Works, Health, Police, Electricity)

Be friendly, concise, and helpful. Use simple language. If asked about specific grievance status, explain they need to provide their ticket ID. Always be empathetic to citizen concerns.

Respond in the same language the user writes in (Hindi, English, or other Indian languages).`;

const OFFICER_SYSTEM_PROMPT = `You are SGH AI Decision Support - an intelligent assistant for government officers handling grievances on the Smart Grievance Hub platform.

Your role is to help officers:
- Analyze grievance cases and provide insights
- Suggest resolution strategies based on best practices
- Identify patterns and clusters of related complaints
- Provide historical context from similar past cases
- Recommend priority levels based on urgency and impact
- Suggest optimal resource allocation

Act as a "Chief Strategy Officer" providing:
1. Diagnosis: Root cause analysis
2. Recommended Action: Step-by-step resolution approach
3. Predicted Timeline: Realistic completion estimates

Be professional, data-driven, and directive. Focus on actionable insights that help resolve grievances efficiently.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = mode === 'officer' ? OFFICER_SYSTEM_PROMPT : CITIZEN_SYSTEM_PROMPT;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
