import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/sol" : "/sol";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // allow cookies and auth headers
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage for OAuth tokens
    const oauthToken = localStorage.getItem("token");
    if (oauthToken) {
      config.headers.Authorization = `Bearer ${oauthToken}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[API Response Error] ${error.response?.status} ${error.config?.url}`, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;