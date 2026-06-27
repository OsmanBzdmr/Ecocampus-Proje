import axios from 'axios';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || '';
  const ip = hostUri.split(':')[0];
  if (ip) return `http://${ip}:5000`;
  return 'http://10.0.2.2:5000';
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
  status?: string;
  username?: string;
  category_name?: string;
  created_at?: string;
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

export const fetchProducts = (params?: Record<string, any>) =>
  API.get<Product[]>('/api/products', { params });

export const getProductById = (id: number) =>
  API.get<Product>(`/api/products/${id}`);

export const addProduct = (data: any, token: string) =>
  API.post<Product>('/api/products', data, { headers: { Authorization: token } });

export const addProductWithImage = (formData: FormData, token: string) =>
  API.post<Product>('/api/products', formData, { headers: { Authorization: token } });

export const updateProduct = (
  id: number,
  data: any,
  token: string
) => API.put<Product>(`/api/products/${id}`, data, { headers: { Authorization: token } });

export const updateProductWithImage = (id: number, formData: FormData, token: string) =>
  API.put<Product>(`/api/products/${id}`, formData, { headers: { Authorization: token } });

export const deleteProduct = (id: number, token: string) =>
  API.delete<{ message: string }>(`/api/products/${id}`, { headers: { Authorization: token } });

export const fetchCategories = () =>
  API.get<Category[]>('/api/categories');

export interface UserProfile {
  user: { id: number; username: string; email: string; created_at: string };
  stats: { totalListings: number; activeListings: number; donationListings: number; totalValue: number };
  listings: Product[];
}

export const getMe = (token: string) =>
  API.get<UserProfile>('/api/auth/me', { headers: { Authorization: token } });
