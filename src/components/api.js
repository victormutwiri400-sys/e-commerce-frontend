import axios from "axios";

const CSRF_STORAGE_KEY = "csrf_token";

const api = axios.create({
  // Override per environment via REACT_APP_API_URL, or default to the deployed API.
  baseURL: process.env.REACT_APP_API_URL || "https://e-commerce-u1yp.onrender.com",
  timeout: 20000,
  withCredentials: true,
});

api.defaults.headers.common["Accept"] = "application/json";

// ---- CSRF token helpers (stored in localStorage, sent back as a header) ----
export const saveCsrfToken = (token) => {
  if (token) localStorage.setItem(CSRF_STORAGE_KEY, token);
};

export const getCsrfToken = () => localStorage.getItem(CSRF_STORAGE_KEY) || "";

export const clearCsrfToken = () => localStorage.removeItem(CSRF_STORAGE_KEY);

// Attach the CSRF token to every state-changing request.
api.interceptors.request.use((config) => {
  const method = (config.method || "").toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const token = getCsrfToken();
    if (token) config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

export default api;
