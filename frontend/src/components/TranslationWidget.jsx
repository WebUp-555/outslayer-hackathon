import { useState, useMemo } from "react";
import { translateApi } from "../api/axios";
import useTheme from "../hooks/useTheme";
import VoiceOutputButton from "./VoiceOutputButton";

const LANGUAGES = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "it", name: "Italian" },
	{ code: "pt", name: "Portuguese" },
	{ code: "zh", name: "Chinese" },
	{ code: "ja", name: "Japanese" },
	{ code: "ko", name: "Korean" },
	{ code: "hi", name: "Hindi" },
	{ code: "ta", name: "Tamil" },
	{ code: "te", name: "Telugu" },
	{ code: "kn", name: "Kannada" },
	{ code: "ml", name: "Malayalam" },
	{ code: "mr", name: "Marathi" },
	{ code: "gu", name: "Gujarati" },
	{ code: "bn", name: "Bengali" },
	{ code: "pa", name: "Punjabi" },
	{ code: "ur", name: "Urdu" },
	{ code: "ar", name: "Arabic" },
	{ code: "ru", name: "Russian" },
];

export default function TranslationWidget({ text, isDark = false, onLanguageChange }) {
	const { isDark: themeIsDark } = useTheme();
	const [selectedLanguageCode, setSelectedLanguageCode] = useState("es");
	const [translatedText, setTranslatedText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showTranslation, setShowTranslation] = useState(false);

	const effectiveIsDark = isDark !== undefined ? isDark : themeIsDark;

	const selectedLanguageName = LANGUAGES.find(
		(lang) => lang.code === selectedLanguageCode
	)?.name || "Spanish";

	const handleLanguageChange = (e) => {
		setSelectedLanguageCode(e.target.value);
		if (onLanguageChange) {
			onLanguageChange(e.target.value);
		}
	};

	const handleTranslate = async () => {
		if (!text) return;

		try {
			setError("");
			setIsLoading(true);
			const res = await translateApi.translate({
				text,
				targetLanguage: selectedLanguageCode,
			});
			setTranslatedText(res?.data?.data?.translatedText || "");
			setShowTranslation(true);
		} catch (err) {
			setError(err?.response?.data?.message || "Failed to translate");
		} finally {
			setIsLoading(false);
		}
	};

	if (!text) return null;

	return (
		<div className={`rounded-lg border p-4 ${effectiveIsDark ? "border-gray-700 bg-gray-900" : "border-blue-200 bg-blue-50"}`}>
			<div className="flex items-center gap-3">
				<select
					value={selectedLanguageCode}
					onChange={handleLanguageChange}
					className={`rounded border px-3 py-2 text-sm ${
						effectiveIsDark
							? "border-gray-700 bg-gray-800 text-gray-200"
							: "border-gray-300 bg-slate-50 text-gray-900"
					}`}
				>
					{LANGUAGES.map((lang) => (
						<option key={lang.code} value={lang.code}>
							{lang.name}
						</option>
					))}
				</select>

				<button
					type="button"
					onClick={handleTranslate}
					disabled={isLoading}
					className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
				>
					{isLoading ? "Translating..." : "Translate"}
				</button>
			</div>

			{error && <p className="mt-2 text-xs text-red-600">{error}</p>}

			{showTranslation && translatedText && (
				<div className={`mt-4 rounded-lg border-t pt-3 ${effectiveIsDark ? "border-gray-700" : "border-blue-200"}`}>
					<div className="flex items-center justify-between">
						<p className={`text-xs font-semibold ${effectiveIsDark ? "text-gray-400" : "text-gray-500"}`}>
							Translated to {selectedLanguageName}:
						</p>
						<VoiceOutputButton
							text={translatedText}
							isDark={effectiveIsDark}
							label="Read Translation"
							languageCode={selectedLanguageCode}
						/>
					</div>
					<p className={`mt-2 text-sm ${effectiveIsDark ? "text-gray-200" : "text-gray-700"}`}>{translatedText}</p>
				</div>
			)}
		</div>
	);
}
