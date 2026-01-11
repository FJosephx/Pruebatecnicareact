import { apiFetch } from "./client";

export type AuthUser = {
  id: number;
  username: string;
  is_staff: boolean;
};

export const login = (payload: { username: string; password: string }) =>
  apiFetch<AuthUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const logout = () =>
  apiFetch<{ detail: string }>("/auth/logout", {
    method: "POST"
  });

export const me = () => apiFetch<AuthUser>("/auth/me");
