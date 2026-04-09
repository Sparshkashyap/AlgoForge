import api from '@/lib/api';

export const getProblems = async (params?: Record<string, string | number>) => {
  const response = await api.get('/problems', { params });
  return response.data;
};

export const getProblemBySlug = async (slug: string) => {
  const response = await api.get(`/problems/${slug}`);
  return response.data;
};

export const createProblem = async (payload: any) => {
  const response = await api.post('/problems', payload);
  return response.data;
};