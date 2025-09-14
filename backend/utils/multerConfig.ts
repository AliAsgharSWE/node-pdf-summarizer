import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express"; // ✅ Import Express types

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`📂 Created uploads directory at ${UPLOAD_DIR}`);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const newName = `${Date.now()}_${file.originalname}`;
    cb(null, newName);
  },
});

// File filter for PDF only
const fileFilter = (
  _req: Request,
  file: multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"));
  }
  cb(null, true);
};

// Max file size: 10MB
const limits = { fileSize: 10 * 1024 * 1024 };

// Export configured multer instance
export const upload = multer({ storage, fileFilter, limits });
