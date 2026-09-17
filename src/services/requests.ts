import { apiRequest } from "./http";
import type {
  Request,
  RequestCreate,
  RequestListOut,
  RequestUpdate,
  StatusUpdate,
  Comment,
  CommentCreate,
  History,
  Sla,
  SlaCreate,
  Approval,
  ApprovalDecision,
} from "@/types/requests";

export const requestsService = {
  // --- Requests CRUD ---
  async create(payload: RequestCreate): Promise<Request> {
    return apiRequest<Request>("/requests/", { method: "POST", body: payload });
  },

  async list(): Promise<RequestListOut[]> {
    return apiRequest<RequestListOut[]>("/requests/");
  },

  async get(id: number): Promise<Request> {
    return apiRequest<Request>(`/requests/${id}`);
  },

  async classify(id: number, payload: RequestUpdate): Promise<Request> {
    return apiRequest<Request>(`/requests/${id}`, { method: "PATCH", body: payload });
  },

  async changeStatus(id: number, payload: StatusUpdate): Promise<Request> {
    return apiRequest<Request>(`/requests/${id}/status`, { method: "PATCH", body: payload });
  },

  // --- Comments ---
  async addComment(id: number, payload: CommentCreate): Promise<Comment> {
    return apiRequest<Comment>(`/requests/${id}/comments`, { method: "POST", body: payload });
  },

  async listComments(id: number): Promise<Comment[]> {
    return apiRequest<Comment[]>(`/requests/${id}/comments`);
  },

  // --- History ---
  async listHistory(id: number): Promise<History[]> {
    return apiRequest<History[]>(`/requests/${id}/history`);
  },

  // --- SLA ---
  async getSla(id: number): Promise<Sla> {
    return apiRequest<Sla>(`/requests/${id}/sla`);
  },

  async upsertSla(id: number, payload: SlaCreate): Promise<Sla> {
    return apiRequest<Sla>(`/requests/${id}/sla`, { method: "PUT", body: payload });
  },

  // --- Approvals ---
  async listApprovals(id: number): Promise<Approval[]> {
    return apiRequest<Approval[]>(`/requests/${id}/approvals`);
  },

  async decideApproval(
    requestId: number,
    approvalId: number,
    payload: ApprovalDecision
  ): Promise<Approval> {
    return apiRequest<Approval>(
      `/requests/${requestId}/approvals/${approvalId}`,
      { method: "PATCH", body: payload }
    );
  },
};
