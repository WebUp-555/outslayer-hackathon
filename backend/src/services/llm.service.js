import Groq from "groq-sdk";
import { ApiError } from "../utils/ApiError.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const explainWeakTopics = async (topics = []) => {
  if (!Array.isArray(topics)) {
    throw new ApiError(400, "topics must be an array");
  }

  if (!topics.length) {
    return "Great job! No weak areas detected.";
  }

  if (!process.env.GROQ_API_KEY) {
    throw new ApiError(500, "GROQ_API_KEY is not configured");
  }

  const prompt = `
Explain these weak topics in simple student-friendly language:
${topics.join(", ")}

Give short explanations + 1 example each.
`;

  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    return chat.choices?.[0]?.message?.content || "Unable to generate explanation right now.";
  } catch (error) {
    throw new ApiError(502, "Failed to generate AI explanation", [error?.message]);
  }
};