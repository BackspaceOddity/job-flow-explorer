import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert Jobs-to-be-Done (JTBD) analyst. Your task is to analyze customer interview transcripts and extract structured job data.

## Job Statement Format (Jim Kalbach's Syntax)
Every job title MUST follow this format: Verb + Object + Contextual Clarifier
Examples:
- "Identify compliance requirements for target jurisdiction"
- "Calculate employment costs for offshore workforce"
- "Execute employee onboarding across time zones"

## Job Types
- functional: What the customer wants to accomplish (most common)
- emotional: How the customer wants to feel
- social: How the customer wants to be perceived by others

## ICP (Ideal Customer Profile) Options
Only use these values: ceo, hr_manager, head_of_finance, hiring_manager, head_of_legal

## Job Stages (Universal Job Map)
Phase 1 - Before: define, locate, prepare, confirm
Phase 2 - During: execute, monitor, modify
Phase 3 - After: conclude, follow_up

## Importance & Satisfaction Scoring (1-10)
- Importance: How critical is this job to the customer? Look for words like "critical", "essential", "must have" (high) vs "nice to have", "optional" (low)
- Satisfaction: How well are current solutions meeting this need? Look for pain points, frustrations, workarounds (low satisfaction) vs praise, satisfaction (high)
- Underserved jobs: High importance (≥5) + Low satisfaction (≤5) = OPPORTUNITY

## Relationship Types
- enables: Job A makes Job B possible
- precedes: Job A must happen before Job B
- depends_on: Job B requires Job A to be completed
- influences: Job A affects how Job B is performed

## Output Format
Return a JSON object with:
- jobs: Array of extracted jobs
- edges: Array of relationships between jobs
- summary: Brief summary of the main themes

Be thorough but focus on genuine jobs, not tasks or features.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, context } = await req.json();
    
    if (!transcript || typeof transcript !== 'string') {
      return new Response(
        JSON.stringify({ error: "Transcript is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt = context 
      ? `Context: ${context}\n\nInterview Transcript:\n${transcript}`
      : `Interview Transcript:\n${transcript}`;

    console.log("Calling Lovable AI to analyze interview...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_jobs",
              description: "Extract jobs, relationships, and scores from the interview transcript",
              parameters: {
                type: "object",
                properties: {
                  jobs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Job title in Kalbach format: Verb + Object + Contextual Clarifier" },
                        description: { type: "string", description: "Brief description of the job" },
                        job_type: { type: "string", enum: ["functional", "emotional", "social"] },
                        icp: { type: "string", enum: ["ceo", "hr_manager", "head_of_finance", "hiring_manager", "head_of_legal"] },
                        level: { type: "number", description: "Job level (0 = main job, 1-4 = sub-jobs)" },
                        importance: { type: "number", description: "Importance score 1-10 (null if not mentioned)" },
                        satisfaction: { type: "number", description: "Satisfaction score 1-10 (null if not mentioned)" },
                        job_stage: { type: "string", enum: ["define", "locate", "prepare", "confirm", "execute", "monitor", "modify", "conclude", "follow_up"], description: "Job stage in Universal Job Map (null if not applicable)" },
                        is_main_job: { type: "boolean", description: "Whether this is the main JTBD" }
                      },
                      required: ["title", "description", "job_type", "icp", "level", "is_main_job"]
                    }
                  },
                  edges: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        source_title: { type: "string", description: "Title of the source job" },
                        target_title: { type: "string", description: "Title of the target job" },
                        relation_type: { type: "string", enum: ["enables", "precedes", "depends_on", "influences"] }
                      },
                      required: ["source_title", "target_title", "relation_type"]
                    }
                  },
                  summary: { type: "string", description: "Brief summary of the main themes and opportunities identified" }
                },
                required: ["jobs", "edges", "summary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_jobs" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze interview" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the function call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_jobs") {
      console.error("Unexpected response format:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);
    console.log(`Extracted ${result.jobs?.length || 0} jobs and ${result.edges?.length || 0} edges`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-interview function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
