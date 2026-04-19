// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
//   type ReactNode,
// } from "react";
// import { loginApi, logoutApi, meApi, signupApi } from "@/api/auth.api";
// import type { LoginPayload, SignupPayload } from "@/types/auth.types";
// import type { User } from "@/types/user.types";

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   signup: (payload: SignupPayload) => Promise<User>;
//   login: (payload: LoginPayload) => Promise<User>;
//   logout: () => Promise<void>;
//   refreshMe: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const refreshMe = useCallback(async () => {
//     try {
//       const response = await meApi();
//       setUser(response.data ?? null);
//     } catch {
//       setUser(null);
//     }
//   }, []);

//   useEffect(() => {
//     const bootstrap = async () => {
//       try {
//         await refreshMe();
//       } finally {
//         setLoading(false);
//       }
//     };

//     void bootstrap();
//   }, [refreshMe]);

//   const signup = async (payload: SignupPayload) => {
//     const response = await signupApi(payload);

//     if (response.data) {
//       setUser(response.data);
//       return response.data;
//     }

//     await refreshMe();

//     const me = await meApi();
//     setUser(me.data ?? null);
//     return me.data;
//   };

//   const login = async (payload: LoginPayload) => {
//     const response = await loginApi(payload);

//     if (response.data) {
//       setUser(response.data);
//       return response.data;
//     }

//     await refreshMe();

//     const me = await meApi();
//     setUser(me.data ?? null);
//     return me.data;
//   };

//   const logout = async () => {
//     try {
//       await logoutApi();
//     } finally {
//       setUser(null);
//     }
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       loading,
//       isAuthenticated: Boolean(user),
//       signup,
//       login,
//       logout,
//       refreshMe,
//     }),
//     [user, loading, refreshMe]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const value = useContext(AuthContext);

//   if (!value) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }

//   return value;
// };




import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginApi, logoutApi, meApi, signupApi } from "@/api/auth.api";
import type { LoginPayload, SignupPayload } from "@/types/auth.types";
import type { User } from "@/types/user.types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signup: (payload: SignupPayload) => Promise<User>;
  login: (payload: LoginPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const response = await meApi();
      setUser(response.data ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refreshMe();
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [refreshMe]);

  const signup = async (payload: SignupPayload) => {
    const response = await signupApi(payload);

    if (response.data) {
      setUser(response.data);
      return response.data;
    }

    await refreshMe();
    const me = await meApi();
    setUser(me.data ?? null);
    return me.data;
  };

  const login = async (payload: LoginPayload) => {
    const response = await loginApi(payload);

    if (response.data) {
      setUser(response.data);
      return response.data;
    }

    await refreshMe();
    const me = await meApi();
    setUser(me.data ?? null);
    return me.data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      refreshMe,
    }),
    [user, loading, refreshMe]
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