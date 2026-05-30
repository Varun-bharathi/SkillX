import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    required: true
  }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  courseId: {
    type: String,
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  durationSeconds: {
    type: Number,
    required: true,
    default: 180
  },
  questions: {
    type: [quizQuestionSchema],
    default: []
  }
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
