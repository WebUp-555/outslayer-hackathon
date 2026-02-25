import Groq from "groq-sdk";
import { ApiError } from "../utils/ApiError.js";

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new ApiError(500, "GROQ_API_KEY is not configured");
  }

  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export const explainWeakTopics = async (topics = [], style = "clear-points") => {
  if (!Array.isArray(topics)) {
    throw new ApiError(400, "topics must be an array");
  }

  if (!topics.length) {
    return "Great job! No weak areas detected.";
  }

  const styleInstructionMap = {
    elaborate: `Write an elaborate explanation with depth and detail.
Use short paragraphs, include examples, and explain why each concept matters.
Keep it easy to understand but comprehensive.`,
    simple: `Write a very simple explanation for beginners.
Use short sentences and plain language.
Avoid jargon and keep it easy to grasp quickly.`,
    "clear-points": `Return 3-6 concise bullet points only.
Each bullet should be short, clear, and practical.
Include one quick example where helpful.`,
  };

  const instruction = styleInstructionMap[style] || styleInstructionMap["clear-points"];

  const prompt = `
Explain these weak topics in student-friendly language:
${topics.join(", ")}

Style: ${style}
${instruction}
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