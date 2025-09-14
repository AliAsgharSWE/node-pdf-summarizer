import fs from "fs";
import pdfParse from "pdf-parse";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text || "";
  } catch (err) {
    console.error("[PDFService] Failed to parse PDF:", err);
    throw err;
  }
}
