const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

const { extractTextFromPDF } = require('../services/pdfService');
const { summarizeText } = require('../services/summarizer');

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const newName = `${Date.now()}_${file.originalname}`;
    cb(null, newName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    const parsedText = await extractTextFromPDF(filePath);

    if (!parsedText || parsedText.trim().length === 0) {
      return res.status(400).json({ error: 'PDF contained no extractable text' });
    }

    // Await summarizer (OpenAI → fallback local)
    const summary = await summarizeText(parsedText, 3);

    // It will try to save to DB if connected
    let docId = null;

    if (Document.db.readyState === 1) {
      const doc = new Document({
        originalFile: req.file.filename,
        parsedText,
        summary,
        createdAt: new Date(),
      });
      await doc.save();
      docId = doc._id;
    } else {
      console.log("⚠️ Skipping DB save (not connected)");
    }

    const response = { parsedText, summary };
    if (docId) response.id = docId;

    res.json(response);
  } catch (err) {
    console.error("❌ Error while processing PDF:", err);
    res.status(500).json({ error: 'Failed to process PDF', details: err.message });
  } finally {
    // Optional cleanup
    // try { fs.unlinkSync(filePath); console.log("🗑️ Deleted uploaded file"); } catch (e) {}
  }
});


// GET /api/documents/:id
router.get('/documents/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    return res.json(doc);
  } catch (err) {
    console.error("❌ Error fetching document:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
