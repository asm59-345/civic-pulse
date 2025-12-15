import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OFFICER_INSIGHT_PROMPT = `You are the AI Decision Support system for SGH (Smart Grievance Hub). 
Act as a "Chief Strategy Officer" providing officers with actionable insights.

Based on the current grievance and similar historical cases, provide:
1. Diagnosis: Root cause analysis
2. Recommended Actions: Step-by-step resolution approach
3. Predicted Timeline: Realistic completion estimate based on historical data

Be professional, data-driven, and directive. Focus on actionable insights.

Respond in JSON format:
{
  "diagnosis": "Root cause analysis in 2-3 sentences",
  "recommendedActions": ["Action 1", "Action 2", "Action 3"],
  "predictedTimeline": "X hours/days based on similar cases",
  "confidence": 0.0-1.0,
  "riskFactors": ["Risk 1", "Risk 2"]
}`;

// Simple keyword-based similarity for semantic search
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(w => w.length > 3));
  const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(w => w.length > 3));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// Haversine formula for geo distance
function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { grievanceId, description, category, lat, lng } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Required environment variables not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    console.log("Generating insights for grievance:", grievanceId);

    // Step 1: Semantic search - retrieve similar historical cases
    const { data: archiveData, error: archiveError } = await supabase
      .from("grievance_archive")
      .select("*")
      .eq("category", category);

    if (archiveError) {
      console.error("Archive query error:", archiveError);
    }

    // Calculate similarity and get top 3 similar cases
    const similarCases = (archiveData || [])
      .map(record => ({
        ...record,
        similarity: calculateSimilarity(description, record.description)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    console.log("Found similar cases:", similarCases.length);

    // Step 2: Geo-cluster analysis - check for nearby grievances
    let clusterInfo = null;
    if (lat && lng) {
      const { data: nearbyGrievances, error: nearbyError } = await supabase
        .from("grievances")
        .select("id, location_lat, location_lng, category, created_at")
        .eq("category", category)
        .eq("status", "pending");

      if (!nearbyError && nearbyGrievances) {
        // Find grievances within 200m radius in last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const nearbyCount = nearbyGrievances.filter(g => {
          if (!g.location_lat || !g.location_lng) return false;
          const distance = getDistanceMeters(lat, lng, Number(g.location_lat), Number(g.location_lng));
          const createdAt = new Date(g.created_at);
          return distance <= 200 && createdAt >= oneHourAgo;
        }).length;

        if (nearbyCount >= 3) {
          clusterInfo = {
            isCluster: true,
            count: nearbyCount,
            message: `Infrastructure Failure Event detected! ${nearbyCount} similar complaints within 200m radius.`
          };
          console.log("Cluster detected:", clusterInfo);
        }
      }
    }

    // Step 3: Generate AI insights using historical data
    const historicalContext = similarCases.length > 0 
      ? `\n\nHistorical similar cases:\n${similarCases.map((c, i) => 
          `${i+1}. "${c.description}" - Resolved in ${c.time_to_resolve_hours} hours. Resolution: ${c.resolution}`
        ).join('\n')}`
      : '';

    const clusterContext = clusterInfo 
      ? `\n\nALERT: This appears to be part of an Infrastructure Failure Event with ${clusterInfo.count} similar complaints in the area. Consider bulk resolution approach.`
      : '';

    const avgResolutionTime = similarCases.length > 0
      ? Math.round(similarCases.reduce((sum, c) => sum + (c.time_to_resolve_hours || 48), 0) / similarCases.length)
      : 48;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: OFFICER_INSIGHT_PROMPT },
          { 
            role: "user", 
            content: `Generate insights for this grievance:

Category: ${category}
Description: ${description}
${historicalContext}
${clusterContext}

Average historical resolution time for similar cases: ${avgResolutionTime} hours`
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI insight generation failed");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the JSON response
    let insights;
    try {
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || 
                        aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
      insights = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      insights = {
        diagnosis: "Unable to generate detailed diagnosis. Manual review recommended.",
        recommendedActions: ["Review complaint details", "Assign to appropriate department", "Follow standard resolution process"],
        predictedTimeline: `${avgResolutionTime} hours`,
        confidence: 0.5,
        riskFactors: []
      };
    }

    // Combine all insights
    const fullInsights = {
      ...insights,
      similarCases: similarCases.map(c => ({
        id: c.id,
        title: c.description.slice(0, 50),
        resolution: c.resolution,
        timeToResolve: c.time_to_resolve_hours,
        similarity: Math.round(c.similarity * 100)
      })),
      clusterInfo,
      predictedTimeline: insights.predictedTimeline || `${avgResolutionTime} hours`
    };

    // Update grievance with insights
    if (grievanceId) {
      const { error: updateError } = await supabase
        .from("grievances")
        .update({
          ai_suggestion: fullInsights,
          similar_cases: fullInsights.similarCases
        })
        .eq("id", grievanceId);

      if (updateError) {
        console.error("Failed to update grievance with insights:", updateError);
      }
    }

    return new Response(JSON.stringify(fullInsights), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Insight generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
