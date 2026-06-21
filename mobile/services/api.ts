import axios from 'axios';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri || '';
  const ip = debuggerHost.split(':')[0];
  return ip ? `http://${ip}:5000` : 'http://10.0.2.2:5000';
};

const API = axios.create({ baseURL: getBaseUrl() });

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string | null;
  image_url: string | null;
  user_id: number;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export interface LoginResponse {
  token: string;
  user: { id: number; username: string };
}

export const login = (credentials: { email: string; password: string }) =>
  API.post<LoginResponse>('/api/auth/login', credentials);

export const register = (data: { username: string; email: string; password: string }) =>
  API.post<{ id: number; username: string; email: string }>('/api/auth/register', data);

export const fetchProducts = () =>
  API.get<Product[]>('/api/products');

export const addProduct = (data: { title: string; price: number; description?: string; image_url?: string; category_id?: number }, token: string) =>
  API.post<Product>('/api/products', data, { headers: { Authorization: token } });

export const deleteProduct = (id: number, token: string) =>
  API.delete<{ message: string }>(`/api/products/${id}`, { headers: { Authorization: token } });

export const fetchCategories = () =>
  API.get<Category[]>('/api/categories');
