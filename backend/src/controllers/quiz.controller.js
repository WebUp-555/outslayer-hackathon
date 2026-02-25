import Quiz from "../models/quiz.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const submitQuiz = asyncHandler(async (req, res) => {
  const { topic, questions, score, weakAreas } = req.body;

  if (!topic) {
    throw new ApiError(400, "Topic is required");
  }

  if (!Array.isArray(questions) || !questions.length) {
    throw new ApiError(400, "Questions must be a non-empty array");
  }

  const quiz = await Quiz.create({
    userId: req.user.id,
    topic,
    questions,
    score,
    weakAreas: Array.isArray(weakAreas) ? weakAreas : [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { quiz }, "Quiz saved"));
});