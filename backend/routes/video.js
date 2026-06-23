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
    if (!apiKey) {
      return res.status(500).json({ message: "LLM API key is not configured on the server." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean up potential markdown formatting in the LLM response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const slides = JSON.parse(text);

    return res.json({ success: true, slides });

  } catch (error) {
    console.error("Video Generation Error:", error.message);
    console.log("Falling back to mock slides due to API error...");
    
    // Mock slides fallback so the feature works even if API is down
    const mockSlides = [
      {
        title: topic,
        content: "- Welcome to this module.\\n- We are currently using fallback data.\\n- The AI service is currently experiencing high demand.",
        "narration": "Welcome to this module. The AI service is currently experiencing high demand, so we are showing you this fallback presentation. You can still test the video controls and voice synthesis."
      },
      {
        title: "Key Concepts",
        content: "- Understand the core principles.\\n- Apply the knowledge in practice.\\n- Complete the quiz.",
        "narration": "In this course, it is important to understand the core principles and apply your knowledge. Once you are done, don't forget to take the certification exam."
      }
    ];

    res.json({ success: true, slides: mockSlides, fallback: true });
  }
});

export default router;
