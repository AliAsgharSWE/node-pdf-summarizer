import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import documentRoutes from "./routes/documentRoutes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  console.log("📡 Connecting to MongoDB...");
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.warn("⚠️ MongoDB connection failed:", err.message));
} else {
  console.warn("⚠️ No MONGO_URI found in .env — skipping DB connection");
}

// Upload Directory Setup
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`📂 Created uploads directory at ${UPLOAD_DIR}`);
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

// Routes
app.use("/api", documentRoutes);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Node PDF Summarizer API is running");
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
