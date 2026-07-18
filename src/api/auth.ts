import { apiFetch } from "./client";

export interface SignupData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: string;
}

export async function signup(data: SignupData) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(
  data: LoginData
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function saveTokens(response: LoginResponse) {
  localStorage.setItem("access_token", response.access_token);
  localStorage.setItem("refresh_token", response.refresh_token);
  localStorage.setItem("user_id", response.user);
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
}

export function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}