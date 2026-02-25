import { useVoiceInput } from "../hooks/useVoiceInput";

export default function VoiceInputButton({ onTranscript, isDark = false }) {
	const { isListening, transcript, error, isSupported, startListening, stopListening, resetTranscript } = useVoiceInput();

	const handleToggle = () => {
		if (isListening) {
			stopListening();
			if (transcript) {
				onTranscript(transcript);
			}
		} else {
			resetTranscript();
			startListening();
		}
	};

	if (!isSupported) {
		return null;
	}

	return (
		<div className="flex flex-col gap-2">
			<button
				type="button"
				onClick={handleToggle}
				className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
					isListening
						? "border-red-500 bg-red-100 text-red-700"
						: isDark
						? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
						: "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
				}`}
			>
				<span className="text-lg">{isListening ? "🎙️" : "🎤"}</span>
				{isListening ? "Stop Recording" : "Start Voice Input"}
			</button>

			{error && <p className="text-xs text-red-600">{error}</p>}

			{transcript && (
				<div className={`rounded-lg border px-3 py-2 text-sm ${isDark ? "border-gray-700 bg-gray-900 text-gray-200" : "border-blue-200 bg-blue-50 text-gray-900"}`}>
					<p className="font-semibold">You said:</p>
					<p>{transcript}</p>
				</div>
			)}
		</div>
	);
}
