import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/sol" : "/sol";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // allow cookies and auth headers
});

export default api;