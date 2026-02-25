import { useVoiceOutput } from "../hooks/useVoiceOutput";

// Language code mapping for Web Speech API
const LANGUAGE_CODE_MAP = {
	en: "en-US",
	es: "es-ES",
	fr: "fr-FR",
	de: "de-DE",
	it: "it-IT",
	pt: "pt-BR",
	zh: "zh-CN",
	ja: "ja-JP",
	ko: "ko-KR",
	hi: "hi-IN",
	ta: "ta-IN",
	te: "te-IN",
	kn: "kn-IN",
	ml: "ml-IN",
	mr: "mr-IN",
	gu: "gu-IN",
	bn: "bn-IN",
	pa: "pa-IN",
	ur: "ur-IN",
	ar: "ar-SA",
	ru: "ru-RU",
};

export default function VoiceOutputButton({
	text,
	isDark = false,
	label = "Read Aloud",
	languageCode = "en",
}) {
	const { isSpeaking, error, isSupported, speak, stop } = useVoiceOutput();

	const handleToggle = () => {
		if (isSpeaking) {
			stop();
		} else {
			const lang = LANGUAGE_CODE_MAP[languageCode] || "en-US";
			speak(text, { lang });
		}
	};

	if (!isSupported || !text) {
		return null;
	}

	return (
		<div className="flex flex-col gap-2">
			<button
				type="button"
				onClick={handleToggle}
				className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
					isSpeaking
						? "border-green-500 bg-green-100 text-green-700"
						: isDark
						? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
						: "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
				}`}
			>
				<span className="text-lg">{isSpeaking ? "⏸️" : "🔊"}</span>
				{isSpeaking ? "Stop" : label}
			</button>

			{error && <p className="text-xs text-red-600">{error}</p>}
		</div>
	);
}
