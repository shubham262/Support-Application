import axios, {
	type AxiosResponse,
	AxiosError,
	type InternalAxiosRequestConfig,
} from "axios";

// Create an Axios instance with base config
const api = axios.create({
	baseURL: "http://localhost:3000",
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add token to headers
api.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		if (error.response) {
			// Server responded with an error status code
			if (error.response.status === 401) {
				// if (typeof window !== "undefined") {
				//   localStorage.removeItem("usertoken");
				// }
			}
		} else if (error.request) {
			// No response received
			console.error("Network error:", error.request);
		} else {
			// Other errors
			console.error("Error:", error.message);
		}

		return Promise.reject(error);
	}
);

export default api;
