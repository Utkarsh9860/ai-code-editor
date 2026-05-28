import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [history, setHistory] = useState([]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  /* ================= FIX ================= */
  const fixCode = async () => {
  try {
    const res = await axios.post("http://localhost:5000/fix", {
      code,
      language,
    });

    const result = res.data.result;

    setOutput(result);

    // ✅ ONLY update editor if it's NOT "Code is correct"
    if (!result.toLowerCase().includes("code is correct")) {
      setCode(result);
    }

  } catch {
    setOutput("Error connecting to server");
  }
};

  /* ================= EXPLAIN ================= */
  const explainCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/explain", {
        code,
      });
      setOutput(res.data.result);
    } catch {
      setOutput("Error connecting to server");
    }
  };

  /* ================= RUN ================= */
  const runCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/run", {
        code,
        language,
      });
      setOutput(res.data.output);
    } catch {
      setOutput("Execution Error");
    }
  };

  /* ================= EXTRA ================= */
  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert("Copied!");
  };

  const saveVersion = () => {
    setHistory([...history, code]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: "linear-gradient(135deg, #0b1220, #0f172a)",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "12px",
  marginBottom: "15px"
}}>
  <h2 style={{ margin: 0 }}>⚡ AI Code Editor</h2>
  <span style={{ color: "#94a3b8", fontSize: "12px" }}>
    Smart IDE
  </span>
</div>

      {/* Controls */}
      <div style={{
  display: "flex",
  gap: "10px",
  marginBottom: "15px",
  flexWrap: "wrap",
  padding: "10px",
  background: "rgba(255,255,255,0.03)",
  borderRadius: "12px"
}}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <motion.button whileHover={{ scale: 1.1 }} onClick={fixCode}>
          Fix Code
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} onClick={explainCode}>
          Explain Code
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={runCode}
          style={{ background: "#9333ea", color: "white" }}
        >
          Run Code ▶️
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} onClick={copyOutput}>
          Copy
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} onClick={saveVersion}>
          Save
        </motion.button>
      </div>

      {/* Editor + Output */}
      <div style={{
  display: "grid",
  gridTemplateColumns: "1.3fr 1fr",
  gap: "15px"
}}>
        <div style={{ flex: 1 }}>
          <Editor
            height="400px"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
          />
        </div>

        <div
         style={{
  flex: 1,
  background: "#050b18",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  height: "400px",
  overflowY: "auto"
}}
        >
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>

      {/* History */}
      <h3 style={{ marginTop: "20px", color: "#94a3b8" }}>
  History
</h3>
      {history.map((item, i) => (
        <div style={{
  background: "rgba(255,255,255,0.04)",
  padding: "10px",
  marginBottom: "8px",
  borderRadius: "8px"
}}>
  <code style={{ fontSize: "12px" }}>
    {item}
  </code>
</div>
      ))}
    </motion.div>
  );
}

export default App;