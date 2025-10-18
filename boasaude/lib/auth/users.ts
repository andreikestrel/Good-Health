"use client";

import type { UserRole } from "./AuthContext";

export type AuthUserRecord = { name: string; email: string; password: string; role: UserRole };

export const USERS_KEY = "boasaude.auth.users";

export const BUILTIN_USERS: AuthUserRecord[] = [
  { name: "Paciente", email: "paciente@email.com", password: "paciente123", role: "paciente" },
  { name: "Profissional", email: "profissional@email.com", password: "profissional123", role: "profissional" },
  { name: "Administrador", email: "admin@email.com", password: "admin123", role: "admin" },
];

export function listCustomUsers(): AuthUserRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function listAllUsers(): AuthUserRecord[] {
  const custom = listCustomUsers();
  // avoid duplicates by email
  const extras = custom.filter((u) => !BUILTIN_USERS.some((b) => b.email === u.email));
  return [...BUILTIN_USERS, ...extras];
}

export function addCustomUser(user: AuthUserRecord) {
  const custom = listCustomUsers();
  if (custom.some((u) => u.email === user.email) || BUILTIN_USERS.some((u) => u.email === user.email)) {
    throw new Error("Email já cadastrado");
  }
  const next = [...custom, user];
  if (typeof window !== "undefined") window.localStorage.setItem(USERS_KEY, JSON.stringify(next));
}

export function deleteCustomUser(email: string) {
  const custom = listCustomUsers().filter((u) => u.email !== email);
  if (typeof window !== "undefined") window.localStorage.setItem(USERS_KEY, JSON.stringify(custom));
}

export function resetCustomUsers() {
  if (typeof window !== "undefined") window.localStorage.removeItem(USERS_KEY);
}


