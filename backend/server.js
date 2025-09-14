const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || null;
if (MONGO_URI) {
  console.log("📡 Connecting to MongoDB...");
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Mongo connected"))
    .catch((e) => console.warn("⚠️ Mongo connection failed:", e.message));
} else {
  console.warn("⚠️ No MONGO_URI found in .env — skipping DB connection");
}

const uploadRoute = require("./routes/upload");

// Define upload directory BEFORE using it
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} else {
}

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

// Routes
app.use("/api", uploadRoute);

// Basic health check
app.get("/", (req, res) => {
  res.send("🚀 Node PDF Summarizer API is running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
