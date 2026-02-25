import Quiz from "../models/quiz.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    return res.status(401).json(new ApiResponse(401, null, "User not authenticated"));
  }

  // Fetch all quizzes for the user
  const quizzes = await Quiz.find({ userId }).select("score topic");

  if (!quizzes || quizzes.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, {
        completedQuizzes: 0,
        aiAccuracy: 0,
        progress: 0,
        topicsCovered: [],
      }, "No quizzes completed yet")
    );
  }

  // Calculate analytics
  const completedQuizzes = quizzes.length;
  const aiAccuracy = Math.round(
    quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length
  );
  const progress = Math.min(100, Math.round((completedQuizzes / 15) * 100)); // Assuming 15 quizzes for 100% progress
  const topicsCovered = [...new Set(quizzes.map(q => q.topic))];

  return res.status(200).json(
    new ApiResponse(200, {
      completedQuizzes,
      aiAccuracy,
      progress,
      topicsCovered,
    }, "Dashboard analytics retrieved successfully")
  );
});
