import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { aiApi } from "../api/axios";
import useTheme from "../hooks/useTheme";
import VoiceOutputButton from "../components/VoiceOutputButton";
import TranslationWidget from "../components/TranslationWidget";

export default function AiTutor() {
	const { isDark, toggleTheme } = useTheme();
	const [topicsInput, setTopicsInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [explanation, setExplanation] = useState("");
	const [error, setError] = useState("");
	const [selectedLanguage, setSelectedLanguage] = useState("en");
	const [explanationStyle, setExplanationStyle] = useState("clear-points");

	const explanationPoints = useMemo(() => {
		if (!explanation) return [];

		const byLine = explanation
			.split("\n")
			.map(line => line.replace(/^[-*•\d.)\s]+/, "").trim())
			.filter(Boolean);

		if (byLine.length > 1) {
			return byLine;
		}

		return explanation
			.split(/\.(?=\s|$)/)
			.map(line => line.trim())
			.filter(Boolean)
			.map(line => (line.endsWith(".") ? line : `${line}.`));
	}, [explanation]);

	const handleExplain = async () => {
		try {
			setError("");
			setExplanation("");
			setIsLoading(true);

			const topics = topicsInput
				.split(",")
				.map(topic => topic.trim())
				.filter(Boolean);

			if (topics.length === 0) {
				setError("Please enter at least one topic.");
				return;
			}

			const res = await aiApi.explain({ topics, style: explanationStyle });
			setExplanation(res?.data?.data?.explanation || "No explanation returned.");
		} catch (err) {
			setError(err?.response?.data?.message || "Failed to generate AI explanation.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLanguageChange = (languageCode) => {
		setSelectedLanguage(languageCode);
	};

	return (
		<div className="min-h-screen px-4 py-8">
			<div className={`glow-card mx-auto w-full max-w-4xl rounded-2xl border p-6 backdrop-blur-md ${isDark ? "border-gray-700/50 bg-gray-900/30" : "border-blue-200/50 bg-white/20"}`}>
				<div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-gray-700" : "border-blue-200"}`}>
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-blue-600">🤖 InsightLearn AI</p>
						<h1 className={`mt-1 text-3xl font-bold gradient-text`}>AI Tutor</h1>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={toggleTheme}
							className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
						>
							{isDark ? "☀️ Light" : "🌙 Dark"}
						</button>
						<Link
							to="/dashboard"
							className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${isDark ? "border-gray-600 text-gray-200 hover:bg-gray-800" : "border-blue-300 text-blue-600 hover:bg-blue-100"}`}
						>
							⬅️ Back
						</Link>
					</div>
				</div>

			<div className={`glow-card mt-6 rounded-xl border p-8 text-center backdrop-blur-sm ${isDark ? "border-gray-700/50 bg-gray-800/30" : "border-blue-200/50 bg-white/30"}`}>
					<h2 className={`text-2xl font-bold gradient-text`}>Your personalized tutor is ready 👋</h2>
					<p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Ask any concept, and get step-by-step AI-powered explanations with examples.</p>

					<div className="mt-6 space-y-4 text-left">
						<div>
							<label className={`mb-2 block text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>📌 Topics (comma-separated)</label>
							<input
								className={`glow-input w-full rounded-xl border px-4 py-3 text-sm outline-none backdrop-blur-sm ${isDark ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500" : "border-blue-300 bg-white/80 text-gray-900 placeholder-gray-500"}`}
								placeholder="e.g. fractions, photosynthesis, past tense"
								value={topicsInput}
								onChange={e => setTopicsInput(e.target.value)}
							/>
						</div>
						<div>
							<label className={`mb-2 block text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>🧠 Explanation Style</label>
							<select
								value={explanationStyle}
								onChange={e => setExplanationStyle(e.target.value)}
								className={`w-full rounded-xl border px-4 py-3 text-sm outline-none backdrop-blur-sm ${isDark ? "border-gray-600 bg-gray-800 text-gray-100" : "border-blue-300 bg-white/80 text-gray-900"}`}
							>
								<option value="elaborate">Elaborate</option>
								<option value="simple">Simple</option>
								<option value="clear-points">Clear Points</option>
							</select>
						</div>
						<button
							type="button"
							onClick={handleExplain}
							disabled={isLoading}
							className="glow-button w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-sm font-semibold text-white disabled:opacity-60"
						>
							{isLoading ? "🔄 Generating Explanation..." : "✨ Generate Explanation"}
						</button>

						{error ? (
							<div className="rounded-lg border border-red-300 bg-red-50/80 px-4 py-3 text-sm text-red-600 backdrop-blur-sm">
								⚠️ {error}
							</div>
						) : null}
						{explanationPoints.length ? (
						<>
						<div className={`glow-card rounded-xl border p-6 text-sm backdrop-blur-sm ${isDark ? "border-gray-700/50 bg-gray-800/30" : "border-blue-200/50 bg-white/30"}`}>
								<div className="flex items-center justify-between mb-4">
									<p className="text-sm font-bold gradient-text">💡 AI Response (Key Points)</p>
									<VoiceOutputButton text={explanation} isDark={isDark} label="🔊 Read" languageCode={selectedLanguage} />
								</div>
								<ul className={`space-y-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									{explanationPoints.map((point, index) => (
										<li key={`${point}-${index}`} className="flex gap-3">
											<span className="mt-1">●</span>
											<span>{point}</span>
										</li>
									))}
								</ul>
							</div>
							<div>
								<TranslationWidget text={explanation} isDark={isDark} onLanguageChange={handleLanguageChange} />
							</div>
						</>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
