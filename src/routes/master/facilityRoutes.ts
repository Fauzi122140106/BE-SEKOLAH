import { Router } from "express";
import FacilityController from "../../controllers/master/FacilityController";
import { authenticate } from "../../middleware/AuthMiddleware";
import multer from "multer";
import path from "path";

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/facilities"); // simpan file di folder ini
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = Router();

router.get("/facilities", FacilityController.getAll);
router.get("/facilities/:slug", FacilityController.getBySlug);
router.post(
  "/facilities",
  authenticate,
  upload.single("image"), // proses file
  FacilityController.create
);
router.put("/facilities/:id", authenticate, FacilityController.update);
router.delete("/facilities/:id", authenticate, FacilityController.delete);

export default router;
