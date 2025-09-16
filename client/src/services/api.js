import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

// Request interceptor to add authentication token
api.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem("token");
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear invalid token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userBranch");
      localStorage.removeItem("username");
      
      // Redirect to login page
      window.location.href = "/login";
      
      // Return a more user-friendly error message
      return Promise.reject({
        ...error,
        message: "Your session has expired. Please log in again.",
        response: {
          ...error.response,
          data: {
            message: "Your session has expired. Please log in again."
          }
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
