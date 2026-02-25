import { useState, useCallback } from "react";

export const useVoiceOutput = () => {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [error, setError] = useState("");
	const [isSupported, setIsSupported] = useState(
		typeof window !== "undefined" && window.speechSynthesis
	);

	const speak = useCallback((text, options = {}) => {
		if (!isSupported) {
			setError("Text-to-Speech is not supported in your browser");
			return;
		}

		try {
			// Cancel any ongoing speech
			window.speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(text);
			utterance.rate = options.rate || 1;
			utterance.pitch = options.pitch || 1;
			utterance.volume = options.volume || 1;

			if (options.lang) utterance.lang = options.lang;

			utterance.onstart = () => {
				setIsSpeaking(true);
				setError("");
			};

			utterance.onend = () => {
				setIsSpeaking(false);
			};

			utterance.onerror = (event) => {
				setError(`Error: ${event.error}`);
				setIsSpeaking(false);
			};

			window.speechSynthesis.speak(utterance);
		} catch (err) {
			setError(err.message);
		}
	}, [isSupported]);

	const stop = useCallback(() => {
		if (typeof window !== "undefined" && window.speechSynthesis) {
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
		}
	}, []);

	return {
		isSpeaking,
		error,
		isSupported,
		speak,
		stop,
	};
};
