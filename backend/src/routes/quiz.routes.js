import express from "express";
import { generateQuiz, submitQuiz } from "../controllers/quiz.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/generate", verifyJWT, generateQuiz);
router.post("/submit", verifyJWT, submitQuiz);

export default router;