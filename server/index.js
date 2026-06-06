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
        model: "deepseek/deepseek-chat",
        max_tokens: 500,
        temperature: 0,

        messages: [
          {
            role: "user",
          content: `
You are a code correction engine.

STRICT RULES:
1. Return ONLY corrected ${language} code.
2. Do NOT explain anything.
3. Do NOT use markdown.
4. Do NOT use \`\`\`.
5. Do NOT add comments.
6. Do NOT add text before code.
7. Do NOT add text after code.
8. If code is already correct, return the original code exactly.
9. Do MAKE THE CODE OPTIMIZED and CLEAN, MAKE THE PROGRAM BETTER.

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
    console.error(
      "FIX ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
});

/* ================= EXPLAIN CODE ================= */
app.post("/explain", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        max_tokens: 700,
        temperature: 0.3,

        messages: [
          {
            role: "user",
            content: `
Explain this ${language} code line by line in simple words.

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
    console.error(
      "EXPLAIN ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
});

/* ================= RUN CODE ================= */
app.post("/run", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        max_tokens: 300,
        temperature: 0,

        messages: [
          {
            role: "user",
            content: `
You are a ${language} code execution engine.

STRICT RULES:
- If code is correct → return ONLY output
- If code has error → return ONLY error
- DO NOT explain
- DO NOT add extra text
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
    console.error(
      "RUN ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
});

/* ================= START SERVER ================= */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});