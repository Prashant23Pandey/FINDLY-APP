"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API = "http://127.0.0.1:5000/api";

interface User {
  id: string;
  name: string;
  email: string;
  enrollmentNo?: string;
  role: "student" | "admin";
  xp: number;
  level: number;
  branch?: string;
  year?: string;
  phone?: string;
  achievements?: string[];
  profilePic?: string;
  itemsReturned?: number;
  itemsReported?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
  isAdmin: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  enrollmentNo?: string;
  phone?: string;
  branch?: string;
  year?: string;
  adminCode?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("findly_token");
    const storedUser = localStorage.getItem("findly_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("findly_token", data.token);
      localStorage.setItem("findly_user", JSON.stringify(data.user));
      return { ok: true, message: data.message };
    } catch {
      return { ok: false, message: "Cannot connect to server. Is the backend running?" };
    }
  };

  const register = async (formData: RegisterData) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("findly_token", data.token);
      localStorage.setItem("findly_user", JSON.stringify(data.user));
      return { ok: true, message: data.message };
    } catch {
      return { ok: false, message: "Cannot connect to server. Is the backend running?" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("findly_token");
    localStorage.removeItem("findly_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
