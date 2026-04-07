import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [primaryColor, setPrimaryColor] = useState("#000000");

  const handleScrape = async () => {
    try {
      const res = await axios.post(
        "https://stylesync-design-system-extractor-ai.onrender.com/scrape?url=" + url
      );
      setData(res.data);

      if (res.data.colors.length > 0) {
        setPrimaryColor(res.data.colors[0]);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          width: "300px",
          background: "#ffffff",
          padding: "20px",
          borderRight: "1px solid #e5e7eb",
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "600" }}>
          StyleSync AI
        </h2>

        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        />

        <button
          onClick={handleScrape}
          style={{
            width: "100%",
            padding: "10px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Analyze
        </button>

        {/* COLORS */}
        {data && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "10px" }}>Colors</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {data.colors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderRadius: "10px",
                    border:
                      primaryColor === color
                        ? "2px solid #2563eb"
                        : "1px solid #ddd",
                    background: "#fafafa",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Color Preview */}
                  <div
                    onClick={() => setPrimaryColor(color)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: color,
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  ></div>

                  {/* Hex */}
                  <span style={{ fontSize: "14px" }}>{color}</span>

                  {/* Picker */}
                  <input
                    type="color"
                    value={color}
                    style={{ cursor: "pointer" }}
                    onChange={(e) => {
                      const newColors = [...data.colors];
                      newColors[index] = e.target.value;
                      setData({ ...data, colors: newColors });

                      if (primaryColor === color) {
                        setPrimaryColor(e.target.value);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          background: "#f1f5f9",
          borderLeft: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Live Preview</h2>

        {/* Button */}
        <button
          style={{
            backgroundColor: primaryColor,
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            marginBottom: "20px",
            transition: "all 0.2s ease",
          }}
        >
          Primary Button
        </button>

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            width: "300px",
            marginBottom: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ color: primaryColor }}>Card Title</h3>
          <p>This is a preview component.</p>
        </div>

        {/* Input */}
        <input
          placeholder="Type here..."
          style={{
            padding: "10px",
            border: `2px solid ${primaryColor}`,
            borderRadius: "5px",
          }}
        />
      </div>
    </div>
  );
}

export default App;