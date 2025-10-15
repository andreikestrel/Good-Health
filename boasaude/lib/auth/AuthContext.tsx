"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "paciente" | "profissional" | "admin";

export type AuthUser = {
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>; 
  logout: () => void;
  register: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<{ ok: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "boasaude.auth.user";
const USERS_KEY = "boasaude.auth.users";

const BUILTIN_USERS: Array<{ name: string; email: string; password: string; role: UserRole }> = [
  { name: "Paciente", email: "paciente@email.com", password: "paciente123", role: "paciente" },
  { name: "Profissional", email: "profissional@email.com", password: "profissional123", role: "profissional" },
  { name: "Administrador", email: "admin@email.com", password: "admin123", role: "admin" },
];

function loadUsersFromStorage(): Array<{ name: string; email: string; password: string; role: UserRole }> {
  if (typeof window === "undefined") return BUILTIN_USERS;
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(BUILTIN_USERS));
      return BUILTIN_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return BUILTIN_USERS;
    return [...BUILTIN_USERS, ...parsed.filter((u) => !BUILTIN_USERS.some((b) => b.email === u.email))];
  } catch {
    return BUILTIN_USERS;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((nextUser: AuthUser | null) => {
    if (typeof window === "undefined") return;
    if (nextUser) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = loadUsersFromStorage();
    const match = users.find((u) => u.email === email && u.password === password);
    if (!match) return { ok: false, message: "Credenciais inválidas" };
    const next = { name: match.name, email: match.email, role: match.role } as AuthUser;
    setUser(next);
    persist(next);
    return { ok: true };
  }, [persist]);

  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, [persist]);

  const register = useCallback(async (data: { name: string; email: string; password: string; role: UserRole }) => {
    if (typeof window === "undefined") return { ok: false, message: "Somente no cliente" };
    const users = loadUsersFromStorage();
    if (users.some((u) => u.email === data.email)) return { ok: false, message: "Email já cadastrado" };
    const customUsersRaw = window.localStorage.getItem(USERS_KEY);
    const customUsers = customUsersRaw ? JSON.parse(customUsersRaw) : [];
    const nextUsers = [...customUsers, data];
    window.localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    return { ok: true };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  }), [user, login, logout, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <>{children}</>;
}


