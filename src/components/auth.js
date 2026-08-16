import api from "./api";

export const AUTH_KEY = "user";

export const getCurrentUser = () =>
  JSON.parse(localStorage.getItem(AUTH_KEY) || "null");

export const saveCurrentUser = (user) =>
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

export const clearCurrentUser = () => localStorage.removeItem(AUTH_KEY);

export const isAuthenticated = () => !!getCurrentUser();

export const isAdminUser = () => {
  const currentUser = getCurrentUser();
  return currentUser?.role === "admin";
};

export const getSessionUser = async () => {
  try {
    const { data } = await api.get("/api/me");
    const resolvedUser = data.user || data.admin;
    const userPayload = { ...(resolvedUser || {}), role: data.role };
    saveCurrentUser(userPayload);
    return data;
  } catch (error) {
    const fallbackError = error;
    clearCurrentUser();
    return fallbackError ? null : null;
  }
};

export const logout = async () => {
  try {
    await api.post("/api/logout");
  } finally {
    clearCurrentUser();
  }
};
