import api from "./api";

export const AUTH_KEY = "user";

export const getCurrentUser = () =>
  JSON.parse(localStorage.getItem(AUTH_KEY) || "null");

export const saveCurrentUser = (user) =>
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

export const clearCurrentUser = () => localStorage.removeItem(AUTH_KEY);

export const isAuthenticated = () => !!getCurrentUser();

export const isAdminUser = () => getCurrentUser()?.role === "admin";

export const getSessionUser = async () => {
  try {
    const { data } = await api.get("/api/me");
    saveCurrentUser({ ...(data.user || data.admin), role: data.role });
    return data;
  } catch {
    clearCurrentUser();
    return null;
  }
};

export const logout = async () => {
  await api.post("/api/logout");
  localStorage.removeItem(AUTH_KEY);
};
