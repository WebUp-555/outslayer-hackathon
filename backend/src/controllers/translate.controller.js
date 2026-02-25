import { translateText, detectLanguage } from "../services/translate.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const translate = asyncHandler(async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    throw new ApiError(400, "Text and target language are required");
  }

  const translatedText = await translateText(text, targetLanguage);

  return res.status(200).json(
    new ApiResponse(200, { originalText: text, translatedText, targetLanguage }, "Text translated successfully")
  );
});

export const detect = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    throw new ApiError(400, "Text is required");
  }

  const language = await detectLanguage(text);

  return res.status(200).json(
    new ApiResponse(200, { text, detectedLanguage: language }, "Language detected successfully")
  );
});
