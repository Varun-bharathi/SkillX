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
      console.warn("LLM Notice: GEMINI_API_KEY is not configured or placeholder in backend/.env. Returning fallback course material.");
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      const fallbackContent = `# ${topic}\n\n*Part of the course: ${course}*\n\n> 💡 **Notice:** Using offline learning material because a valid \`GEMINI_API_KEY\` has not been set yet in \`backend/.env\`. To enable live Gemini AI generation, add your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) to \`backend/.env\`.\n\n## Overview\nIn this section, we cover the core concepts and real-world applications of **${topic}**.\n\n### Key Concepts\n- **Foundations:** Learn the primary architecture and syntax.\n- **Best Practices:** Writing clean, scalable, and maintainable code.\n- **Practical Application:** Integrating this knowledge into your current workflow.\n\n### Example Code / Walkthrough\n\`\`\`javascript\n// Sample implementation for ${topic}\nfunction demonstrateConcept() {\n  console.log("Exploring ${topic} in ${course}!");\n}\ndemonstrateConcept();\n\`\`\`\n\n### Next Steps\n1. Review the key points above.\n2. Proceed to the interactive quiz to test your mastery.\n3. Continue to the next module in this track.\n`;
      return res.end(fallbackContent);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash"
    ];

    const prompt = `You are an expert educational content creator. 
Generate comprehensive, well-structured text content for the topic "${topic}" within the context of the course "${course}".
The content should be in Markdown format, easy to read, include examples if applicable, and be highly educational.`;

    let generatedText = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        if (result && result.response) {
          generatedText = result.response.text();
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} unavailable (${err.message}). Trying next candidate...`);
      }
    }

    if (!generatedText) {
      throw lastError || new Error("All candidate models failed to generate content.");
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // Stream text in small chunks for a smooth typewriter effect on frontend
    const chunkSize = 32;
    for (let i = 0; i < generatedText.length; i += chunkSize) {
      if (req.socket.destroyed) break; // Client aborted/navigated away
      const chunk = generatedText.slice(i, i + chunkSize);
      res.write(chunk);
      // Brief pause to simulate smooth streaming
      await new Promise((resolve) => setTimeout(resolve, 15));
    }
    
    res.end();
  } catch (error) {
    console.error("LLM Error:", error.message || error);
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(`# ${topic}\n\n*Course: ${course}*\n\n> ⚠️ **AI Generation Notice:** Unable to reach Gemini API (${error.message || "Invalid API key"}). Please verify your \`GEMINI_API_KEY\` in \`backend/.env\`.\n\n### Topic Summary\nWelcome to **${topic}**. Review the core lessons and quizzes for this module to continue advancing your learning track.`);
    } else {
      res.write("\n\n**Error:** The generation was interrupted.");
      res.end();
    }
  }
});

export default router;
