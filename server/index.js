const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= FIX CODE ================= */
app.post("/fix", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
You are a strict ${language} code reviewer.

Rules:
- Fix errors only if present
- If correct → say "Code is correct"
- DO NOT modify correct code
- DO NOT mix languages

Return ONLY valid ${language} code.

Code:
${code}
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      result: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("FIX ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI Error" });
  }
});

/* ================= EXPLAIN ================= */
app.post("/explain", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "user",
            content: `Explain this code line by line:\n\n${code}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      result: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("EXPLAIN ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI Error" });
  }
});

/* ================= RUN ================= */
app.post("/run", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
You are a ${language} code execution engine.

STRICT RULES:
- If correct → return ONLY output
- If error → return ONLY error
- DO NOT explain
- DO NOT mix languages

Code:
${code}
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      output: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("RUN ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Execution Error" });
  }
});

/* ================= START SERVER ================= */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});