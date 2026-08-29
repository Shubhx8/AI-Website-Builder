/**
 * Safely extracts and parses JSON from raw AI text output.
 * @param {string} text - Raw output string from OpenRouter.
 * @returns {object | null} - Parsed JSON object, or null if parsing fails.
 */
const extractJson = async (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  // 1. Direct parse attempt (if model returned clean raw JSON)
  try {
    return JSON.parse(text.trim());
  } catch {
    // Fall through to regex extraction
  }

  // 2. Strip Markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    try {
      return JSON.parse(cleaned.trim());
    } catch {
      // Continue searching
    }
  }

  // 3. Extract the outermost JSON object using boundary matching
  const firstOpenBrace = text.indexOf("{");
  const lastCloseBrace = text.lastIndexOf("}");

  if (firstOpenBrace !== -1 && lastCloseBrace !== -1 && lastCloseBrace > firstOpenBrace) {
    const candidateJson = text.slice(firstOpenBrace, lastCloseBrace + 1);
    try {
      return JSON.parse(candidateJson);
    } catch (err) {
      console.error("JSON parsing error on candidate substring:", err.message);
    }
  }

  return null;
};

export default extractJson;