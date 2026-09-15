import type {
  Team,
  TeamCreatePayload,
  TeamList,
  TeamUpdatePayload,
} from "@/types/teams";
import { apiRequest } from "./http";

const TEAMS_PATH = "/teams?offset=0&limit=100";

export async function listTeams(): Promise<TeamList> {
  return apiRequest<TeamList>(TEAMS_PATH);
}

export async function createTeam(payload: TeamCreatePayload): Promise<Team> {
  return apiRequest<Team>("/teams", { method: "POST", body: payload });
}

export async function updateTeam(
  id: number,
  payload: TeamUpdatePayload,
): Promise<Team> {
  return apiRequest<Team>(`/teams/${id}`, { method: "PATCH", body: payload });
}

export async function deleteTeam(id: number): Promise<void> {
  return apiRequest<void>(`/teams/${id}`, { method: "DELETE" });
}