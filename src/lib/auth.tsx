import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { login, signup, saveTokens } from "@/api/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "pdfcourse.user";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch {
      // Ignore invalid JSON
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);

    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await login({
      email,
      password,
    });

    saveTokens(response);

    persist({
      id: response.user,
      email,
      name: email.split("@")[0],
    });
  };

  const signUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    await signup({
      email,
      password,
    });

    // Automatically log in after successful signup
    const response = await login({
      email,
      password,
    });

    saveTokens(response);

    persist({
      id: response.user,
      email,
      name,
    });
  };

  const signOut = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem(STORAGE_KEY);

    setUser(null);
  };

  const value: AuthCtx = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
