const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(filePath) {
  console.log("📂 [extractTextFromPDF] Starting extraction for:", filePath);

  try {
    const dataBuffer = fs.readFileSync(filePath);
    console.log("✅ [extractTextFromPDF] File read successfully, size:", dataBuffer.length);

    const data = await pdfParse(dataBuffer);
    console.log("📝 [extractTextFromPDF] Text extracted, length:", data.text.length);

    return data.text || '';
  } catch (err) {
    console.error("❌ [extractTextFromPDF] Failed to parse PDF:", err.message);
    throw err;
  }
}

module.exports = { extractTextFromPDF };
