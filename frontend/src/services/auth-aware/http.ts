import axios, { type AxiosInstance } from 'axios';
import { ADMIN_TOKEN_KEY } from './token';

export function createAuthed(baseURL: string, onUnauthorized: () => void): AxiosInstance {
  const http = axios.create({ baseURL });
  http.interceptors.request.use((config) => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  http.interceptors.response.use((response) => response, (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) onUnauthorized();
    return Promise.reject(error);
  });
  return http;
}
