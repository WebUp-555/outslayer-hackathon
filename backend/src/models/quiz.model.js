import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, trim: true },
    userAnswer: { type: String, default: "" },
    correctAnswer: { type: String, default: "" },
    isCorrect: { type: Boolean, default: false },
    concept: { type: String, trim: true },
    selected: { type: String, default: "" },
    correct: { type: String, default: "" },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
    },
    weakAreas: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);