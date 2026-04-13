import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const authAPI = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const carAPI = {
  getAll: () => api.get("/cars"),
  create: (payload) => api.post("/cars", payload),
  update: (id, payload) => api.put(`/cars/${id}`, payload),
  delete: (id) => api.delete(`/cars/${id}`),
};

export const packageAPI = {
  getAll: () => api.get("/packages"),
  create: (payload) => api.post("/packages", payload),
  update: (id, payload) => api.put(`/packages/${id}`, payload),
  delete: (id) => api.delete(`/packages/${id}`),
};

export const servicePackageAPI = {
  getAll: () => api.get("/service-packages"),
  create: (payload) => api.post("/service-packages", payload),
  update: (id, payload) => api.put(`/service-packages/${id}`, payload),
  delete: (id) => api.delete(`/service-packages/${id}`),
};

export const paymentAPI = {
  getAll: () => api.get("/payments"),
  create: (payload) => api.post("/payments", payload),
  update: (id, payload) => api.put(`/payments/${id}`, payload),
  delete: (id) => api.delete(`/payments/${id}`),
};

export const reportAPI = {
  getByDate: (startDate, endDate) =>
    api.get(`/reports?startDate=${startDate}&endDate=${endDate}`),
};
