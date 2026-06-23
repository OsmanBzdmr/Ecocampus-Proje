import axios from 'axios';

const API = axios.create();

export const fetchProducts = (params = {}) => API.get('/api/products', { params });
export const addProduct = (data, token) => API.post('/api/products', data, {
  headers: { Authorization: token }
});
export const updateProduct = (id, data, token) => API.put(`/api/products/${id}`, data, {
  headers: { Authorization: token }
});
export const deleteProduct = (id, token) => API.delete(`/api/products/${id}`, {
  headers: { Authorization: token }
});
export const login = (credentials) => API.post('/api/auth/login', credentials);
export const register = (data) => API.post('/api/auth/register', data);
export const fetchCategories = () => API.get('/api/categories');
export const getMe = (token) => API.get('/api/auth/me', { headers: { Authorization: token } });
