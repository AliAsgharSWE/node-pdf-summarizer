const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(filePath) {

  try {
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(dataBuffer);

    return data.text || '';
  } catch (err) {
    console.error("[extractTextFromPDF] Failed to parse PDF:", err.message);
    throw err;
  }
}

module.exports = { extractTextFromPDF };
