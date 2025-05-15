// File: configs/AiModel.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-04-17", // Updated to latest model
  generationConfig: {
    responseMimeType: "application/json",
  },
});

// Create and export the chat session
export const generateScript = model.startChat({
  history: [
    {
      role: "user",
      parts: [{
        text: `Write two different scripts for a 30-second video on the given topic.
• Give me the response in JSON format and follow this schema:

{
  "scripts": [
    {
      "title": "Script title",
      "content": "Script content"
    }
  ]
}`
      }]
    },
    {
      role: "model",
      parts: [{
        text: `\`\`\`json
{
  "scripts": [
    {
      "title": "Example Script 1",
      "content": "[SCENE START]\\n\\nVISUAL: (0-3 seconds) Example scene description..."
    },
    {
      "title": "Example Script 2",
      "content": "[SCENE START]\\n\\nVISUAL: (0-5 seconds) Another example scene..."
    }
  ]
}
\`\`\``
      }]
    }
  ]
});