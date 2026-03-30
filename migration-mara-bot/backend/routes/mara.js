// backend/routes/mara.js
const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/tokenMiddleware");
const { searchPolicies } = require("../services/databaseService");
const { askClaude } = require("../services/claudeService");
const supabase = require("../services/supabaseClient");

router.use(validateToken);

// POST /api/mara/chat
router.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    // 1. Search PDF database for relevant policy chunks
    const chunks = await searchPolicies(message);

    // 2. Build context from matching chunks
    let policyContext = "";
    if (chunks.length > 0) {
      policyContext = "\n\nRELEVANT POLICY INFORMATION:\n";
      chunks.forEach(chunk => {
        policyContext += `\n[Source: ${chunk.pdf_name}]\n${chunk.chunk_text}\n`;
      });
    }

    // 3. System prompt — MARA's personality and rules
    const systemPrompt = `You are MARA, the AI assistant for The Migration 
(themigration.com.au) — a MARA-registered Australian migration consultancy 
(Registration: 1807450).

YOUR RULES:
- Answer ONLY using the policy information provided below
- Cite which document your answer comes from
- If the information is not in the provided data, say:
  "I don't have specific details on that in my current knowledge base.
   I recommend booking a consultation with our MARA agents at
   themigration.com.au/online-remote for personalised advice."
- Never guarantee visa approval or outcomes
- Be warm, clear, and professional
- Format requirements as numbered lists
- Keep answers concise and practical

${policyContext || "No matching policy found. Direct client to book consultation."}`;

    // 4. Get answer from Claude
    const messages = [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message }
    ];

    const reply = await askClaude({ systemPrompt, messages });

    // 5. Log conversation
    await supabase.from("chat_logs").insert({
      session_token: req.sessionToken,
      question: message,
      answer: reply,
      pdf_sources: chunks.map(c => c.pdf_name).join(", ")
    });

    res.json({
      reply,
      sources: [...new Set(chunks.map(c => c.pdf_name))]
    });

  } catch (error) {
    console.error("MARA error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
