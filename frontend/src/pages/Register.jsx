import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/axios";
import useTheme from "../hooks/useTheme";

export default function Register() {
	const { isDark, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleRegister = async () => {
		if (!email || !password || !confirmPassword) {
			setError("Please fill in all fields.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			setError("");
			setSuccess("");
			setIsLoading(true);
			await authApi.register({ email, password });
			setSuccess("Registration successful. Redirecting to login...");
			setTimeout(() => navigate("/"), 900);
		} catch (err) {
			setError(err?.response?.data?.message || "Registration failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 flex items-center">
			<div className={`glow-card mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border backdrop-blur-md lg:grid-cols-2 ${isDark ? "border-gray-700/50 bg-gray-900/30" : "border-blue-200/50 bg-white/20"}`}>
				<div className="flex flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white sm:p-8 min-h-[300px] sm:min-h-[400px]">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">✨ InsightLearn AI</p>
						<h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">Create your premium learning account</h1>
						<p className="mt-3 text-sm text-blue-100 sm:text-base">Join InsightLearn AI to unlock personalized tutoring and guided growth.</p>
					</div>
					<p className="mt-6 text-xs text-blue-100">🚀 Start your AI-powered journey in under a minute.</p>
				</div>

				<div className="relative p-5 sm:p-8">
					<button
						type="button"
						onClick={toggleTheme}
						className={`absolute right-5 top-5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
					>
						{isDark ? "☀️ Light" : "🌙 Dark"}
					</button>
					<h2 className={`text-2xl font-bold sm:text-3xl ${isDark ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" : "text-gray-900"}`}>Create account</h2>
					<p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Register to continue to InsightLearn AI</p>

					<div className="mt-6 space-y-4 sm:space-y-5">
						<div>
							<label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>📧 Email</label>
							<input
								className={`glow-input w-full rounded-xl border px-4 py-3 text-sm outline-none backdrop-blur-sm ${isDark ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500" : "border-blue-300 bg-white/80 text-gray-900 placeholder-gray-500"}`}
								placeholder="you@example.com"
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
						</div>

						<div>
							<label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>🔐 Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									className={`glow-input w-full rounded-xl border px-4 py-3 pr-20 text-sm outline-none backdrop-blur-sm ${isDark ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500" : "border-blue-300 bg-white/80 text-gray-900 placeholder-gray-500"}`}
									placeholder="Create a strong password"
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(prev => !prev)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-500 transition hover:text-blue-600"
								>
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						<div>
							<label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>✓ Confirm Password</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									className={`glow-input w-full rounded-xl border px-4 py-3 pr-20 text-sm outline-none backdrop-blur-sm ${isDark ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500" : "border-blue-300 bg-white/80 text-gray-900 placeholder-gray-500"}`}
									placeholder="Confirm your password"
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(prev => !prev)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-500 transition hover:text-blue-600"
								>
									{showConfirmPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{error ? (
							<div className="rounded-lg border border-red-300 bg-red-50/80 px-4 py-3 text-sm text-red-600 backdrop-blur-sm">
								⚠️ {error}
							</div>
						) : null}
						{success ? (
							<div className="rounded-lg border border-green-300 bg-green-50/80 px-4 py-3 text-sm text-green-600 backdrop-blur-sm">
								✅ {success}
							</div>
						) : null}

						<button
							onClick={handleRegister}
							disabled={isLoading}
							className="glow-button w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white disabled:opacity-60"
						>
							{isLoading ? "🔄 Creating account..." : "✨ Create account"}
						</button>

						<p className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-700"}`}>
							Already have an account?{" "}
							<Link to="/" className="font-semibold text-blue-600 hover:text-blue-700 transition">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
