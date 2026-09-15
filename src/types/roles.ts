import type { Role } from "./auth";

export const ROLE_IDS: Record<Role, number> = {
  ADMIN: 1,
  AGENT: 2,
  USER: 3,
};