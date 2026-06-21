import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' });

export const fetchProducts = () => API.get('/api/products');
export const addProduct = (data, token) => API.post('/api/products', data, {
  headers: { Authorization: token }
});
export const deleteProduct = (id, token) => API.delete(`/api/products/${id}`, {
  headers: { Authorization: token }
});
export const login = (credentials) => API.post('/api/auth/login', credentials);
