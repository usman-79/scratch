// backend/middleware/tokenMiddleware.js
const supabase = require("../services/supabaseClient");

async function validateToken(req, res, next) {
  const token = req.headers["x-mara-token"];

  if (!token) {
    return res.status(401).json({
      error: "Payment required to use MARA Bot.",
      code: "NO_TOKEN"
    });
  }

  const { data, error } = await supabase
    .from("session_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    return res.status(401).json({
      error: "Invalid session. Please complete payment again.",
      code: "INVALID_TOKEN"
    });
  }

  if (new Date(data.expires_at) < new Date()) {
    return res.status(401).json({
      error: "Your session has expired.",
      code: "EXPIRED_TOKEN"
    });
  }

  req.sessionToken = token;
  next();
}

module.exports = { validateToken };
