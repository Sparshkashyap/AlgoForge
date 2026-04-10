import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  signupUser,
} from "@/services/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (data: { name: string; email: string; password: string }) => Promise<any>;
  login: (data: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signup = async (formData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const data = await signupUser(formData);
    setUser(data.user);
    return data;
  };

  const login = async (formData: { email: string; password: string }) => {
    const data = await loginUser(formData);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};