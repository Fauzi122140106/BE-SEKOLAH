import multer from "multer";

export const blobUpload = multer({ storage: multer.memoryStorage() });
