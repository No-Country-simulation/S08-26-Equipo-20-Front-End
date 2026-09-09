import { apiRequest, ApiError } from "./http";
import type { AuthUser, LoginCredentials, TokenResponse } from "@/types/auth";

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  try {
    return await apiRequest<TokenResponse>("/auth/login", {
      method: "POST",
      body: credentials,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new ApiError("Credenciales inválidas", error.status);
    }
    throw error;
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me");
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<TokenResponse> {
  return apiRequest<TokenResponse>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}