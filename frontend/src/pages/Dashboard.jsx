import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../api/axios";
import useTheme from "../hooks/useTheme";

export default function Dashboard() {
	const { isDark, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const [analytics, setAnalytics] = useState({
		progress: 0,
		completedQuizzes: 0,
		aiAccuracy: 0,
		topicsCovered: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				// Check if user has a valid token
				const token = localStorage.getItem("token");
				if (!token) {
					navigate("/");
					return;
				}

				setIsLoading(true);
				const res = await userApi.getDashboardAnalytics();
				setAnalytics(res?.data?.data || {
					progress: 0,
					completedQuizzes: 0,
					aiAccuracy: 0,
					topicsCovered: [],
				});
			} catch (err) {
				// If 401, redirect to login
				if (err?.response?.status === 401) {
					localStorage.removeItem("token");
					navigate("/");
					return;
				}
				setError("Failed to load analytics");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalytics();
	}, [navigate]);

	return (
		<div className="min-h-screen px-4 py-8">
			<div className={`glow-card mx-auto max-w-5xl rounded-2xl border p-6 backdrop-blur-md ${isDark ? "border-gray-700/50 bg-gray-900/30" : "border-blue-200/50 bg-white/20"}`}>
				<div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-gray-700" : "border-blue-200"}`}>
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-blue-600">✨ InsightLearn AI</p>
						<h1 className={`mt-1 text-3xl font-bold gradient-text`}>Dashboard</h1>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={toggleTheme}
							className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
						>
							{isDark ? "☀️ Light" : "🌙 Dark"}
						</button>
						<button
							onClick={() => {
								localStorage.removeItem("token");
								navigate("/");
							}}
							className={`glow-button rounded-lg border px-4 py-2 text-sm font-semibold transition ${isDark ? "border-red-600 bg-red-900/20 text-red-400 hover:bg-red-900/30" : "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"}`}
						>
							🚪 Logout
						</button>
					</div>
				</div>

				<div className="mt-8 grid gap-4 sm:grid-cols-3">
					<div className={`glow-card rounded-xl border p-6 backdrop-blur-sm transition ${isDark ? "border-gray-700/50 bg-gray-800/30" : "border-blue-200/50 bg-white/30"}`}>
						<p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>📊 Progress</p>
						<p className={`mt-3 text-4xl font-bold gradient-text`}>
							{isLoading ? "—" : `${analytics.progress}%`}
						</p>
						<p className={`mt-2 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>of 15 quizzes completed</p>
					</div>
				<div className={`glow-card rounded-xl border p-6 backdrop-blur-sm transition ${isDark ? "border-gray-700/50 bg-gray-800/30" : "border-blue-200/50 bg-white/30"}`}>
						<p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>🎯 Completed Quiz</p>
						<p className={`mt-3 text-4xl font-bold gradient-text`}>
							{isLoading ? "—" : analytics.completedQuizzes}
						</p>
						<p className={`mt-2 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>successful attempts</p>
					</div>
				<div className={`glow-card rounded-xl border p-6 backdrop-blur-sm transition ${isDark ? "border-gray-700/50 bg-gray-800/30" : "border-blue-200/50 bg-white/30"}`}>
						<p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>🚀 AI Accuracy</p>
						<p className={`mt-3 text-4xl font-bold gradient-text`}>
							{isLoading ? "—" : `${analytics.aiAccuracy}%`}
						</p>
						<p className={`mt-2 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>average score</p>
					</div>
				</div>

				{analytics.topicsCovered?.length > 0 && (
				<div className={`glow-card mt-6 rounded-xl border p-6 backdrop-blur-sm ${isDark ? "border-gray-700/50 bg-gray-800/30" : "border-blue-200/50 bg-white/30"}`}>
						<p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>🎓 Topics Covered</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{analytics.topicsCovered.map(topic => (
								<span
									key={topic}
									className="glow-badge inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white"
								>
									{topic}
								</span>
							))}
						</div>
					</div>
				)}

				<div className={`glow-card mt-6 rounded-xl border p-6 backdrop-blur-sm ${isDark ? "border-green-600/30 bg-green-900/20" : "border-green-300/50 bg-green-50/30"}`}>
					<p className={`text-sm ${isDark ? "text-green-300" : "text-green-700"}`}>
						{isLoading
							? "⏳ Loading your learning journey..."
							: analytics.completedQuizzes === 0
							? "🎉 Start your learning journey with personalized AI tutoring."
							: `🌟 Continue your learning journey! You've covered ${analytics.topicsCovered.length} topic${analytics.topicsCovered.length !== 1 ? "s" : ""} so far.`}
					</p>
					<div className="mt-4 flex flex-wrap gap-3">
						<Link
							to="/ai"
							className="glow-button inline-block rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white transition"
						>
							🤖 Open AI Tutor
						</Link>
						<Link
							to="/quiz"
							className="glow-button inline-block rounded-lg border border-blue-500 bg-transparent px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
						>
							📝 Open Quiz
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
