import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { explainWeakTopics } from "../services/llm.service.js";

export const getAIExplanation = asyncHandler(async (req, res) => {
  const { topics = [] } = req.body;

  if (!Array.isArray(topics)) {
    throw new ApiError(400, "topics must be an array");
  }

  const explanation = await explainWeakTopics(topics);

  return res
    .status(200)
    .json(new ApiResponse(200, { topics, explanation }, "AI explanation generated"));
});