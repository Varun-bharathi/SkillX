import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { course, topic } = req.body;

  try {
    if (!course || !topic) {
      return res.status(400).json({ message: "Course and topic are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !apiKey || apiKey === "your_google_gemini_api_key_here" || apiKey.trim() === "";

    if (isPlaceholder) {
      console.warn("Video Notice: GEMINI_API_KEY not configured or placeholder in backend/.env. Using mock slides fallback.");
      return res.json({ success: true, slides: getMockSlides(topic), fallback: true });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash"
    ];

    const prompt = `You are an expert educational content creator.
Create a slideshow presentation for the topic "${topic}" within the context of the course "${course}".
Return the response strictly as a JSON array of slide objects. Do not include any markdown formatting like \`\`\`json.
Each slide object MUST have:
- "title": A short title for the slide.
- "content": Bullet points or short text to display on the slide.
- "narration": A conversational script to be read aloud via Text-to-Speech explaining the content of this slide.

Example format:
[
  {
    "title": "Introduction to Hooks",
    "content": "- What are React Hooks?\\n- Why use them?",
    "narration": "Welcome to this module. Today we are going to learn about React Hooks, what they are, and why they are useful in functional components."
  }
]

Please generate 4 to 6 slides.`;

    let result = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        lastError = err;
        console.warn(`Video Generation: model ${modelName} unavailable (${err.message}). Trying next...`);
      }
    }

    if (!result) {
      throw lastError || new Error("All candidate models failed to generate presentation.");
    }

    let text = result.response.text();
    
    // Clean up potential markdown formatting in the LLM response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const slides = JSON.parse(text);

    return res.json({ success: true, slides });

  } catch (error) {
    console.error("Video Generation Error:", error.message);
    console.log("Falling back to mock slides due to API error...");
    res.json({ success: true, slides: getMockSlides(topic), fallback: true });
  }
});

function getMockSlides(topic) {
  return [
    {
      title: topic || "Module Overview",
      content: "- Welcome to this module.\n- Comprehensive overview and key learning goals.\n- Practical real-world examples.",
      narration: `Welcome to this module covering ${topic || "this topic"}. Here you will explore key concepts and practical applications.`
    },
    {
      title: "Core Concepts",
      content: "- Understand the foundational principles.\n- Apply the knowledge in coding exercises.\n- Test your understanding in the quiz.",
      narration: "It is important to master these fundamental principles. Once you complete this walkthrough, proceed to the practice quiz."
    }
  ];
}

export default router;
