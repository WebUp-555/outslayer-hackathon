// TTS (Text-to-Speech) Service
// Uses Web Speech API (browser-based)
// This is a placeholder for reference - actual implementation is on the frontend

export const ttsConfig = {
  rate: 1,
  pitch: 1,
  volume: 1,
};

export const initializeSpeechSynthesis = () => {
  if (!window.speechSynthesis) {
    throw new Error("Speech Synthesis API not supported in this browser");
  }
  return window.speechSynthesis;
};

export const getSupportedVoices = () => {
  if (!window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
};

export const speakText = (text, options = {}) => {
  const synth = window.speechSynthesis;
  if (!synth) throw new Error("Speech Synthesis not available");

  // Cancel any ongoing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate || ttsConfig.rate;
  utterance.pitch = options.pitch || ttsConfig.pitch;
  utterance.volume = options.volume || ttsConfig.volume;

  if (options.lang) utterance.lang = options.lang;
  if (options.voice) utterance.voice = options.voice;

  synth.speak(utterance);
  return utterance;
};

export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
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
