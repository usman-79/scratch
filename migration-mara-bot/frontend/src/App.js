// frontend/src/App.js
import MaraPage from "./pages/MaraPage";

function App() {
  return (
    <div style={{
      padding: "20px",
      minHeight: "100vh",
      background: "#f8f5ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <MaraPage />
    </div>
  );
}

export default App;
