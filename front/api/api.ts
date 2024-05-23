import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User } from '../models/User';

const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },
  register: async (formData: FormData) => {
    try {
      const response = await apiClient.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  },
  logout: async (user: Partial<User>) => {
    try {
      const response = await apiClient.post('/auth/logout', user, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  },
  refreshToken: async (user: Partial<User>) => {
    try {
      const response = await apiClient.post('/auth/refreshToken', user, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Refresh Token Error:', error);
      throw error;
    }
  },
};
