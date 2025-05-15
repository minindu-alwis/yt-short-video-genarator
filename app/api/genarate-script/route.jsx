// File: app/api/generatedscript/route.js
import { generateScript } from "@/configs/AiModel";
import { NextResponse } from "next/server";

const SCRIPT_PROMPT = `Write two different scripts for a 30-second video on the topic: {topic}
• Give me the response in JSON format and follow this schema:

{
  "scripts": [
    {
      "title": "Script title",
      "content": "Script content"
    }
  ]
}`;

export async function POST(req) {
  try {
    const { topic } = await req.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const prompt = SCRIPT_PROMPT.replace('{topic}', topic);
    
    const result = await generateScript.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response (remove markdown code blocks if present)
    const cleanText = text.replace(/```json|```/g, '');
    
    return NextResponse.json(JSON.parse(cleanText));
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      { error: "Failed to generate scripts" },
      { status: 500 }
    );
  }
}