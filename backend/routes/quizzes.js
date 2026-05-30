import express from "express";
import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import { inMemoryQuizzes, inMemoryUsers } from "../models/inMemoryDb.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/quizzes/:courseId
router.get("/:courseId", protect, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    if (isDbConnected()) {
      const quiz = await Quiz.findOne({ courseId });
      if (!quiz) {
        return res.status(404).json({ message: "Requested quiz assessment not found." });
      }
      return res.json(quiz);
    } else {
      console.log("Using In-Memory Database Fallback for Quiz questions");
      const quiz = inMemoryQuizzes.find((q) => q.courseId === courseId);
      if (!quiz) {
        return res.status(404).json({ message: "Requested quiz assessment not found." });
      }
      return res.json(quiz);
    }
  } catch (error) {
    console.error("Fetch Quiz Error:", error.message);
    res.status(500).json({ message: "Server failed to retrieve quiz questions." });
  }
});

// @route   POST /api/quizzes/submit
router.post("/submit", protect, async (req, res) => {
  try {
    const { courseId, courseTitle, score, totalQuestions } = req.body;

    if (!courseId || !courseTitle || score === undefined || !totalQuestions) {
      return res.status(400).json({ message: "Please supply all required quiz score data." });
    }

    if (isDbConnected()) {
      // --- MongoDB Mode ---
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User account not found." });
      }

      const scorePct = Math.round((score / totalQuestions) * 100);
      const newAttempt = {
        courseId,
        courseTitle,
        score: scorePct,
        totalQuestions,
        date: new Date().toISOString().split("T")[0]
      };

      user.quizScores.unshift(newAttempt);

      const enrollmentIdx = user.enrolledCourses.findIndex((c) => c.courseId === courseId);
      if (enrollmentIdx !== -1) {
        const cur = user.enrolledCourses[enrollmentIdx];
        user.enrolledCourses[enrollmentIdx].progress = Math.min(cur.progress + 15, 100);
      }

      await user.save();

      return res.json({
        message: "Score submitted successfully!",
        quizScores: user.quizScores,
        enrolledCourses: user.enrolledCourses
      });
    } else {
      // --- In-Memory Fallback Mode ---
      console.log("Using In-Memory Database Fallback for Score submit");
      const userIdx = inMemoryUsers.findIndex((u) => u._id === req.user.id);
      if (userIdx === -1) {
        return res.status(404).json({ message: "User account not found." });
      }

      const user = inMemoryUsers[userIdx];
      const scorePct = Math.round((score / totalQuestions) * 100);
      const newAttempt = {
        id: "attempt-" + Date.now(),
        courseId,
        courseTitle,
        score: scorePct,
        totalQuestions,
        date: new Date().toISOString().split("T")[0]
      };

      user.quizScores.unshift(newAttempt);

      const enrollmentIdx = user.enrolledCourses.findIndex((c) => c.courseId === courseId);
      if (enrollmentIdx !== -1) {
        const cur = user.enrolledCourses[enrollmentIdx];
        user.enrolledCourses[enrollmentIdx].progress = Math.min(cur.progress + 15, 100);
      }

      inMemoryUsers[userIdx] = user;

      return res.json({
        message: "Score submitted successfully!",
        quizScores: user.quizScores,
        enrolledCourses: user.enrolledCourses
      });
    }
  } catch (error) {
    console.error("Submit Quiz Error:", error.message);
    res.status(500).json({ message: "Server failed to commit quiz assessment." });
  }
});

export default router;
