import express from "express";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { inMemoryCourses, inMemoryUsers } from "../models/inMemoryDb.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/courses
router.get("/", protect, async (req, res) => {
  try {
    if (isDbConnected()) {
      const courses = await Course.find();
      return res.json(courses);
    } else {
      console.log("Using In-Memory Database Fallback for Course catalog");
      return res.json(inMemoryCourses);
    }
  } catch (error) {
    console.error("Fetch Courses Error:", error.message);
    res.status(500).json({ message: "Server failed to retrieve course catalog." });
  }
});

// @route   POST /api/courses/enroll/:id
router.post("/enroll/:id", protect, async (req, res) => {
  try {
    const courseId = req.params.id;

    if (isDbConnected()) {
      // --- MongoDB Mode ---
      const course = await Course.findOne({ id: courseId });
      if (!course) {
        return res.status(404).json({ message: "Requested course syllabus not found." });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User account not found." });
      }

      const alreadyEnrolled = user.enrolledCourses.some((c) => c.courseId === courseId);
      if (alreadyEnrolled) {
        return res.status(400).json({ message: "You are already enrolled in this course." });
      }

      user.enrolledCourses.push({ courseId, progress: 0, completedModules: [] });
      await user.save();

      return res.json({
        message: "Enrolled in course successfully!",
        enrolledCourses: user.enrolledCourses
      });
    } else {
      // --- In-Memory Fallback Mode ---
      console.log("Using In-Memory Database Fallback for Enrollment");
      const course = inMemoryCourses.find((c) => c.id === courseId);
      if (!course) {
        return res.status(404).json({ message: "Requested course syllabus not found." });
      }

      const userIdx = inMemoryUsers.findIndex((u) => u._id === req.user.id);
      if (userIdx === -1) {
        return res.status(404).json({ message: "User account not found." });
      }

      const user = inMemoryUsers[userIdx];
      const alreadyEnrolled = user.enrolledCourses.some((c) => c.courseId === courseId);
      if (alreadyEnrolled) {
        return res.status(400).json({ message: "You are already enrolled in this course." });
      }

      user.enrolledCourses.push({ courseId, progress: 0, completedModules: [] });
      inMemoryUsers[userIdx] = user;

      return res.json({
        message: "Enrolled in course successfully!",
        enrolledCourses: user.enrolledCourses
      });
    }
  } catch (error) {
    console.error("Course Enrollment Error:", error.message);
    res.status(500).json({ message: "Server failed to register course enrollment." });
  }
});

// @route   PUT /api/courses/module/:id
router.put("/module/:id", protect, async (req, res) => {
  try {
    const courseId = req.params.id;
    const { moduleId } = req.body;

    if (!moduleId) {
      return res.status(400).json({ message: "Please specify target moduleId to check off." });
    }

    if (isDbConnected()) {
      // --- MongoDB Mode ---
      const course = await Course.findOne({ id: courseId });
      if (!course) {
        return res.status(404).json({ message: "Requested course syllabus not found." });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User account not found." });
      }

      const enrollmentIdx = user.enrolledCourses.findIndex((c) => c.courseId === courseId);
      if (enrollmentIdx === -1) {
        return res.status(400).json({ message: "You must first enroll in this course." });
      }

      const enrollment = user.enrolledCourses[enrollmentIdx];
      let modulesList = [...enrollment.completedModules];

      if (modulesList.includes(moduleId)) {
        modulesList = modulesList.filter((id) => id !== moduleId);
      } else {
        modulesList.push(moduleId);
      }

      const totalModules = course.syllabus.length;
      const calculatedProgress = totalModules > 0 ? Math.round((modulesList.length / totalModules) * 100) : 0;

      user.enrolledCourses[enrollmentIdx].completedModules = modulesList;
      user.enrolledCourses[enrollmentIdx].progress = calculatedProgress;

      await user.save();

      return res.json({
        message: "Module checkoff toggled successfully!",
        enrolledCourses: user.enrolledCourses
      });
    } else {
      // --- In-Memory Fallback Mode ---
      console.log("Using In-Memory Database Fallback for Module complete");
      const course = inMemoryCourses.find((c) => c.id === courseId);
      if (!course) {
        return res.status(404).json({ message: "Requested course syllabus not found." });
      }

      const userIdx = inMemoryUsers.findIndex((u) => u._id === req.user.id);
      if (userIdx === -1) {
        return res.status(404).json({ message: "User account not found." });
      }

      const user = inMemoryUsers[userIdx];
      const enrollmentIdx = user.enrolledCourses.findIndex((c) => c.courseId === courseId);
      if (enrollmentIdx === -1) {
        return res.status(400).json({ message: "You must first enroll in this course." });
      }

      const enrollment = user.enrolledCourses[enrollmentIdx];
      let modulesList = [...enrollment.completedModules];

      if (modulesList.includes(moduleId)) {
        modulesList = modulesList.filter((id) => id !== moduleId);
      } else {
        modulesList.push(moduleId);
      }

      const totalModules = course.syllabus.length;
      const calculatedProgress = totalModules > 0 ? Math.round((modulesList.length / totalModules) * 100) : 0;

      user.enrolledCourses[enrollmentIdx].completedModules = modulesList;
      user.enrolledCourses[enrollmentIdx].progress = calculatedProgress;

      inMemoryUsers[userIdx] = user;

      return res.json({
        message: "Module checkoff toggled successfully!",
        enrolledCourses: user.enrolledCourses
      });
    }
  } catch (error) {
    console.error("Module Toggle Error:", error.message);
    res.status(500).json({ message: "Server failed to commit module checklist." });
  }
});

// @route   PUT /api/courses/reset/:id
router.put("/reset/:id", protect, async (req, res) => {
  try {
    const courseId = req.params.id;

    if (isDbConnected()) {
      // --- MongoDB Mode ---
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User account not found." });
      }

      const enrollmentIdx = user.enrolledCourses.findIndex((c) => c.courseId === courseId);
      if (enrollmentIdx === -1) {
        return res.status(400).json({ message: "You must first enroll in this course." });
      }

      // Reset progress and modules checklist
      user.enrolledCourses[enrollmentIdx].completedModules = [];
      user.enrolledCourses[enrollmentIdx].progress = 0;

      // Clean up any quiz score records for this course to allow complete restart
      user.quizScores = user.quizScores.filter((q) => q.courseId !== courseId);

      await user.save();

      return res.json({
        message: "Course progress reset successfully!",
        enrolledCourses: user.enrolledCourses,
        quizScores: user.quizScores
      });
    } else {
      // --- In-Memory Fallback Mode ---
      console.log("Using In-Memory Database Fallback for Course Reset");
      const userIdx = inMemoryUsers.findIndex((u) => u._id === req.user.id);
      if (userIdx === -1) {
        return res.status(404).json({ message: "User account not found." });
      }

      const user = inMemoryUsers[userIdx];
      const enrollmentIdx = user.enrolledCourses.findIndex((c) => c.courseId === courseId);
      if (enrollmentIdx === -1) {
        return res.status(400).json({ message: "You must first enroll in this course." });
      }

      // Reset progress and modules checklist
      user.enrolledCourses[enrollmentIdx].completedModules = [];
      user.enrolledCourses[enrollmentIdx].progress = 0;

      // Clean up any quiz score records for this course
      user.quizScores = user.quizScores.filter((q) => q.courseId !== courseId);

      inMemoryUsers[userIdx] = user;

      return res.json({
        message: "Course progress reset successfully!",
        enrolledCourses: user.enrolledCourses,
        quizScores: user.quizScores
      });
    }
  } catch (error) {
    console.error("Course Reset Error:", error.message);
    res.status(500).json({ message: "Server failed to reset course progress." });
  }
});

export default router;
