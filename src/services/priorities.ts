import type {
  Priority,
  PriorityCreatePayload,
  PriorityList,
  PriorityUpdatePayload,
} from "@/types/priorities";
import { apiRequest } from "./http";

const PRIORITIES_PATH = "/priorities/?offset=0&limit=100";

export async function listPriorities(): Promise<PriorityList> {
  return apiRequest<PriorityList>(PRIORITIES_PATH);
}

export async function createPriority(
  payload: PriorityCreatePayload,
): Promise<Priority> {
  return apiRequest<Priority>("/priorities", {
    method: "POST",
    body: payload,
  });
}

export async function updatePriority(
  id: number,
  payload: PriorityUpdatePayload,
): Promise<Priority> {
  return apiRequest<Priority>(`/priorities/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deletePriority(id: number): Promise<void> {
  return apiRequest<void>(`/priorities/${id}`, { method: "DELETE" });
}