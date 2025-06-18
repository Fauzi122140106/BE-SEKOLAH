import { Router } from "express";
import authRoutes from "./auth/AuthRoute";
import newsRoutes from "./master/news";
import facilityRoutes from "./master/facilityRoutes";
import galleryRoutes from "./master/galleryRoutes";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

router.use("/news", newsRoutes);

router.get("/facilityRoutes", facilityRoutes);

router.get("/galleryRoutes", galleryRoutes);
export default router;
