import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { inMemoryUsers } from "../models/inMemoryDb.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Generate JWT Helper
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || "aura_lms_super_secret_session_token_key_1994", 
    { expiresIn: "30d" }
  );
};

// Helper to check MDB status
const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please supply all required signup details." });
    }

    if (isDbConnected()) {
      // --- MongoDB Mode ---
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "An account is already linked to this email address." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        enrolledCourses: []
      });

      const token = generateToken(newUser._id);
      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          bio: newUser.bio,
          avatar: newUser.avatar,
          targetSkills: newUser.targetSkills,
          notifications: newUser.notifications,
          enrolledCourses: newUser.enrolledCourses,
          quizScores: newUser.quizScores
        }
      });
    } else {
      // --- In-Memory Fallback Mode ---
      console.log("Using In-Memory Database Fallback for Signup");
      const userExists = inMemoryUsers.find((u) => u.email === email);
      if (userExists) {
        return res.status(400).json({ message: "An account is already linked to this email address." });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const mockId = "mock-user-" + Date.now();
      const newUser = {
        _id: mockId,
        name,
        email,
        password: hashedPassword,
        bio: "Aspiring Frontend Architect & Design Systems Lead.",
        avatar: "🎓",
        targetSkills: ["React", "CSS Mastery"],
        notifications: { push: true, email: false },
        enrolledCourses: [],
        quizScores: []
      };

      inMemoryUsers.push(newUser);
      const token = generateToken(mockId);

      return res.status(201).json({
        token,
        user: {
          id: mockId,
          name: newUser.name,
          email: newUser.email,
          bio: newUser.bio,
          avatar: newUser.avatar,
          targetSkills: newUser.targetSkills,
          notifications: newUser.notifications,
          enrolledCourses: newUser.enrolledCourses,
          quizScores: newUser.quizScores
        }
      });
    }
  } catch (error) {
    console.error("Signup Route Error:", error.message);
    res.status(500).json({ message: "Server encountered a registration error." });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please supply all required login credentials." });
    }

    if (isDbConnected()) {
      // --- MongoDB Mode ---
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password combination." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password combination." });
      }

      const token = generateToken(user._id);
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          targetSkills: user.targetSkills,
          notifications: user.notifications,
          enrolledCourses: user.enrolledCourses,
          quizScores: user.quizScores
        }
      });
    } else {
      // --- In-Memory Fallback Mode ---
      console.log("Using In-Memory Database Fallback for Login");
      const user = inMemoryUsers.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password combination." });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password combination." });
      }

      const token = generateToken(user._id);
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          targetSkills: user.targetSkills,
          notifications: user.notifications,
          enrolledCourses: user.enrolledCourses,
          quizScores: user.quizScores
        }
      });
    }
  } catch (error) {
    console.error("Login Route Error:", error.message);
    res.status(500).json({ message: "Server encountered an authentication error." });
  }
});

// @route   GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  try {
    if (isDbConnected()) {
      // --- MongoDB Mode ---
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User account not found." });
      }
      return res.json(user);
    } else {
      // --- In-Memory Fallback Mode ---
      console.log("Using In-Memory Database Fallback for Me session");
      const user = inMemoryUsers.find((u) => u._id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User account not found." });
      }
      
      const userClone = { ...user };
      delete userClone.password;
      return res.json(userClone);
    }
  } catch (error) {
    console.error("Me Route Error:", error.message);
    res.status(500).json({ message: "Server failed to fetch session details." });
  }
});

// @route   PUT /api/auth/settings
router.put("/settings", protect, async (req, res) => {
  try {
    const { name, bio, targetSkills, notifications } = req.body;

    if (isDbConnected()) {
      // --- MongoDB Mode ---
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User account not found." });
      }

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (targetSkills) user.targetSkills = targetSkills;
      if (notifications) user.notifications = notifications;

      await user.save();
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        targetSkills: user.targetSkills,
        notifications: user.notifications,
        enrolledCourses: user.enrolledCourses,
        quizScores: user.quizScores
      });
    } else {
      // --- In-Memory Fallback Mode ---
      console.log("Using In-Memory Database Fallback for Settings update");
      const userIdx = inMemoryUsers.findIndex((u) => u._id === req.user.id);
      if (userIdx === -1) {
        return res.status(404).json({ message: "User account not found." });
      }

      const user = inMemoryUsers[userIdx];
      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (targetSkills) user.targetSkills = targetSkills;
      if (notifications) user.notifications = notifications;

      inMemoryUsers[userIdx] = user;

      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        targetSkills: user.targetSkills,
        notifications: user.notifications,
        enrolledCourses: user.enrolledCourses,
        quizScores: user.quizScores
      });
    }
  } catch (error) {
    console.error("Settings Update Error:", error.message);
    res.status(500).json({ message: "Server failed to update settings details." });
  }
});

export default router;
