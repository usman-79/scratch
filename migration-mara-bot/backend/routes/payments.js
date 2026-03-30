// backend/routes/payments.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { stripe, createCheckoutSession, verifyPayment } = require("../services/stripeService");
const supabase = require("../services/supabaseClient");

// POST /api/pay/checkout — client clicks "Get Access"
router.post("/checkout", async (req, res) => {
  try {
    const session = await createCheckoutSession(process.env.FRONTEND_URL);
    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Payment setup failed. Please try again." });
  }
});

// GET /api/pay/verify?session_id=xxx — called after Stripe redirects back
router.get("/verify", async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "No session ID provided" });
  }

  try {
    // Check with Stripe that payment actually succeeded
    const paid = await verifyPayment(session_id);

    if (!paid) {
      return res.status(402).json({ error: "Payment not completed" });
    }

    // Check if we already issued a token for this Stripe session
    const { data: existing } = await supabase
      .from("session_tokens")
      .select("token")
      .eq("stripe_session_id", session_id)
      .single();

    if (existing) {
      return res.json({ token: existing.token });
    }

    // Generate a new session token
    const token = `mara_${crypto.randomBytes(24).toString("hex")}`;

    // Save to database — expires in 24 hours (safety net)
    await supabase.from("session_tokens").insert({
      token,
      stripe_session_id: session_id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    res.json({ token });

  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Verification failed. Please contact support." });
  }
});

// POST /api/pay/webhook — Stripe calls this automatically after payment
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // Webhook received — actual token issuance happens in /verify
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
