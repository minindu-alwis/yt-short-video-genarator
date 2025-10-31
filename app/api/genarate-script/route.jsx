import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SCRIPT_PROMPT = (topic) => `Create 2 short video scripts about "${topic}". Return ONLY this JSON format:

{"scripts":[{"title":"Title 1","content":"Brief 30-second visual description"},{"title":"Title 2","content":"Brief 30-second visual description"}]}

Keep each script under 100 words. Focus on visuals and action. No timestamps. Return ONLY the JSON.`;

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

    // Check API key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI API key is missing");
      return NextResponse.json(
        { error: "API key configuration error" },
        { status: 500 }
      );
    }
    
    console.log("API key found:", apiKey.substring(0, 10) + "...");
    
    // Let's try a direct HTTP approach to test API access and get available models
    let result;
    
    try {
      console.log("🔍 Testing API access with direct HTTP call...");
      
      const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const modelsResponse = await fetch(modelsUrl);
      
      if (!modelsResponse.ok) {
        console.log("❌ API access test failed:", modelsResponse.status, modelsResponse.statusText);
        throw new Error(`API access failed: ${modelsResponse.status} ${modelsResponse.statusText}`);
      }
      
      const modelsData = await modelsResponse.json();
      console.log("📋 Available models from API:");
      
      if (modelsData.models && modelsData.models.length > 0) {
        modelsData.models.forEach(model => {
          console.log(`- ${model.name} | Methods: ${model.supportedGenerationMethods?.join(', ') || 'none'}`);
        });
        
        // Find models that support generateContent, prioritizing free-tier friendly ones
        const compatibleModels = modelsData.models.filter(model => 
          model.supportedGenerationMethods?.includes('generateContent')
        );
        
        // Prioritize models that are more likely to work with free tier
        const preferredModels = [
          'models/gemini-flash-latest',
          'models/gemini-pro-latest', 
          'models/gemini-2.0-flash-lite',
          'models/gemini-2.5-flash-lite'
        ];
        
        let selectedModel = null;
        for (const preferred of preferredModels) {
          const found = compatibleModels.find(model => model.name === preferred);
          if (found) {
            selectedModel = found;
            break;
          }
        }
        
        // If no preferred model found, use the first compatible one
        if (!selectedModel && compatibleModels.length > 0) {
          selectedModel = compatibleModels[0];
        }
        
        if (selectedModel) {
          console.log(`🎯 Using compatible model: ${selectedModel.name}`);
          
          // Initialize Google AI with the found model
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ 
            model: selectedModel.name,
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 2048, // Increased to prevent truncation
            }
          });
          
          // Try generating content with retry logic
          let attempts = 0;
          const maxAttempts = 3;
          
          while (attempts < maxAttempts) {
            try {
              attempts++;
              console.log(`Attempt ${attempts} to generate content...`);
              result = await model.generateContent(SCRIPT_PROMPT(topic));
              console.log(`🎉 Successfully generated content on attempt ${attempts}!`);
              break;
            } catch (genError) {
              console.log(`❌ Generation attempt ${attempts} failed:`, genError.message);
              if (attempts === maxAttempts) {
                throw genError;
              }
              // Wait a bit before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
        } else {
          throw new Error("No compatible models found that support generateContent");
        }
      } else {
        console.log("❌ No models found in API response");
        throw new Error("No models available with this API key");
      }
      
    } catch (apiError) {
      console.log("❌ Direct API test failed:", apiError.message);
      
      // Final fallback - try some basic models with simple configuration
      console.log("🔄 Trying simple model configurations...");
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const simpleModels = [
        "gemini-flash-latest",      // This should work with free tier
        "gemini-pro-latest",        // This worked in your test
        "gemini-2.0-flash-lite",    // Lite versions use less quota
        "gemini-2.5-flash-lite"
      ];
      
      let result;
      for (const modelName of simpleModels) {
        try {
          console.log(`Trying simple model: ${modelName}`);
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            }
          });
          
          let attempts = 0;
          while (attempts < 2) {
            attempts++;
            try {
              result = await model.generateContent(SCRIPT_PROMPT(topic));
              console.log(`✅ Success with simple model: ${modelName} on attempt ${attempts}`);
              break;
            } catch (genError) {
              if (attempts === 2) throw genError;
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          break;
        } catch (simpleError) {
          console.log(`❌ Simple model failed ${modelName}: ${simpleError.message}`);
          
          if (modelName === simpleModels[simpleModels.length - 1]) {
            throw new Error(
              `All model attempts failed. ` +
              `Please verify: 1) Your API key is valid, 2) You have access to Gemini models, ` +
              `3) Your Google Cloud project has the Generative AI API enabled. ` +
              `Original error: ${apiError.message}`
            );
          }
        }
      }
    }

    const response = await result.response;
    let text = await response.text();
    console.log("AI response received (first 100 chars):", text.substring(0, 100) + "...");
    console.log("AI response length:", text.length);
    
    // Check if response is complete
    if (!text || text.length < 10) {
      throw new Error("Empty or too short response from AI");
    }

    // Robust JSON cleaning
    console.log("Full raw AI response:", text);
    
    // More aggressive cleaning
    text = text.trim()
      .replace(/^```(json)?/i, '')  // Remove starting code fences (case insensitive)
      .replace(/```$/i, '')         // Remove ending code fences
      .replace(/\\n/g, '\n')        // Unescape newlines
      .replace(/\\"/g, '"')         // Unescape quotes
      .replace(/[\r\n\t]/g, ' ')    // Replace all line breaks and tabs with spaces
      .replace(/\s+/g, ' ')         // Normalize all whitespace
      .trim();

    console.log("Cleaned text for parsing:", text.substring(0, 200) + "...");

    // Try to extract JSON if it's embedded in other text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
      console.log("Extracted JSON:", text.substring(0, 200) + "...");
    }

    // Try to complete incomplete JSON if it looks like it was cut off
    if (text.includes('"scripts"') && !text.endsWith('}')) {
      console.log("Detected incomplete JSON, attempting to complete...");
      
      // Count open braces vs close braces
      const openBraces = (text.match(/\{/g) || []).length;
      const closeBraces = (text.match(/\}/g) || []).length;
      const openBrackets = (text.match(/\[/g) || []).length;
      const closeBrackets = (text.match(/\]/g) || []).length;
      
      // Add missing closing characters
      let completed = text;
      
      // If we're missing quotes, try to close them
      if (completed.match(/"[^"]*$/)) {
        completed += '"';
      }
      
      // Add missing closing brackets and braces
      for (let i = 0; i < (openBrackets - closeBrackets); i++) {
        completed += ']';
      }
      for (let i = 0; i < (openBraces - closeBraces); i++) {
        completed += '}';
      }
      
      console.log("Completed JSON attempt:", completed.substring(0, 200) + "...");
      text = completed;
    }

    // Parse and validate with better error handling
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      console.error("Failed text:", text);
      
      // Try to fix common JSON issues
      const fixedText = text
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Add quotes to unquoted keys
        .replace(/:\s*'([^']*)'/g, ': "$1"')     // Replace single quotes with double quotes
        .replace(/\n/g, '\\n');                   // Escape remaining newlines
      
      try {
        console.log("Attempting to parse fixed JSON:", fixedText.substring(0, 200) + "...");
        parsed = JSON.parse(fixedText);
      } catch (fixError) {
        throw new Error(`Invalid JSON from AI. Parse error: ${parseError.message}. Text: ${text.substring(0, 300)}...`);
      }
    }
    
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