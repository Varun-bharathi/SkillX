import mongoose from "mongoose";

const syllabusItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    default: 4.5
  },
  reviewsCount: {
    type: Number,
    required: true,
    default: 100
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"]
  },
  skills: {
    type: [String],
    default: []
  },
  syllabus: {
    type: [syllabusItemSchema],
    default: []
  },
  quizId: {
    type: String
  },
  recommendationReason: {
    type: String
  },
  skillMatch: {
    type: Number,
    default: 80
  }
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;
