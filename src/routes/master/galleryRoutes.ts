import { Router } from "express";
import GalleryController from "../../controllers/GalleryController";
import { authenticate } from "../../middleware/AuthMiddleware";
import upload from "../../middleware/uploadMiddleware";
console.log("galleryRoutes loaded");
const router = Router();

router.get("/gallery", GalleryController.getAll);
router.post(
  "/gallery",
  authenticate,
  upload.single("image"),
  GalleryController.create
);
router.delete("/gallery/:id", authenticate, GalleryController.delete);
router.put("/gallery/:id", authenticate, GalleryController.update);

export default router;
