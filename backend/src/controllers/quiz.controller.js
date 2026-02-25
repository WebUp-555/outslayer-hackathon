import Quiz from "../models/quiz.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { explainWeakTopics } from "../services/llm.service.js";
import { generateQuizQuestions } from "../services/quiz.service.js";

export const generateQuiz = asyncHandler(async (req, res) => {
  const { topic } = req.body;

  if (!topic || !String(topic).trim()) {
    throw new ApiError(400, "Topic is required");
  }

  const questions = await generateQuizQuestions(String(topic).trim());
  return res.status(200).json(questions);
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const { topic, questions } = req.body;

  if (!topic) {
    throw new ApiError(400, "Topic is required");
  }

  if (!Array.isArray(questions) || !questions.length) {
    throw new ApiError(400, "Questions must be a non-empty array");
  }

  const totalQuestions = questions.length;
  const correctCount = questions.filter(question => question.selected === question.correct).length;
  const score = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const weakAreas = questions
    .filter(question => question.selected !== question.correct)
    .map(question => question.concept)
    .filter(Boolean);

  let explanation = "Great job! No weak areas detected.";
  if (weakAreas.length) {
    try {
      explanation = await explainWeakTopics(weakAreas);
    } catch {
      explanation = `Focus on: ${weakAreas.join(", ")}. Review fundamentals and practice with examples to improve.`;
    }
  }

  const quiz = await Quiz.create({
    userId: req.user.id,
    topic,
    questions,
    score,
    weakAreas,
  });

  return res.status(201).json({
    score,
    weakAreas,
    explanation,
    quizId: quiz._id,
  });
});