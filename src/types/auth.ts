export type Role = "ADMIN" | "AGENT" | "USER";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  team: string | null;
  must_change_password: boolean;
  is_active: boolean;
}

export const ROLE_AREA: Record<Role, string> = {
  ADMIN: "/admin",
  AGENT: "/agent",
  USER: "/user",
};