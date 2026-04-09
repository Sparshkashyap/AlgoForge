import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, logoutApi, meApi, signupApi } from "../api/auth.api";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  plan: "FREE" | "PRO";
  streak: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("algoforge_token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = (nextToken: string | null, nextUser: User | null) => {
    if (nextToken) {
      localStorage.setItem("algoforge_token", nextToken);
    } else {
      localStorage.removeItem("algoforge_token");
    }

    setToken(nextToken);
    setUser(nextUser);
  };

  const fetchMe = async () => {
    try {
      const existingToken = localStorage.getItem("algoforge_token");
      if (!existingToken) {
        setLoading(false);
        return;
      }

      const response = await meApi();
      setUser(response.data.data);
    } catch {
      persistAuth(null, null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const signup = async (payload: { name: string; email: string; password: string }) => {
    const response = await signupApi(payload);
    const newToken = response.data.data.token;
    const newUser = response.data.data.user;
    persistAuth(newToken, newUser);
  };

  const login = async (payload: { email: string; password: string }) => {
    const response = await loginApi(payload);
    const newToken = response.data.data.token;
    const newUser = response.data.data.user;
    persistAuth(newToken, newUser);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    } finally {
      persistAuth(null, null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      signup,
      login,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
};