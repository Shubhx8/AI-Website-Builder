/**
 * Sends a request directly to Google Gemini API (bypassing OpenRouter).
 * @param {string | Array} promptOrMessages - A single prompt string or an array of message objects.
 * @param {boolean} enableReasoning - (Not used for Gemini directly)
 * @returns {Promise<string>} The assistant's generated response.
 */
export const generateResponse = async (promptOrMessages, enableReasoning = false) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from your .env file!");
  }

  // Using Google's native Gemini API for stability and generous free tier
  
// Change this line in your geminiApi.js file:
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;


  let contents = [];
  
  if (Array.isArray(promptOrMessages)) {
    contents = promptOrMessages.map(msg => ({
      role: msg.role === "ai" || msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
  } else {
    contents = [
      { role: "user", parts: [{ text: promptOrMessages }] }
    ];
  }

  const requestBody = {
    systemInstruction: {
      parts: [{ text: "You are an expert web developer. Return only valid raw JSON representing the website code and structure." }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch from Gemini API");
    }

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Gemini returned an empty response");
    }
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
};