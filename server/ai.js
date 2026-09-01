
// Put your OpenRouter API key in an environment variable for safety

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Store your OpenRouter API key safely (env variable recommended)
const OPENROUTER_API_KEY = "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"

app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    // First API call with reasoning enabled
    const response1 = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-opus-4.7-fast", // rotates among available free models
        messages: [{ role: "user", content: prompt }],
        reasoning: { enabled: true }
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const assistantMessage = response1.data.choices[0].message;

    // Preserve reasoning details
    const messages = [
      { role: "user", content: prompt },
      {
        role: "assistant",
        content: assistantMessage.content,
        reasoning_details: assistantMessage.reasoning_details
      },
      { role: "user", content: "Are you sure? Think carefully." }
    ];

    // Second API call continues reasoning
    const response2 = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-opus-4.7-fast", // stick to free pool
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Return both steps to Postman
    res.json({
      firstCall: assistantMessage,
      secondCall: response2.data.choices[0].message
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Something went wrong"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

