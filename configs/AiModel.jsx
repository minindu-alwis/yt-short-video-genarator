const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.7,  // Slightly less random
    topP: 0.85,
  },
 systemInstruction: `You are a STRICT transportation script generator. When given "bike and bus":
1. ONLY create bike and bus related content
2. First script: Action-packed (chases, near-misses)
3. Second script: Emotional connection between bikes and buses
4. Use transportation sounds (honking, pedaling, engines)
5. NEVER include historical, domestic, or off-topic scenes`,
});

export const generateScript = model.startChat({
  history: [
  {
    role: "user",
    parts: [{ text: "Write two 30-second scripts about bikes and buses" }]
  },
  {
    role: "model",
    parts: [{
      text: `{
        "scripts": [
          {
            "title": "Bike vs Bus",
            "content": "A mountain biker cuts across traffic, hopping onto a bus lane. The pursuing bus driver lays on the horn. The biker pops a wheelie in defiance, then swerves as the bus nearly clips him. They race parallel until a red light - biker and driver make eye contact, then burst out laughing at the absurdity."
          },
          {
            "title": "Rainy Day Connection",
            "content": "A student's bike chain snaps during a storm. A bus pulls up beside her. The driver opens the door - 'Bikes allowed onboard after 7pm.' She wheels her dripping bike inside to find warm seats and smiling passengers. The bus becomes a moving sanctuary as rain sheets outside."
          }
        ]
      }`
    }]
  }
]
});

export const GenarateImageScript = model.startChat({
  history: [
    {
      role: "user",
      parts: [{
        text: `Generate Image prompt of Cinematic style with all details for each scene for 30 seconds video
Script: Rosa Parks refused to give up her seat on a bus in 1955. Her quiet act of defiance sparked the Montgomery Bus Boycott, a pivotal moment in the Civil Rights Movement. One person’s bravery can inspire lasting change for everyone.

Just give specific image prompt depending on the story line.
Do not give camera angle image prompt.

Follow the following schema and return JSON data (Max 4–5 Images)

[
  {
    "imagePrompt": "",
    "sceneContent": "<Script Content>"
  }
]`
      }]
    },
    {
      role: "model",
      parts: [{
        text: `[
  {
    "imagePrompt": "A dimly lit, vintage interior of a 1950s era bus. Focus on a Black woman, Rosa Parks, dressed in a modest coat and hat, seated calmly. The bus is filled with other passengers, some looking at her with curiosity, others with discomfort. The lighting emphasizes the isolation of Parks. The overall feel is one of quiet tension, reflecting the segregation laws of the time.",
    "sceneContent": "Rosa Parks refused to give up her seat on a bus in 1955."
  },
  {
    "imagePrompt": "Exterior shot of the Montgomery city streets in 1955. A wide angle showing rows of parked buses, mostly empty. People are walking, carpooling, and using alternative modes of transportation. Signs of protest are subtle but present – handwritten signs are visible in a few windows, and groups of people are engaged in quiet conversations. The mood is determined, yet somber.",
    "sceneContent": "Her quiet act of defiance sparked the Montgomery Bus Boycott"
  },
  {
    "imagePrompt": "A montage of historical news headlines from the mid-1950s, showcasing newspapers covering events such as bus protests, marches, and court cases related to civil rights. Headlines in bold typography, with images of civil rights figures. The overall design should emphasize the historical context and the gravity of the events.",
    "sceneContent": "a pivotal moment in the Civil Rights Movement."
  },
  {
    "imagePrompt": "Close-up shot of a diverse group of people walking arm-in-arm, smiling and sharing a sense of unity. The background shows a bright, sunny cityscape. The scene symbolizes hope and the positive impact of the movement for equality.",
    "sceneContent": "One person’s bravery can inspire lasting change for everyone."
  }
]`
      }]
    }
  ]
});
