import axios from "axios";

const envBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const resolvedBaseUrl = envBaseUrl || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const api = axios.create({
	baseURL: resolvedBaseUrl,
	withCredentials: true,
});

api.interceptors.request.use(config => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const authApi = {
	register: payload => api.post("/auth/register", payload),
	login: payload => api.post("/auth/login", payload),
	logout: () => api.post("/auth/logout"),
};

export const quizApi = {
	generate: payload => api.post("/quiz/generate", payload),
	submit: payload => api.post("/quiz/submit", payload),
};

export const aiApi = {
	explain: payload => api.post("/ai/explain", payload),
};

export const userApi = {
	getDashboardAnalytics: () => api.get("/user/dashboard/analytics"),
};

export const translateApi = {
	translate: (payload) => api.post("/translate/translate", payload),
	detect: (payload) => api.post("/translate/detect", payload),
};

export default api;
