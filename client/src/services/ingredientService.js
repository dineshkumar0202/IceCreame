import api from "./api"; // your axios instance

export const requestIngredient = (data) => api.post("/ingredients", data);
export const getRequests = () => api.get("/ingredients").then(res => res.data);
export const updateRequestStatus = (id, status) =>
  api.put(`/ingredients/${id}/status`, { status });
export const deleteRequest = (id) => api.delete(`/ingredients/${id}`);
