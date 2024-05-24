import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User } from '../models/User';
import { Post } from '../models/Post';

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
  googleLogin: async (idToken: string) => {
    try {
      const response = await apiClient.post('/auth/googleLogin', { idToken }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    }
  },
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
  getPosts: async () => {
    try {
      const response = await apiClient.get('/posts', {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Get Posts Error:', error);
      throw error;
    }
  },
  getPostsByUserId: async (userId: string) => {
    try {
      const response = await apiClient.get(`/posts/by/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Get Posts By User ID Error:', error);
      throw error;
    }
  },
  getUserProfile: async (userId: string) => {
    try {
      const response = await apiClient.get(`/user/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Get User Profile Error:', error);
      throw error;
    }
  },
  editUser: async (userId: string, user: Partial<User>) => {
    try {
      const response = await apiClient.put(`/user/${userId}`, { user }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Update User Error: sad', error);
      throw error;
    }
  },
  updateUserProfile: async (user: User) => {
    try {
      const response = await apiClient.put(`/user/${user.id}`, user, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Update User Profile Error:', error);
      throw error;
    }
  },
  updatePost: async (post: Post) => {
    try {
      const response = await apiClient.put(`/posts/${post._id}`, post, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Update Post Error:', error);
      throw error;
    }
  },
  createPost: async (formData: FormData) => {
    try {
      const response = await apiClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deletePost: async (id: string) => {
    try {
      const response = await apiClient.delete(`/posts/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
