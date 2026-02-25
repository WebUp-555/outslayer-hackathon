import { Router } from "express";
import { getDashboardAnalytics } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/dashboard/analytics", verifyJWT, getDashboardAnalytics);

export default router;
