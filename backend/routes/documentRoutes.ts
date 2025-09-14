import { Router, Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import {
  uploadDocument,
  getDocumentById,
} from "../controllers/documentController";

const router = Router();

// Upload directory
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File filter: only PDF
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"));
  }
  cb(null, true);
};

// Max file size: 10MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Routes
router.post("/upload", upload.single("file"), uploadDocument);
router.get("/documents/:id", getDocumentById);

export default router;
