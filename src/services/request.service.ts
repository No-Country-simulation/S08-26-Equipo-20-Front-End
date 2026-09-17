import { apiRequest } from "./http";
import {
  CustomerRequestRead,
  CustomerRequestDetail,
  CommentItem,
  AttachmentItem,
} from "@/types/request";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const RequestService = {
  // Coincide exactamente con: GET /customer/requests
  getMyRequests(offset = 0, limit = 20): Promise<CustomerRequestRead[]> {
    return apiRequest<CustomerRequestRead[]>(
      `/customer/requests?offset=${offset}&limit=${limit}`
    );
  },

  // Coincide con: GET /customer/requests/{request_id}
  getRequestDetail(id: number): Promise<CustomerRequestDetail> {
    return apiRequest<CustomerRequestDetail>(`/customer/requests/${id}`);
  },

  // Coincide con: POST /customer/requests
  createRequest(description: string): Promise<CustomerRequestRead> {
    return apiRequest<CustomerRequestRead>("/customer/requests", {
      method: "POST",
      body: { description },
    });
  },

  // Coincide con: POST /customer/requests/{request_id}/comments
  addComment(requestId: number, content: string): Promise<CommentItem> {
    return apiRequest<CommentItem>(`/customer/requests/${requestId}/comments`, {
      method: "POST",
      body: { content },
    });
  },

  // Coincide con: POST /customer/requests/{request_id}/attachments
  async uploadAttachment(requestId: number, file: File): Promise<AttachmentItem> {
    const { getAccessToken } = await import("./session");
    const token = getAccessToken();

    const formData = new FormData();
    formData.append("file", file);

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/customer/requests/${requestId}/attachments`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "No se pudo subir el archivo adjunto");
    }

    return res.json();
  },
};
