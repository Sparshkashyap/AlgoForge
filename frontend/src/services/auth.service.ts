import api from '@/lib/api';

export const signupUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post('/auth/signup', payload);
  return response.data;
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};