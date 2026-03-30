// frontend/src/components/VoiceButton.jsx
import { useState } from "react";
import axios from "axios";

function VoiceButton({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = e => chunks.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "voice.webm");

        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/voice/transcribe`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          if (data.text) onTranscript(data.text);
        } catch (err) {
          console.error("Transcription failed:", err);
        }

        // Stop microphone
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied. Please allow microphone to use voice.");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      title="Hold to speak"
      style={{
        width:"40px", height:"40px", borderRadius:"50%",
        border:"none", cursor:"pointer", flexShrink:0,
        background: recording ? "#ef4444" : "#6d28d9",
        color:"#fff", fontSize:"18px",
        transition:"background 0.2s",
        display:"flex", alignItems:"center", justifyContent:"center"
      }}
    >
      {recording ? "⏹" : "🎤"}
    </button>
  );
}

export default VoiceButton;
