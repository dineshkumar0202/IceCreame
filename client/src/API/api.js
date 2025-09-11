import axios from "axios";

// Base Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend server
  headers: {
    "Content-Type": "application/json",
  },
});

// Example APIs
export const getBranches = () => api.get("/branches");
export const getSales = () => api.get("/sales");
export const getDashboardTopFlavors = () => api.get("/dashboard/top-flavors");

export default api;
