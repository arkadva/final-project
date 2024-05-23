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
};
