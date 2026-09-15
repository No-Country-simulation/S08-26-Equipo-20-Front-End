import type { Role } from "./auth";

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: string;
  team: string | null;
  role_id: number;
  team_id: number | null;
  must_change_password: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserList {
  items: SystemUser[];
  total: number;
}

export interface ListUsersParams {
  search?: string;
  role?: Role;
  is_active?: boolean;
  offset?: number;
  limit?: number;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  role_id: number;
  team_id?: number | null;
  password?: string;
}

export interface UserUpdatePayload {
  name?: string;
  role_id?: number;
  team_id?: number | null;
  is_active?: boolean;
}

export interface UserCreateResult {
  user: SystemUser;
  temporary_password?: string | null;
}

export interface UserFormPayload {
  name: string;
  email: string;
  role_id: number;
  team_id: number | null;
  password?: string;
  is_active?: boolean;
}