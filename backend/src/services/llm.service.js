import Groq from "groq-sdk";
import { ApiError } from "../utils/ApiError.js";

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new ApiError(500, "GROQ_API_KEY is not configured");
  }

  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export const explainWeakTopics = async (topics = []) => {
  if (!Array.isArray(topics)) {
    throw new ApiError(400, "topics must be an array");
  }

  if (!topics.length) {
    return "Great job! No weak areas detected.";
  }

  const prompt = `
Explain these weak topics in simple student-friendly language:
${topics.join(", ")}

Return 3-6 concise bullet points only.
Each bullet should be short, clear, and practical.
Include one quick example where helpful.
`;

  try {
    const groq = getGroqClient();

    const chat = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    return chat.choices?.[0]?.message?.content || "Unable to generate explanation right now.";
  } catch (error) {
    throw new ApiError(502, "Failed to generate AI explanation", [error?.message]);
  }
};