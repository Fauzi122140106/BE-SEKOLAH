import { Router } from "express";
import authRoutes from "./auth/AuthRoute";
import newsRoutes from "./master/news";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

router.use("/news", newsRoutes);
export default router;
