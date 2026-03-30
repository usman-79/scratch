// backend/routes/voice.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { transcribeAudio, textToSpeech } = require("../services/voiceService");
const { validateToken } = require("../middleware/tokenMiddleware");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// POST /api/voice/transcribe — convert client voice to text
router.post("/transcribe", validateToken, upload.single("audio"), async (req, res) => {
  const filePath = req.file?.path;
  try {
    const text = await transcribeAudio(filePath);
    fs.unlinkSync(filePath);
    res.json({ text });
  } catch (err) {
    if (filePath) try { fs.unlinkSync(filePath); } catch {}
    res.status(500).json({ error: "Transcription failed" });
  }
});

// POST /api/voice/speak — convert MARA reply to audio
router.post("/speak", validateToken, async (req, res) => {
  const { text } = req.body;
  try {
    const audioBase64 = await textToSpeech(text);
    res.json({ audio: audioBase64 });
  } catch (err) {
    res.status(500).json({ error: "Speech generation failed" });
  }
});

module.exports = router;
