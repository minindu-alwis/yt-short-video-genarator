import { generateScript } from "@/configs/AiModel";
import { NextResponse } from "next/server";

const SCRIPT_PROMPT = (topic) => `Generate two excellent 30-second video scripts about "${topic}".

**STRICT REQUIREMENTS:**
1. Respond in PURE JSON format (no markdown code blocks)
2. Absolutely NO timestamps (e.g., [0-3s])
3. First script: Fast-paced, dynamic, and visually exciting
4. Second script: Emotional, atmospheric, and character-driven
5. Must include vivid sensory details (visuals, sounds, textures)
6. Stay strictly on topic - no deviations or unrelated content

**Example Output Format:**
{
  "scripts": [
    {
      "title": "Creative Title (5 words max)",
      "content": "Engaging narrative description with cinematic visuals..."
    },
    {
      "title": "Creative Title (5 words max)",
      "content": "Emotional story with atmospheric details..."
    }
  ]
}`;

export async function POST(req) {
  try {
    const { topic } = await req.json();
    
    // Validate input
    if (!topic?.trim()) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Get AI response
    const result = await generateScript.sendMessage(SCRIPT_PROMPT(topic));
    const response = await result.response;
    let text = response.text();

    // Robust JSON cleaning
    text = text.trim()
      .replace(/^```(json)?/, '')  // Remove starting code fences
      .replace(/```$/, '')         // Remove ending code fences
      .replace(/\\n/g, '\n')       // Unescape newlines
      .replace(/\\"/g, '"')        // Unescape quotes
      .replace(/\s+/g, ' ')        // Normalize whitespace
      .trim();

    // Parse and validate
    const parsed = JSON.parse(text);
    
    if (!Array.isArray(parsed?.scripts) || parsed.scripts.length !== 2) {
      throw new Error("AI returned invalid script format - expected 2 scripts");
    }

    // Sanitize and format output
    const cleanScripts = parsed.scripts.map(script => ({
      title: (script.title || "Untitled").trim().slice(0, 30),
      content: (script.content || "").trim()
    }));

    return NextResponse.json({ scripts: cleanScripts });
    
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate scripts",
        details: error.message.includes("JSON") 
          ? "Invalid format received from AI" 
          : error.message
      },
      { status: 500 }
    );
  }
}