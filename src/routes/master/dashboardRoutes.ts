import { Router } from "express";
import { adminOnly, authenticate } from "../../middleware/AuthMiddleware";

const router = Router();

router.get("/", authenticate, adminOnly); // Butuh token dan role admin

export default router;
