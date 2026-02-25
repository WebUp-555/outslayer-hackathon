import { getGroqClient } from "./llm.service.js";
import { ApiError } from "../utils/ApiError.js";

// Language code to full language name mapping
const LANGUAGE_CODE_MAP = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
  mr: "Marathi",
  gu: "Gujarati",
  bn: "Bengali",
  pa: "Punjabi",
  ur: "Urdu",
  ar: "Arabic",
  ru: "Russian",
};

export const translateText = async (text, targetLanguage = "en") => {
  try {
    const client = getGroqClient();
    
    // Convert language code to full language name
    const languageName = LANGUAGE_CODE_MAP[targetLanguage] || targetLanguage;
    
    const message = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Translate the following text to ${languageName}. Return ONLY the translated text, no explanations:\n\n${text}`,
        },
      ],
    });

    const translated = message.choices?.[0]?.message?.content;
    if (!translated) {
      throw new Error("No translation returned from Groq");
    }

    return translated;
  } catch (error) {
    console.error("Translation error details:", error?.message || error);
    throw new ApiError(500, `Failed to translate text: ${error?.message || "Unknown error"}`);
  }
};

export const detectLanguage = async (text) => {
  try {
    const client = getGroqClient();
    
    const message = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Detect the language of this text and respond ONLY with the language name (e.g., English, Spanish, French, Hindi, Tamil, Telugu, etc.):\n\n${text}`,
        },
      ],
    });

    const detected = message.choices?.[0]?.message?.content;
    if (!detected) {
      throw new Error("No language detected from Groq");
    }

    return detected.trim();
  } catch (error) {
    console.error("Language detection error details:", error?.message || error);
    throw new ApiError(500, `Failed to detect language: ${error?.message || "Unknown error"}`);
  }
};
