// frontend/src/pages/MaraPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import MaraChat from "../components/MaraChat";
import PricingCard from "../components/PricingCard";

function MaraPage() {
  const [token, setToken]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // Check if client already paid (token in sessionStorage)
    const savedToken = sessionStorage.getItem("mara_token");
    if (savedToken) setToken(savedToken);

    // Check Stripe redirect (after payment)
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setLoading(false);
    }

    // Check MARA agent availability
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/availability`
      );
      setAvailable(data.available);
    } catch {
      setAvailable(true); // default to available if check fails
    }
  };

  const verifyPayment = async (sessionId) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/pay/verify?session_id=${sessionId}`
      );
      sessionStorage.setItem("mara_token", data.token);
      setToken(data.token);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    } catch (err) {
      console.error("Payment verification failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAccess = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pay/checkout`
      );
      window.location.href = data.checkoutUrl;
    } catch {
      alert("Could not start payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"400px" }}>
        <p style={{ color:"#64748b" }}>Verifying payment...</p>
      </div>
    );
  }

  // Paid — show chat
  if (token) return <MaraChat token={token} />;

  // Not paid — show pricing
  return <PricingCard onGetAccess={handleGetAccess} available={available} />;
}

export default MaraPage;
