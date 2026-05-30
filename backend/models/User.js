import mongoose from "mongoose";

const enrolledCourseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  completedModules: {
    type: [String],
    default: []
  }
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => "attempt-" + Date.now()
  },
  courseId: {
    type: String,
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split("T")[0]
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: "Aspiring Tech Lead & Lifelong Learner."
  },
  avatar: {
    type: String,
    default: "🎓"
  },
  targetSkills: {
    type: [String],
    default: ["React", "CSS Mastery"]
  },
  notifications: {
    push: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    }
  },
  enrolledCourses: {
    type: [enrolledCourseSchema],
    default: []
  },
  quizScores: {
    type: [quizAttemptSchema],
    default: []
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
