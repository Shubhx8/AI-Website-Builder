const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "cohere/north-mini-code:free"; // Extremely fast coding model
const FALLBACK_MODELS = []; 


/**
 * Sends a request to OpenRouter API.
 * @param {string | Array} promptOrMessages - A single prompt string or an array of message objects.
 * @param {boolean} enableReasoning - Set to true if you want the model to use step-by-step reasoning.
 * @returns {Promise<string>} The assistant's generated response.
 */
export const generateResponse = async (promptOrMessages, enableReasoning = false) => {
  // Format messages whether the caller passed a raw string or a full message history
  const messages = Array.isArray(promptOrMessages)
    ? promptOrMessages
    : [
        {
          role: "system",
          content: "You are an expert web developer. Return only valid raw JSON representing the website code and structure.",
        },
        {
          role: "user",
          content: promptOrMessages,
        },
      ];

  const requestBody = {
    model: DEFAULT_MODEL,
    models: FALLBACK_MODELS,
    messages: messages,
    temperature: 0.2,
    response_format: { type: "json_object" }
  };

  // Enable reasoning if requested
  if (enableReasoning) {
    requestBody.reasoning = { enabled: true };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173", // Optional: identifies your app to OpenRouter
      "X-Title": "WEBMAXER",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response choices returned from OpenRouter.");
  }

  return data.choices[0].message.content;
};