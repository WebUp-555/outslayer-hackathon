import Quiz from "../models/quiz.model.js";
import { explainWeakTopics } from "../services/llm.service.js";

export const submitQuiz = async (req, res) => {
  const { topic, questions } = req.body;

  // Detect weak concepts
  const weakAreas = questions
    .filter(q => q.selected !== q.correct)
    .map(q => q.concept);

  const score =
    ((questions.length - weakAreas.length) / questions.length) * 100;

  // AI Explanation
  const explanation = await explainWeakTopics(weakAreas);

  const quiz = await Quiz.create({
    userId: req.user.id,
    topic,
    questions,
    score,
    weakAreas
  });

  res.json({
    score,
    weakAreas,
    explanation
  });
};