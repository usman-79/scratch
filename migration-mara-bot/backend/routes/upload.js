// backend/routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { extractTextFromPDF, splitIntoChunks, deleteTempFile } = require("../services/pdfService");
const { createEmbedding } = require("../services/embeddingService");
const supabase = require("../services/supabaseClient");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  }
});

// POST /api/upload/pdf
router.post("/pdf", upload.single("file"), async (req, res) => {
  const filePath = req.file?.path;

  try {
    // 1. Extract text
    const rawText = await extractTextFromPDF(filePath);

    // 2. Split into chunks
    const chunks = splitIntoChunks(rawText, 500);

    // 3. Delete old chunks for this PDF (handles re-uploads)
    await supabase
      .from("policy_chunks")
      .delete()
      .eq("pdf_name", req.file.originalname);

    // 4. Embed each chunk and save
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await createEmbedding(chunks[i]);
      await supabase.from("policy_chunks").insert({
        pdf_name: req.file.originalname,
        chunk_index: i,
        chunk_text: chunks[i],
        embedding
      });
    }

    deleteTempFile(filePath);

    res.json({
      success: true,
      filename: req.file.originalname,
      chunksCreated: chunks.length
    });

  } catch (error) {
    deleteTempFile(filePath);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/upload/pdfs — list uploaded PDFs
router.get("/pdfs", async (req, res) => {
  const { data } = await supabase
    .from("policy_chunks")
    .select("pdf_name, uploaded_at")
    .order("uploaded_at", { ascending: false });

  const unique = [...new Map(data?.map(d => [d.pdf_name, d])).values()];
  res.json({ pdfs: unique });
});

// DELETE /api/upload/pdf/:name — remove a PDF
router.delete("/pdf/:name", async (req, res) => {
  await supabase
    .from("policy_chunks")
    .delete()
    .eq("pdf_name", req.params.name);
  res.json({ success: true });
});

module.exports = router;
