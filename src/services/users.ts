import type {
  ListUsersParams,
  SystemUser,
  UserCreatePayload,
  UserCreateResult,
  UserList,
  UserUpdatePayload,
} from "@/types/users";
import { apiRequest } from "./http";

export async function listUsers(
  params: ListUsersParams = {},
): Promise<UserList> {
  const query = new URLSearchParams();
  if (params.search) {
    query.set("search", params.search);
  }
  if (params.role) {
    query.set("role", params.role);
  }
  if (params.is_active !== undefined) {
    query.set("is_active", String(params.is_active));
  }
  query.set("offset", String(params.offset ?? 0));
  query.set("limit", String(params.limit ?? 100));
  const qs = query.toString();
  return apiRequest<UserList>(`/users${qs ? `?${qs}` : ""}`);
}

export async function createUser(
  payload: UserCreatePayload,
): Promise<UserCreateResult> {
  return apiRequest<UserCreateResult>("/users", {
    method: "POST",
    body: payload,
  });
}

export async function updateUser(
  id: number,
  payload: UserUpdatePayload,
): Promise<SystemUser> {
  return apiRequest<SystemUser>(`/users/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deactivateUser(id: number): Promise<SystemUser> {
  return apiRequest<SystemUser>(`/users/${id}`, { method: "DELETE" });
}

export async function activateUser(id: number): Promise<SystemUser> {
  return updateUser(id, { is_active: true });
}