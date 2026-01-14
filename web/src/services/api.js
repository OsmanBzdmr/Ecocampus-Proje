import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchProducts = () => API.get('/products');
export const addProduct = (data, token) => API.post('/products', data, {
    headers: { Authorization: token }
});
export const login = (credentials) => API.post('/auth/login', credentials);