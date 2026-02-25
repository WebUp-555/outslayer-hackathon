import { useState, useCallback, useEffect, useRef } from "react";

const sanitizeForSpeech = (input) => {
	if (!input) return "";

	return String(input)
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/^\s*[*•#>-]+\s*/gm, "")
		.replace(/\*\*/g, "")
		.replace(/[_~]/g, "")
		.replace(/[|/\\]+/g, " ")
		.replace(/[{}\[\]()]/g, " ")
		.replace(/\s*[,;:]+\s*/g, ". ")
		.replace(/\s+/g, " ")
		.trim();
};

export const useVoiceOutput = () => {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [error, setError] = useState("");
	const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
	const utteranceRef = useRef(null);
	const [isSupported] = useState(
		typeof window !== "undefined" &&
			"speechSynthesis" in window &&
			typeof window.SpeechSynthesisUtterance !== "undefined"
	);

	useEffect(() => {
		return () => {
			if (synthRef.current) {
				synthRef.current.cancel();
			}
		};
	}, []);

	const getVoices = useCallback(() => {
		const synth = synthRef.current;
		if (!synth) return Promise.resolve([]);

		const existing = synth.getVoices();
		if (existing.length) return Promise.resolve(existing);

		return new Promise((resolve) => {
			const timeoutId = setTimeout(() => {
				resolve(synth.getVoices());
			}, 400);

			synth.onvoiceschanged = () => {
				clearTimeout(timeoutId);
				resolve(synth.getVoices());
			};
		});
	}, []);

	const speak = useCallback(async (text, options = {}) => {
		if (!isSupported) {
			setError("Text-to-Speech is not supported in your browser");
			return;
		}

		if (!text || !String(text).trim()) {
			setError("No text available to read aloud");
			return;
		}

		try {
			const synth = synthRef.current;
			if (!synth) {
				setError("Speech engine is not available");
				return;
			}

			// Cancel any ongoing speech
			synth.cancel();

			const cleanText = sanitizeForSpeech(text);
			if (!cleanText) {
				setError("No readable text available");
				setIsSpeaking(false);
				return;
			}

			const utterance = new SpeechSynthesisUtterance(cleanText);
			utterance.rate = options.rate || 1;
			utterance.pitch = options.pitch || 1;
			utterance.volume = options.volume || 1;

			if (options.lang) utterance.lang = options.lang;

			const voices = await getVoices();
			if (voices.length && options.lang) {
				const exactVoice = voices.find((voice) => voice.lang === options.lang);
				const languageOnly = options.lang.split("-")[0];
				const fallbackVoice = voices.find((voice) => voice.lang?.startsWith(languageOnly));
				utterance.voice = exactVoice || fallbackVoice || voices[0];
			}

			utteranceRef.current = utterance;

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

			synth.resume();
			synth.speak(utterance);
		} catch (err) {
			setError(err.message);
			setIsSpeaking(false);
		}
	}, [getVoices, isSupported]);

	const stop = useCallback(() => {
		const synth = synthRef.current;
		if (synth) {
			synth.cancel();
			utteranceRef.current = null;
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
