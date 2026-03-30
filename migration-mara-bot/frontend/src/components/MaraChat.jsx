// frontend/src/components/MaraChat.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import VoiceButton from "./VoiceButton";

function MaraChat({ token }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hi! I'm MARA 👋 I'm connected to The Migration's policy database. Ask me anything about your visa — by typing or using the mic button."
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const message = text || input;
    if (!message.trim() || loading) return;

    const userMsg = { role: "user", content: message };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setSources([]);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/mara/chat`,
        { message, history: messages },
        { headers: { "x-mara-token": token } }
      );

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      if (data.sources?.length > 0) setSources(data.sources);

    } catch (err) {
      const errMsg = err.response?.data?.error || "Connection error. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const starters = [
    "What documents do I need for a 482 visa?",
    "How do I apply for the 485 graduate visa?",
    "What is the points test for a 189 visa?",
    "How long does a partner visa take?"
  ];

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"640px",
      maxWidth:"520px", margin:"0 auto", borderRadius:"16px",
      overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.12)",
      border:"1px solid #e2e8f0"
    }}>

      {/* Header */}
      <div style={{
        background:"linear-gradient(135deg, #6d28d9, #4c1d95)",
        color:"#fff", padding:"14px 16px",
        display:"flex", alignItems:"center", gap:"12px"
      }}>
        <div style={{
          width:"38px", height:"38px", borderRadius:"50%",
          background:"rgba(255,255,255,0.2)", display:"flex",
          alignItems:"center", justifyContent:"center",
          fontWeight:"700", fontSize:"16px"
        }}>M</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:"600", fontSize:"15px" }}>MARA Agent</div>
          <div style={{ fontSize:"12px", opacity:0.7 }}>Policy-Backed Migration AI</div>
        </div>
        <span style={{
          background:"rgba(255,255,255,0.2)", fontSize:"11px",
          padding:"3px 10px", borderRadius:"12px"
        }}>LIVE</span>
      </div>

      {/* Messages */}
      <div style={{
        flex:1, overflowY:"auto", padding:"16px",
        display:"flex", flexDirection:"column", gap:"12px",
        background:"#faf5ff"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:"flex", justifyContent: msg.role==="user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth:"85%", padding:"10px 14px", fontSize:"14px", lineHeight:"1.6",
              borderRadius: msg.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role==="user" ? "#6d28d9" : "#fff",
              color: msg.role==="user" ? "#fff" : "#1e293b",
              border: msg.role==="assistant" ? "1px solid #ede9fe" : "none",
              boxShadow: msg.role==="assistant" ? "0 1px 4px rgba(109,40,217,0.08)" : "none"
            }}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Starter suggestions */}
        {messages.length === 1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <p style={{ fontSize:"12px", color:"#a78bfa", textAlign:"center", margin:0 }}>
              Try asking:
            </p>
            {starters.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} style={{
                background:"#fff", border:"1px solid #ede9fe",
                borderRadius:"10px", padding:"8px 12px",
                fontSize:"13px", color:"#6d28d9", cursor:"pointer", textAlign:"left"
              }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start" }}>
            <div style={{
              background:"#fff", border:"1px solid #ede9fe",
              borderRadius:"16px 16px 16px 4px", padding:"10px 14px",
              fontSize:"14px", color:"#a78bfa"
            }}>
              Looking up policies...
            </div>
          </div>
        )}

        {/* PDF sources used */}
        {sources.length > 0 && (
          <div style={{ fontSize:"11px", color:"#9ca3af", padding:"2px 4px" }}>
            📄 Sources: {sources.join(", ")}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{
        padding:"12px", background:"#fff",
        borderTop:"1px solid #f3f0ff",
        display:"flex", gap:"8px", alignItems:"center"
      }}>
        <VoiceButton onTranscript={(text) => sendMessage(text)} />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === "Enter" && sendMessage()}
          placeholder="Type or use mic to ask..."
          style={{
            flex:1, border:"1px solid #e2e8f0", borderRadius:"10px",
            padding:"10px 14px", fontSize:"14px", outline:"none"
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          style={{
            background:"#6d28d9", color:"#fff", border:"none",
            borderRadius:"10px", padding:"10px 16px",
            fontSize:"14px", cursor:"pointer", opacity: loading ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MaraChat;
