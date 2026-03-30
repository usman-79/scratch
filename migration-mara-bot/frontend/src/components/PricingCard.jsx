// frontend/src/components/PricingCard.jsx
function PricingCard({ onGetAccess, available }) {
  return (
    <div style={{
      maxWidth:"420px", margin:"0 auto", padding:"32px 28px",
      background:"#fff", borderRadius:"16px",
      border:"1px solid #e2e8f0",
      boxShadow:"0 4px 24px rgba(0,0,0,0.08)"
    }}>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"24px" }}>
        <div style={{ fontSize:"40px", marginBottom:"8px" }}>🤖</div>
        <h2 style={{ fontSize:"22px", fontWeight:"600", color:"#1e293b", margin:"0 0 8px" }}>
          MARA AI Bot
        </h2>
        <p style={{ color:"#64748b", fontSize:"14px", margin:0, lineHeight:"1.6" }}>
          Get instant answers from our migration policy database.
          No appointment needed.
        </p>
      </div>

      {/* Availability notice */}
      {!available && (
        <div style={{
          background:"#fef3c7", border:"1px solid #fcd34d",
          borderRadius:"10px", padding:"12px 16px", marginBottom:"20px",
          fontSize:"13px", color:"#92400e", textAlign:"center"
        }}>
          Our MARA agents are currently unavailable.
          The AI bot is available right now.
        </div>
      )}

      {/* Features */}
      {[
        "Answers from real visa policy documents",
        "Voice or text — your choice",
        "Available 24/7, instant responses",
        "One full conversation included"
      ].map((f, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
          <span style={{ color:"#10b981", fontSize:"16px" }}>✓</span>
          <span style={{ fontSize:"14px", color:"#374151" }}>{f}</span>
        </div>
      ))}

      {/* Price + CTA */}
      <div style={{ textAlign:"center", marginTop:"28px" }}>
        <div style={{ marginBottom:"16px" }}>
          <span style={{ fontSize:"42px", fontWeight:"700", color:"#1e293b" }}>$30</span>
          <span style={{ fontSize:"16px", color:"#64748b" }}> AUD</span>
          <div style={{ fontSize:"13px", color:"#94a3b8", marginTop:"4px" }}>one conversation</div>
        </div>
        <button
          onClick={onGetAccess}
          style={{
            width:"100%", background:"#6d28d9", color:"#fff",
            border:"none", borderRadius:"12px", padding:"14px",
            fontSize:"16px", fontWeight:"600", cursor:"pointer"
          }}
        >
          Get Access Now
        </button>
        <p style={{ fontSize:"12px", color:"#94a3b8", marginTop:"12px" }}>
          Secure payment via Stripe. No subscription.
        </p>
      </div>
    </div>
  );
}

export default PricingCard;
