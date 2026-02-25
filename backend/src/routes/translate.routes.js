import { Router } from "express";
import { translate, detect } from "../controllers/translate.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/translate", verifyJWT, translate);
router.post("/detect", verifyJWT, detect);

export default router;
