import { Router } from "express";
import authRoutes from "./auth/AuthRoute";
import newsRoutes from "./master/news";
import facilityRoutes from "./master/facilityRoutes";
import galleryRoutes from "./master/galleryRoutes";
import AuthController from "../controllers/auth/AuthController";
import dashboardRoutes from "./master/dashboardRoutes";

const router = Router();

// Auth routes
router.post("/login", AuthController.login);

router.use("/auth", authRoutes);

router.use("/news", newsRoutes);

router.get("/facilityRoutes", facilityRoutes);

router.get("/galleryRoutes", galleryRoutes);

router.get("/dashboard", dashboardRoutes);

export default router;
