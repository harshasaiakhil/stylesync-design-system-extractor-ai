import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [locked, setLocked] = useState(false);

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

  // 🔥 CSS VARIABLES SYSTEM
  const cssVars = {
    "--primary": primaryColor,
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial",
        ...cssVars,
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          width: "300px",
          padding: "20px",
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <h2>StyleSync AI</h2>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleScrape}
          style={{
            width: "100%",
            padding: "10px",
            background: "#111827",
            color: "#fff",
            borderRadius: "6px",
          }}
        >
          Analyze
        </button>

        {/* LOCK */}
        <button onClick={() => setLocked(!locked)} style={{ marginTop: "10px" }}>
          {locked ? "🔒 Locked" : "🔓 Unlock"}
        </button>

        {/* COLORS */}
        {data && (
          <>
            <h3>Colors</h3>
            {data.colors.map((color, i) => (
              <div key={i}>
                <div
                  onClick={() => setPrimaryColor(color)}
                  style={{
                    height: "30px",
                    background: color,
                    cursor: "pointer",
                    border:
                      primaryColor === color
                        ? "2px solid var(--primary)"
                        : "1px solid #ccc",
                  }}
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    if (locked) return;

                    const newColors = [...data.colors];
                    newColors[i] = e.target.value;
                    setData({ ...data, colors: newColors });

                    if (primaryColor === color) {
                      setPrimaryColor(e.target.value);
                    }
                  }}
                />
              </div>
            ))}

            {/* TYPOGRAPHY */}
            <h3>Typography</h3>
            <p>
              <b>Heading:</b> {data.fonts.heading}
            </p>
            <p>
              <b>Body:</b> {data.fonts.body}
            </p>

            {/* SPACING */}
            <h3>Spacing</h3>
            <p>{data.spacing.join(", ")}</p>
          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          background: "#f1f5f9",
        }}
      >
        <h2>Component Preview</h2>

        {data && (
          <div style={{ display: "grid", gap: "20px" }}>
            {/* Buttons */}
            <div>
              <h4>Buttons</h4>
              <button
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  padding: "10px",
                }}
              >
                Primary
              </button>

              <button
                style={{
                  border: "2px solid var(--primary)",
                  marginLeft: "10px",
                  padding: "10px",
                }}
              >
                Secondary
              </button>
            </div>

            {/* Inputs */}
            <div>
              <h4>Inputs</h4>
              <input
                style={{
                  border: "2px solid var(--primary)",
                  padding: "10px",
                }}
              />
            </div>

            {/* Cards */}
            <div style={{ background: "#fff", padding: "20px" }}>
              <h3 style={{ color: "var(--primary)" }}>Card Title</h3>
              <p>Example content</p>
            </div>

            {/* Typography */}
            <div style={{ fontFamily: data.fonts.body }}>
              <h1 style={{ fontFamily: data.fonts.heading }}>
                Heading Example
              </h1>
              <p>Body text example</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;