import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loginApi, logoutApi, meApi, signupApi } from "@/api/auth.api";
import type { LoginPayload, SignupPayload } from "@/types/auth.types";
import type { User } from "@/types/user.types";
import socket from "@/lib/socket";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const joinedUserIdRef = useRef<string | null>(null);

  const refreshMe = useCallback(async () => {
    try {
      const res = await meApi();
      const nextUser = res?.data ?? null;
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const resolveAuthenticatedUser = useCallback(async (): Promise<User> => {
    const res = await meApi();
    const nextUser = res?.data ?? null;

    if (!nextUser) {
      throw new Error("Authenticated user data could not be loaded.");
    }

    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    const boot = async () => {
      try {
        await refreshMe();
      } finally {
        setLoading(false);
      }
    };

    void boot();
  }, [refreshMe]);

  // socket handling (IMPORTANT - keep this)
  useEffect(() => {
    if (!user?.id) {
      joinedUserIdRef.current = null;
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    if (joinedUserIdRef.current !== user.id) {
      socket.emit("join", user.id);
      joinedUserIdRef.current = user.id;
    }

    return () => {
      if (joinedUserIdRef.current === user.id) {
        socket.emit("leave", user.id);
        joinedUserIdRef.current = null;
      }
    };
  }, [user?.id]);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginApi(payload);

    if (res?.data) {
      setUser(res.data);
      return res.data;
    }

    await refreshMe();
    return resolveAuthenticatedUser();
  }, [refreshMe, resolveAuthenticatedUser]);

  const signup = useCallback(async (payload: SignupPayload) => {
    const res = await signupApi(payload);

    if (res?.data) {
      setUser(res.data);
      return res.data;
    }

    await refreshMe();
    return resolveAuthenticatedUser();
  }, [refreshMe, resolveAuthenticatedUser]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      if (user?.id && socket.connected) {
        socket.emit("leave", user.id);
      }

      joinedUserIdRef.current = null;
      setUser(null);

      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      signup,
      logout,
      refreshMe,
    }),
    [user, loading, login, signup, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}