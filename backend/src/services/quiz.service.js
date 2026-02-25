import { getGroqClient } from "./llm.service.js";
import { ApiError } from "../utils/ApiError.js";

export const generateQuizQuestions = async (topic) => {
  try {
    const client = getGroqClient();

    const systemPrompt = `You are an expert quiz creator specializing in generating educational multiple-choice questions. 
Create high-quality, diverse quiz questions that test understanding and application of concepts, not just memorization.
Vary question types: definitional, conceptual, practical, analytical, and scenario-based.
Ensure options are plausible distractors - avoid obviously wrong answers.`;

    const userPrompt = `Generate exactly 5 diverse, high-quality multiple-choice quiz questions about "${topic}".

Requirements:
1. Questions should cover different aspects and difficulty levels
2. Each question should have exactly 4 options
3. Vary the correct answer position (don't always put it in the same spot)
4. Options should be plausible - test real understanding, not trick questions
5. Include at least one scenario-based or application question
6. Make questions specific to the topic, not generic

Format your response as a valid JSON array with this exact structure (and NOTHING else):
[
  {
    "question": "What is...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "concept": "Concept name"
  }
]

Topic: ${topic}

Generate the quiz questions now:`;

    const message = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9, // Higher temperature for more creative variations
      max_tokens: 2000,
    });

    const responseText = message.choices?.[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from Groq");
    }

    // Parse JSON from response
    let questions;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }
      questions = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse Groq response:", responseText);
      throw new Error(`Failed to parse quiz questions: ${parseError.message}`);
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No valid questions generated");
    }

    // Ensure all questions have required fields
    const validatedQuestions = questions.slice(0, 5).map((q, index) => ({
      question: q.question || `Question ${index + 1}`,
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options
        : ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: q.correctAnswer || q.options?.[0] || "Option A",
      concept: q.concept || `${topic} - Topic ${index + 1}`,
    }));

    return validatedQuestions;
  } catch (error) {
    console.error("Quiz generation error:", error?.message || error);
    throw new ApiError(
      500,
      `Failed to generate quiz questions: ${error?.message || "Unknown error"}`
    );
  }
};
