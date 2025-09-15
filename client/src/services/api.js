import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:3001/api" });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = "Bearer " + token;
  return cfg;
});
export default api;
