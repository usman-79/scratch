// backend/services/embeddingService.js
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",  // cheap — $0.02 per million tokens
    input: text.slice(0, 8000)
  });
  return response.data[0].embedding;  // array of 1536 numbers
}

module.exports = { createEmbedding };
