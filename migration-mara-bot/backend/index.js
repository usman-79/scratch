const express = require("express");
const cors = require("cors");
require("dotenv").config();

const maraRoutes    = require("./routes/mara");
const paymentRoutes = require("./routes/payments");
const uploadRoutes  = require("./routes/upload");
const voiceRoutes   = require("./routes/voice");
const { checkMaraAvailability } = require("./services/databaseService");

const app = express();

// Stripe webhook needs raw body — MUST be before express.json()
app.use("/api/pay/webhook", express.raw({ type: "application/json" }));

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
app.get("/test", (req, res) => res.json({ status: "running" }));
app.get("/api/availability", async (req, res) => {
  const available = await checkMaraAvailability();
  res.json({ available });
});
app.use("/api/mara",   maraRoutes);
app.use("/api/pay",    paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/voice",  voiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
