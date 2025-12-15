import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CLASSIFICATION_PROMPT = `You are an AI classifier for the Smart Grievance Hub (SGH) system in India. 
Analyze the citizen's grievance and provide:
1. Category classification (one of: infrastructure, sanitation, water, electricity, health, police, other)
2. Urgency level (one of: low, medium, high, critical)
3. A brief title (max 10 words)
4. Key entities extracted (location, specific issue type)

Respond in JSON format only:
{
  "category": "infrastructure|sanitation|water|electricity|health|police|other",
  "urgency": "low|medium|high|critical",
  "title": "Brief descriptive title",
  "entities": {
    "location": "extracted location or null",
    "issue_type": "specific issue type",
    "keywords": ["keyword1", "keyword2"]
  },
  "confidence": 0.0-1.0
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, grievanceId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Classifying grievance:", grievanceId);

    // Call AI for classification
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CLASSIFICATION_PROMPT },
          { role: "user", content: `Classify this grievance:\n\n${description}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI classification failed");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the JSON response
    let classification;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || 
                        aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
      classification = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      classification = {
        category: "other",
        urgency: "medium",
        title: description.slice(0, 50),
        entities: { keywords: [] },
        confidence: 0.5
      };
    }

    console.log("Classification result:", classification);

    // Update the grievance with classification if grievanceId provided
    if (grievanceId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const { error: updateError } = await supabase
        .from("grievances")
        .update({
          category: classification.category,
          urgency: classification.urgency,
          title: classification.title,
          ai_classification: classification
        })
        .eq("id", grievanceId);

      if (updateError) {
        console.error("Failed to update grievance:", updateError);
      }
    }

    return new Response(JSON.stringify(classification), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Classification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
