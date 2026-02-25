// STT (Speech-to-Text) Service
// Uses Web Speech API (browser-based)
// This is a placeholder for reference - actual implementation is on the frontend

export const sttConfig = {
  language: "en-US",
  continuous: false,
  interimResults: true,
  maxAlternatives: 1,
};

export const initializeSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    throw new Error("Speech Recognition API not supported in this browser");
  }

  const recognition = new SpeechRecognition();
  recognition.language = sttConfig.language;
  recognition.continuous = sttConfig.continuous;
  recognition.interimResults = sttConfig.interimResults;
  recognition.maxAlternatives = sttConfig.maxAlternatives;

  return recognition;
};

export const getSupportedLanguages = () => {
  return [
    // English
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    
    // Indian Languages
    { code: "hi-IN", name: "Hindi" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "mr-IN", name: "Marathi" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "bn-IN", name: "Bengali" },
    { code: "pa-IN", name: "Punjabi" },
    { code: "ur-IN", name: "Urdu" },
    
    // Other Languages
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "ar-SA", name: "Arabic" },
    { code: "ru-RU", name: "Russian" },
  ];
};
