/**
 * Sends a request directly to Google Gemini API (bypassing OpenRouter).
 * @param {string | Array} promptOrMessages - A single prompt string or an array of message objects.
 * @param {boolean} enableReasoning - (Not used for Gemini directly)
 * @returns {Promise<string>} The assistant's generated response.
 */
export const generateResponse = async (promptOrMessages, enableReasoning = false) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing from your .env file!");
  }

  // We are using DeepSeek V3 via OpenRouter free tier
  const url = `https://openrouter.ai/api/v1/chat/completions`;

  let messages = [];
  
  if (Array.isArray(promptOrMessages)) {
    messages = promptOrMessages.map(msg => ({
      role: msg.role === "ai" || msg.role === "model" ? "assistant" : "user",
      content: msg.content
    }));
  } else {
    messages = [
      { role: "user", content: promptOrMessages }
    ];
  }

  const requestBody = {
     model: "meta-llama/llama-3.3-70b-instruct:free",
    messages: [
      { role: "system", content: "You are an expert web developer. Return only valid raw JSON representing the website code and structure." },
      ...messages
    ],
    temperature: 0.2,
    response_format: { type: "json_object" }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://webmaxer.onrender.com", 
        "X-Title": "WEBMAXER"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch from OpenRouter API");
    }

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("OpenRouter returned an empty response");
    }
  } catch (error) {
    console.error("OpenRouter API Error:", error.message);
    throw error;
  }
};