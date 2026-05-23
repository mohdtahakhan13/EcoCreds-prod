// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://ecocreds-prod.onrender.com/api"
});

// auto attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
