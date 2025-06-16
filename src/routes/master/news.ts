import { Router } from "express";
import NewsController from "../../controllers/master/NewsController";
import { authenticate } from "../../middleware/AuthMiddleware";
import upload from "../../middleware/uploadMiddleware"; // pastikan path-nya sesuai

const router = Router();

// Public
router.get("/", NewsController.getAll);
router.get("/:id", NewsController.getById);

// Only admin (authenticated) can do CRUD
router.post("/", authenticate, upload.single("image"), NewsController.create);
router.put("/:id", authenticate, upload.single("image"), NewsController.update);
router.delete("/:id", authenticate, NewsController.delete);

export default router;
