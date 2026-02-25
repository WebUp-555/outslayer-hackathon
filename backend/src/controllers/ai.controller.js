import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { explainWeakTopics } from "../services/llm.service.js";

export const getAIExplanation = asyncHandler(async (req, res) => {
  const { topics = [], style = "clear-points" } = req.body;

  if (!Array.isArray(topics)) {
    throw new ApiError(400, "topics must be an array");
  }

  const allowedStyles = ["elaborate", "simple", "clear-points"];
  if (!allowedStyles.includes(style)) {
    throw new ApiError(400, "style must be one of: elaborate, simple, clear-points");
  }

  const explanation = await explainWeakTopics(topics, style);

  return res
    .status(200)
    .json(new ApiResponse(200, { topics, style, explanation }, "AI explanation generated"));
});