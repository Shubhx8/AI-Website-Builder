/**
 * Safely extracts and parses JSON from raw AI text output, OR extracts raw HTML if JSON fails.
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
    // Fall through
  }

  // 2. Strip Markdown code fences if present for JSON
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        // Fall through
      }
    }
  }

  // 3. Extract the outermost JSON object using boundary matching
  const firstOpenBrace = text.indexOf("{");
  const lastCloseBrace = text.lastIndexOf("}");

  if (firstOpenBrace !== -1 && lastCloseBrace !== -1 && lastCloseBrace > firstOpenBrace) {
    const candidateJson = text.slice(firstOpenBrace, lastCloseBrace + 1);
    try {
      const parsed = JSON.parse(candidateJson);
      if (parsed.code) return parsed;
    } catch (err) {
      // Fall through
    }
  }

  // 4. THE ULTIMATE FALLBACK: If JSON completely fails, look for raw HTML
  // Some models ignore JSON instructions and just output raw HTML or markdown HTML.
  const htmlMatch = text.match(/```(?:html)?\s*([\s\S]*?)\s*```/i);
  if (htmlMatch && htmlMatch[1] && (htmlMatch[1].toLowerCase().includes("<html") || htmlMatch[1].toLowerCase().includes("<!doctype"))) {
    return {
      message: "Extracted HTML directly from markdown",
      code: htmlMatch[1].trim()
    };
  }

  // 5. Look for bare HTML without markdown fences
  const htmlStart = text.toLowerCase().indexOf("<html");
  const htmlEnd = text.toLowerCase().lastIndexOf("</html>");
  
  if (htmlStart !== -1 && htmlEnd !== -1 && htmlEnd > htmlStart) {
    const rawHtml = text.slice(htmlStart, htmlEnd + 7);
    return {
      message: "Extracted raw HTML document",
      code: rawHtml.trim()
    };
  }

  // 6. Look for standard DOCTYPE
  const docStart = text.toLowerCase().indexOf("<!doctype html>");
  if (docStart !== -1 && htmlEnd !== -1 && htmlEnd > docStart) {
    const rawHtml = text.slice(docStart, htmlEnd + 7);
    return {
      message: "Extracted raw HTML document",
      code: rawHtml.trim()
    };
  }

  return null;
};

export default extractJson;