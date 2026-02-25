import { useState, useCallback, useRef } from "react";

export const useVoiceInput = () => {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [error, setError] = useState("");
	const [isSupported, setIsSupported] = useState(
		typeof window !== "undefined" && 
		(window.SpeechRecognition || window.webkitSpeechRecognition)
	);
	const recognitionRef = useRef(null);

	const startListening = useCallback(() => {
		if (!isSupported) {
			setError("Speech Recognition is not supported in your browser");
			return;
		}

		try {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			const recognition = new SpeechRecognition();
			recognitionRef.current = recognition;

			recognition.continuous = false;
			recognition.interimResults = true;
			recognition.lang = "en-US";

			recognition.onstart = () => {
				setIsListening(true);
				setError("");
				setTranscript("");
			};

			recognition.onresult = (event) => {
				let interim = "";
				for (let i = event.resultIndex; i < event.results.length; i++) {
					const text = event.results[i][0].transcript;
					if (event.results[i].isFinal) {
						setTranscript((prev) => prev + text + " ");
					} else {
						interim += text;
					}
				}
			};

			recognition.onerror = (event) => {
				// Don't show error for "interrupted" - it's not really an error, just user stopping
				if (event.error !== "interrupted") {
					setError(`Error: ${event.error}`);
				}
				setIsListening(false);
			};

			recognition.onend = () => {
				setIsListening(false);
			};

			recognition.start();
		} catch (err) {
			setError(err.message);
		}
	}, [isSupported]);

	const stopListening = useCallback(() => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
			recognitionRef.current = null;
		}
		setIsListening(false);
	}, []);

	const resetTranscript = useCallback(() => {
		setTranscript("");
		setError("");
	}, []);

	return {
		isListening,
		transcript,
		error,
		isSupported,
		startListening,
		stopListening,
		resetTranscript,
	};
};
