// backend/services/claudeService.js
// Using Google Gemini instead of Anthropic Claude
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askClaude({ systemPrompt, messages, maxTokens = 1024 }) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt
  });

  // Convert message history to Gemini format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: maxTokens
    }
  });

  const lastMessage = messages[messages.length - 1].content;
  const result = await chat.sendMessage(lastMessage);
  return result.response.text();
}

module.exports = { askClaude };
