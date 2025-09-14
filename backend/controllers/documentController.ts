import { Request, Response, NextFunction } from "express";
import Document from "../models/Document";
import { extractTextFromPDF } from "../services/pdfService";
import { summarizeText } from "../services/summarizerService";
import { IUploadResponse } from "../types/document";

export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;

  try {
    const parsedText = await extractTextFromPDF(filePath);
    if (!parsedText.trim())
      return res
        .status(400)
        .json({ error: "PDF contained no extractable text" });

    const summary = await summarizeText(parsedText, 3);

    let docId: string | null = null;
    if (Document.db.readyState === 1) {
      const doc = new Document({
        originalFile: req.file.filename,
        parsedText,
        summary,
      });
      await doc.save();
      docId = doc._id.toString();
    }

    const response: IUploadResponse = { parsedText, summary };
    if (docId) response.id = docId;

    res.json(response);
  } catch (err: any) {
    next(err);
  }
};

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await Document.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err: any) {
    next(err);
  }
};
