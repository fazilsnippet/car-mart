// Step 1: Call OpenRouter Chat Completion API
export const chatCompletion = async ({
  systemPrompt,
  userPrompt,
  model = process.env.OPENROUTER_MODEL,
  temperature = 0.2,
}) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",

        // Optional but recommended
        "HTTP-Referer": process.env.APP_URL || "https://car-mart-client.onrender.com",
        "X-OpenRouter-Title": "CarMart AI",
      },

      body: JSON.stringify({
  model,
  temperature,

  max_tokens: 800,

  reasoning: {
    effort: "low"
  },

  response_format: {
    type: "json_object",
  },

  messages: [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ],
})
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(error);
  }

  const json = await response.json();

 const content = json.choices[0].message.content;

try {
  return JSON.parse(content);
} catch (error) {
  console.log("Invalid JSON from model:");
  console.log(content);

  throw new Error("AI returned invalid JSON");
}
};