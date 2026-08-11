import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-u1yp.onrender.com",
  timeout: 20000,
  withCredentials: true,
});

api.defaults.headers.common["Accept"] = "application/json";

export default api;
