import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import VoiceOutputButton from "../components/VoiceOutputButton";
import TranslationWidget from "../components/TranslationWidget";

export default function Result() {
  const { isDark, toggleTheme } = useTheme();
  const { state } = useLocation();
  const score = state?.score ?? 0;
  const weakAreas = Array.isArray(state?.weakAreas) ? state.weakAreas : [];
  const explanation = state?.explanation || "No explanation available.";
  const questionReview = Array.isArray(state?.questionReview) ? state.questionReview : [];
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const explanationPoints = useMemo(() => {
    const byLine = explanation
      .split("\n")
      .map(line => line.replace(/^[-*•\d.)\s]+/, "").trim())
      .filter(Boolean);

    if (byLine.length > 1) return byLine;

    return explanation
      .split(/\.(?=\s|$)/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => (line.endsWith(".") ? line : `${line}.`));
  }, [explanation]);

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className={`glow-card mx-auto w-full max-w-3xl rounded-2xl border p-6 backdrop-blur-md ${isDark ? "border-gray-700/50 bg-gray-900/30" : "border-blue-200/50 bg-white/20"}`}>
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-gray-700" : "border-blue-200"}`}>
          <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">🎉 InsightLearn AI</p>
          <h1 className={`mt-1 text-3xl font-bold gradient-text`}>Quiz Result</h1>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className={`glow-card mt-8 rounded-xl border p-8 text-center backdrop-blur-sm ${isDark ? "border-green-600/30 bg-green-900/20" : "border-green-300/50 bg-green-50/30"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-green-400" : "text-green-700"}`}>📊 Your Score</p>
          <p className={`mt-4 text-6xl font-extrabold gradient-text`}>{score}%</p>
          <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {score >= 80 ? "🌟 Excellent! Outstanding performance!" : score >= 60 ? "👏 Great job! Keep it up!" : "📖 Good effort! Review and try again."}
          </p>
        </div>

        {weakAreas.length > 0 && (
          <div className={`glow-card mt-6 rounded-xl border p-6 backdrop-blur-sm ${isDark ? "border-red-600/30 bg-red-900/20" : "border-red-300/50 bg-red-50/30"}`}>
            <h2 className={`text-lg font-semibold ${isDark ? "text-red-400" : "text-red-700"}`}>🎯 Areas to Improve</h2>
            <ul className={`mt-4 space-y-2 pl-0`}>
              {weakAreas.map(area => (
                <li key={area} className={`flex items-start gap-2 rounded-lg border p-3 backdrop-blur-sm ${isDark ? "border-red-600/20 bg-red-900/20" : "border-red-200 bg-red-100/50"}`}>
                  <span className="text-lg">📌</span>
                  <span className={isDark ? "text-red-300" : "text-red-700"}>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {weakAreas.length === 0 && (
          <div className={`glow-card mt-6 rounded-xl border p-6 backdrop-blur-sm text-center ${isDark ? "border-green-600/30 bg-green-900/20" : "border-green-300/50 bg-green-50/30"}`}>
            <p className={`text-lg font-semibold ${isDark ? "text-green-400" : "text-green-700"}`}>✅ Perfect! No weak areas detected.</p>
          </div>
        )}

        {questionReview.length > 0 && (
          <div className={`glow-card mt-6 rounded-xl border p-6 backdrop-blur-sm ${isDark ? "border-blue-700/40 bg-gray-800/30" : "border-blue-200/60 bg-white/40"}`}>
            <h2 className="text-lg font-semibold gradient-text">✅ Correct Answers Review</h2>
            <div className="mt-4 space-y-4">
              {questionReview.map((item, index) => {
                const isCorrect = item.selected === item.correct;

                return (
                  <div
                    key={`${item.question}-${index}`}
                    className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-900/40" : "border-blue-100 bg-blue-50/50"}`}
                  >
                    <p className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      Q{index + 1}. {item.question}
                    </p>
                    <p className={`mt-2 text-sm ${isCorrect ? (isDark ? "text-green-400" : "text-green-700") : (isDark ? "text-red-400" : "text-red-700")}`}>
                      Your answer: {item.selected || "Not answered"}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isDark ? "text-green-400" : "text-green-700"}`}>
                      Correct answer: {item.correct}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={`glow-card mt-6 rounded-xl border p-6 backdrop-blur-sm ${isDark ? "border-gray-700/50 bg-gray-800/30" : "border-blue-200/50 bg-white/30"}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold gradient-text`}>💡 AI Explanation (Key Points)</h2>
            <VoiceOutputButton text={explanation} isDark={isDark} label="🔊 Read" languageCode={selectedLanguage} />
          </div>
          <ul className={`mt-4 space-y-3 text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {explanationPoints.map((point, index) => (
              <li key={`${point}-${index}`} className="flex gap-3">
                <span className="text-xl">●</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <TranslationWidget text={explanation} isDark={isDark} onLanguageChange={handleLanguageChange} />
        </div>

        <Link
          to="/dashboard"
          className="glow-button mt-6 inline-block rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white transition"
        >
          ⬅️ Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
