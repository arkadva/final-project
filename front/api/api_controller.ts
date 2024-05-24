import axios from 'axios';

import { User } from '../models/User';
import { Post } from '../models/Post';

import { api as realApi } from './api';

const api = realApi;

export const apiController = {
  login: async (email: string, password: string) => {
    try {
      return await api.login(email, password);
    } catch (error) {
      throw error;
    }
  },
  register: async (formData: FormData) => {
    try {
      return await api.register(formData);
    } catch (error) {
      throw error;
    }
  },
  getPosts: async () => {
    try {
      return await api.getPosts();
    } catch (error) {
      throw error;
    }
  },
  deletePost: async (id: string) => {
    try {
      return await api.deletePost(id);
    } catch (error) {
      throw error;
    }
  },
  getPostsByUserId: async (userId: string) => {
    try {
      return await api.getPostsByUserId(userId);
    } catch (error) {
      throw error;
    }
  },
  getUserProfile: async (userId: string) => {
    try {
      return await api.getUserProfile(userId);
    } catch (error) {
      throw error;
    }
  },
  editUser: async (userId: string, user: Partial<User>) => {
    try {
      return await api.editUser(userId, user);
    } catch (error) {
      throw error;
    }
  },
  updatePost: async (post: Post) => {
    try {
      return await api.updatePost(post);
    } catch (error) {
      throw error;
    }
  },
  createPost: async (formData: FormData) => {
    try {
      return await api.createPost(formData);
    } catch (error) {
      throw error;
    }
  },
};
