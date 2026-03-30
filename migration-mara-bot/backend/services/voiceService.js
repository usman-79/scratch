// backend/services/voiceService.js
const OpenAI = require("openai");
const fs = require("fs");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Speech → Text (Whisper)
async function transcribeAudio(filePath) {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
    language: "en"
  });
  return response.text;
}

// Text → Speech (OpenAI TTS)
async function textToSpeech(text) {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",        // options: alloy, echo, fable, onyx, nova, shimmer
    input: text.slice(0, 4096)
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString("base64");  // send as base64 to frontend
}

module.exports = { transcribeAudio, textToSpeech };
