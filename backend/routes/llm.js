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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert educational content creator. 
Generate comprehensive, well-structured text content for the topic "${topic}" within the context of the course "${course}".
The content should be in Markdown format, easy to read, include examples if applicable, and be highly educational.`;

    const result = await model.generateContentStream(prompt);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }
    
    res.end();
  } catch (error) {
    console.error("LLM Error:", error);
    // If headers haven't been sent yet, we can send a 500. Otherwise, we just end the stream.
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Failed to generate content", error: error.message });
    } else {
      res.write("\n\n**Error:** The generation was interrupted.");
      res.end();
    }
  }
});

export default router;
