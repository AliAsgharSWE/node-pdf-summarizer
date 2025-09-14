import mongoose, { Schema, Document } from "mongoose";
import { IDocument } from "../types/document";

const DocumentSchema: Schema = new Schema({
  originalFile: { type: String, required: true },
  parsedText: { type: String, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDocument & Document>("Document", DocumentSchema);
