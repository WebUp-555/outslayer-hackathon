import express from "express";
import { getAIExplanation } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/explain", verifyJWT, getAIExplanation);

export default router;