// backend/services/pdfService.js
const pdfParse = require("pdf-parse");
const fs = require("fs");

async function extractTextFromPDF(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

// Split text into ~500 word pieces
function splitIntoChunks(text, wordsPerChunk = 500) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(" ");
    if (chunk.trim().length > 50) chunks.push(chunk);
  }

  return chunks;
}

function deleteTempFile(filePath) {
  try { fs.unlinkSync(filePath); } catch (e) {}
}

module.exports = { extractTextFromPDF, splitIntoChunks, deleteTempFile };
