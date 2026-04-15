const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= FIX CODE ================= */
app.post("/fix", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
You are a strict code reviewer.

ONLY do this:
1. If code has errors → fix it
2. If code is already correct → say "Code is correct"
3. DO NOT invent fake errors
4. DO NOT change correct code

Return format:
- First: Corrected code (ONLY if needed)
- Then: Real errors (if any)

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

    const result = response.data.choices[0].message.content;
    res.json({ result });

  } catch (error) {
    console.error("FIX ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI Error" });
  }
});

/* ================= EXPLAIN CODE ================= */
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
            content: `Explain this code line by line in simple terms:\n\n${code}`,
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

    const result = response.data.choices[0].message.content;
    res.json({ result });

  } catch (error) {
    console.error("EXPLAIN ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI Error" });
  }
});

/* ================= RUN CODE (AI SIMULATION) ================= */
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
You are a code execution engine.

ONLY do this:
- If code is valid → show EXACT output
- If error → show real error
- DO NOT explain anything

Language: ${language}

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

    const output = response.data.choices[0].message.content;
    res.json({ output });

  } catch (error) {
    console.error("RUN ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Execution Error" });
  }
});

/* ================= START SERVER ================= */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});