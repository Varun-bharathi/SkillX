import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Route modules
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import quizRoutes from "./routes/quizzes.js";
import llmRoutes from "./routes/llm.js";

// Load configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors()); // Allow cross-origin requests from React dev server (port 5173)
app.use(express.json()); // Parse incoming JSON payloads

// Root status check
app.get("/api/status", (req, res) => {
  res.json({ status: "AuraLMS Server is healthy and running!" });
});

// Routing Subpaths
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/llm", llmRoutes);

// Generic global error handling middleware
app.use((err, req, res, next) => {
  console.error("Express Error Handler:", err.stack);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const connectDbAndStartServer = async () => {
  try {
    const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/auralms";
    await mongoose.connect(dbUri);
    console.log("Mongoose connected successfully to MongoDB database!");
  } catch (error) {
    console.warn("WARNING: Database connection failure:", error.message);
    console.warn("Express server will start with In-Memory Database Fallback mode active.");
  }

  app.listen(PORT, () => {
    console.log(`Express server listening cleanly on port ${PORT} (http://localhost:${PORT})`);
  });
};

connectDbAndStartServer();
