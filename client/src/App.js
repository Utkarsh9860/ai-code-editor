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
      const res = await axios.post("http://localhost:5000/fix", { code });
      setOutput(res.data.result);
    } catch {
      setOutput("Error connecting to server");
    }
  };

  /* ================= EXPLAIN ================= */
  const explainCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/explain", { code });
      setOutput(res.data.result);
    } catch {
      setOutput("Error connecting to server");
    }
  };

  /* ================= RUN (🔥 IMPORTANT) ================= */
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
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>AI Code Editor 🚀</h1>

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
        >
  <option value="javascript">JavaScript</option>
  <option value="python3">Python</option>   {/* FIXED */}
  <option value="cpp17">C++</option>       {/* FIXED */}
  <option value="java">Java</option>
</select>

        <motion.button whileHover={{ scale: 1.1 }} onClick={fixCode}>
          Fix Code
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} onClick={explainCode}>
          Explain Code
        </motion.button>

        {/* ✅ RUN BUTTON ADDED */}
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
      <div style={{ display: "flex", gap: "10px" }}>
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
            background: "#020617",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>

      {/* History */}
      <h3>History</h3>
      {history.map((item, i) => (
        <pre key={i}>{item}</pre>
      ))}
    </motion.div>
  );
}

export default App;