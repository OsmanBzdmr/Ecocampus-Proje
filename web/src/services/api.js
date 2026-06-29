import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export const fetchProducts = (params = {}, token) => {
  const config = { params };
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  return API.get('/api/products', config);
};
export const getProductById = (id, token) => {
  const config = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  return API.get(`/api/products/${id}`, config);
};
export const addProduct = (data, token) => API.post('/api/products', data, {
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
});
export const updateProduct = (id, data, token) => API.put(`/api/products/${id}`, data, {
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
});
export const deleteProduct = (id, token) => API.delete(`/api/products/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});
export const login = (credentials) => API.post('/api/auth/login', credentials);
export const register = (data) => API.post('/api/auth/register', data);
export const fetchCategories = () => API.get('/api/categories');

export const getMe = (token) => API.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
export const deleteAccount = (password, token) => API.delete('/api/auth/me', {
  headers: { Authorization: `Bearer ${token}` },
  data: { password },
});
export const toggleFavorite = (productId, token) => API.post(`/api/favorites/${productId}`, null, {
  headers: { Authorization: `Bearer ${token}` },
});
export const getFavorites = (token) => API.get('/api/favorites', {
  headers: { Authorization: `Bearer ${token}` },
});