'use client';

import { useEffect, useState } from 'react';
import { getToken, clearToken, setToken } from '@/lib/token';
import { useAuthStore } from '@/store/auth.store';
import { getCurrentUser, loginUser, signupUser } from '@/services/auth.service';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (error) {
        clearToken();
        logoutStore();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, logoutStore]);

  const signup = async (payload: { name: string; email: string; password: string }) => {
    const res = await signupUser(payload);
    setToken(res.data.token);
    setUser(res.data.user);
    return res;
  };

  const login = async (payload: { email: string; password: string }) => {
    const res = await loginUser(payload);
    setToken(res.data.token);
    setUser(res.data.user);
    return res;
  };

  const logout = () => {
    clearToken();
    logoutStore();
  };

  return {
    user,
    isAuthenticated,
    loading,
    signup,
    login,
    logout
  };
};