import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loginApi, logoutApi, meApi, signupApi } from "@/api/auth.api";
import { getSocket, attachSocketUser } from "@/lib/socket";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "CREATOR" | "ADMIN";
  plan: "FREE" | "STANDARD" | "PRO";
  avatarUrl?: string | null;
  createdAt?: string;
  solvedCount?: number;
  streak?: number;
   subscriptionActive?: boolean;
};

type LoginPayload = {
  email: string;
  password: string;
  recaptchaToken: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  recaptchaToken: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const extractUserFromResponse = (response: any): AuthUser | null => {
  return response?.user || response?.data || null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const joinedUserIdRef = useRef<string | null>(null);

  const refreshMe = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const response = await meApi();
      const nextUser = extractUserFromResponse(response);
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const resolveAuthenticatedUser = useCallback(async (): Promise<AuthUser> => {
    const response = await meApi();
    const nextUser = extractUserFromResponse(response);

    if (!nextUser) {
      throw new Error("Authenticated user data could not be loaded.");
    }

    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await refreshMe();
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [refreshMe]);

  useEffect(() => {
    const socket = getSocket();

    if (!user?.id) {
      if (joinedUserIdRef.current && socket.connected) {
        socket.emit("leave", joinedUserIdRef.current);
      }
      joinedUserIdRef.current = null;

      if (socket.connected) {
        socket.disconnect();
      }
      return;
    }

    attachSocketUser(user.id);

    if (joinedUserIdRef.current !== user.id) {
      if (joinedUserIdRef.current && socket.connected) {
        socket.emit("leave", joinedUserIdRef.current);
      }

      socket.emit("join", user.id);
      joinedUserIdRef.current = user.id;
    }

    return () => {
      if (joinedUserIdRef.current === user.id && socket.connected) {
        socket.emit("leave", user.id);
        joinedUserIdRef.current = null;
      }
    };
  }, [user?.id]);

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthUser> => {
      const response = await loginApi(payload);
      const nextUser = extractUserFromResponse(response);

      if (nextUser) {
        setUser(nextUser);
        return nextUser;
      }

      await refreshMe();
      return resolveAuthenticatedUser();
    },
    [refreshMe, resolveAuthenticatedUser]
  );

  const signup = useCallback(
    async (payload: SignupPayload): Promise<AuthUser> => {
      const response = await signupApi(payload);
      const nextUser = extractUserFromResponse(response);

      if (nextUser) {
        setUser(nextUser);
        return nextUser;
      }

      await refreshMe();
      return resolveAuthenticatedUser();
    },
    [refreshMe, resolveAuthenticatedUser]
  );

  const logout = useCallback(async (): Promise<void> => {
    const socket = getSocket();

    try {
      await logoutApi();
    } finally {
      if (joinedUserIdRef.current && socket.connected) {
        socket.emit("leave", joinedUserIdRef.current);
      }

      joinedUserIdRef.current = null;
      setUser(null);

      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, []);

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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}