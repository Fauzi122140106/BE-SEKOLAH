import { Router } from "express";
import AuthController from "../../controllers/auth/AuthController";
import { authenticate } from "../../middleware/AuthMiddleware";

const router = Router();

// Public route
router.post("/login", AuthController.login);

// Protected routes
router.get("/profile", authenticate, AuthController.getProfile);
router.post("/logout", authenticate, AuthController.logout);

export default router;
