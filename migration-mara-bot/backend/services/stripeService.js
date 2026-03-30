// backend/services/stripeService.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(frontendUrl) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID,  // your $30 price ID
      quantity: 1
    }],
    mode: "payment",
    success_url: `${frontendUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}?cancelled=true`,
    payment_intent_data: {
      description: "MARA AI Bot — One Conversation"
    }
  });
  return session;
}

async function verifyPayment(sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.payment_status === "paid";
}

module.exports = { stripe, createCheckoutSession, verifyPayment };
