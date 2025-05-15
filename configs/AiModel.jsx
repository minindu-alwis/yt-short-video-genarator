const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
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