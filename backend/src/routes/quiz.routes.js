import express from "express";
import { submitQuiz } from "../controllers/quiz.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/submit", verifyJWT, submitQuiz);

export default router;