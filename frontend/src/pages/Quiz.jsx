import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { quizApi } from "../api/axios";
import useTheme from "../hooks/useTheme";
import VoiceOutputButton from "../components/VoiceOutputButton";
import VoiceInputButton from "../components/VoiceInputButton";

export default function Quiz() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = generatedQuestions[currentIndex];
  const progressText = useMemo(() => {
    if (!generatedQuestions.length) return "0/0";
    return `${currentIndex + 1}/${generatedQuestions.length}`;
  }, [currentIndex, generatedQuestions.length]);

  const handleGenerateQuiz = async () => {
    try {
      setError("");
      setIsLoading(true);

      if (!topic.trim()) {
        setError("Please enter a topic.");
        return;
      }

      const res = await quizApi.generate({ topic: topic.trim() });
      const questions = Array.isArray(res?.data)
        ? res.data
        : res?.data?.questions || res?.data?.data?.questions || [];

      if (!questions.length) {
        setError("No quiz questions received. Try another topic.");
        return;
      }

      setGeneratedQuestions(questions);
      setSelectedAnswers(new Array(questions.length).fill(""));
      setCurrentIndex(0);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = option => {
    setSelectedAnswers(previous => {
      const updated = [...previous];
      updated[currentIndex] = option;
      return updated;
    });
  };

  const handleNext = () => {
    if (!selectedAnswers[currentIndex]) {
      setError("Please select an answer before continuing.");
      return;
    }

    setError("");
    setCurrentIndex(previous => previous + 1);
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setIsLoading(true);

      if (!selectedAnswers[currentIndex]) {
        setError("Please select an answer before submitting.");
        return;
      }

      const payloadQuestions = generatedQuestions.map((question, index) => ({
        selected: selectedAnswers[index],
        correct: question.correctAnswer,
        concept: question.concept,
      }));

      const res = await quizApi.submit({
        topic,
        questions: payloadQuestions,
      });

      const questionReview = generatedQuestions.map((question, index) => ({
        question: question.question,
        options: question.options,
        selected: selectedAnswers[index],
        correct: question.correctAnswer,
        concept: question.concept,
      }));

      const resultData = {
        score: res?.data?.score ?? res?.data?.data?.score ?? 0,
        weakAreas: res?.data?.weakAreas ?? res?.data?.data?.weakAreas ?? [],
        explanation: res?.data?.explanation ?? res?.data?.data?.explanation ?? "No explanation available.",
        questionReview,
      };

      navigate("/result", { state: resultData });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className={`glow-card mx-auto w-full max-w-3xl rounded-2xl border p-6 backdrop-blur-md ${isDark ? "border-gray-700/50 bg-gray-900/30" : "border-blue-200/50 bg-white/20"}`}>
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-gray-700" : "border-blue-200"}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">📝 InsightLearn AI</p>
            <h1 className={`mt-1 text-2xl font-bold gradient-text`}>AI Quiz</h1>
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

        <div className="mt-6 space-y-4">
          {!generatedQuestions.length ? (
            <>
              <div>
                <label className={`mb-2 block text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>📌 Enter Topic</label>
                <input
                  className={`glow-input w-full rounded-xl border px-4 py-3 text-sm outline-none backdrop-blur-sm ${isDark ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500" : "border-blue-300 bg-white/80 text-gray-900 placeholder-gray-500"}`}
                  placeholder="e.g. JavaScript Promises, Photosynthesis, World War II"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>

              {error ? (
                <div className="rounded-lg border border-red-300 bg-red-50/80 px-4 py-3 text-sm text-red-600 backdrop-blur-sm">
                  ⚠️ {error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={isLoading}
                className="glow-button w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isLoading ? "🔄 Generating Quiz..." : "✨ Generate Quiz"}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>Progress</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-gray-300">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${((currentIndex + 1) / generatedQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-bold text-white">
                    {progressText}
                  </span>
                </div>
              </div>

              <div className={`glow-card rounded-xl border p-6 backdrop-blur-sm ${isDark ? "border-gray-700/50 bg-gray-800/30" : "border-blue-200/50 bg-white/30"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-base font-semibold leading-relaxed ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      {currentQuestion?.question}
                    </p>
                  </div>
                  <VoiceOutputButton text={currentQuestion?.question} isDark={isDark} label="🔊" />
                </div>
                <div className="mt-6 space-y-3">
                  {currentQuestion?.options?.map(option => {
                    const isSelected = selectedAnswers[currentIndex] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelectOption(option)}
                        className={`glow-button w-full rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                          isSelected
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-600 text-white"
                            : isDark
                              ? "border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                              : "border-blue-200 bg-blue-50/80 text-gray-900 hover:bg-blue-100"
                        }`}
                      >
                        {isSelected ? "✅ " : "○ "} {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error ? (
                <div className="rounded-lg border border-red-300 bg-red-50/80 px-4 py-3 text-sm text-red-600 backdrop-blur-sm">
                  ⚠️ {error}
                </div>
              ) : null}

              {currentIndex < generatedQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="glow-button w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white"
                >
                  ➜ Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="glow-button w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isLoading ? "⏳ Submitting..." : "🎉 Submit Quiz"}
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
