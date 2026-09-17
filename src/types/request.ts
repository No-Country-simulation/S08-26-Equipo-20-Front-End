export type RequestStatus = "NEW" | "IN_PROGRESS" | "PENDING" | "RESOLVED" | "CLOSED";

export interface UserSummary {
  id: number;
  name: string;
  email: string;
}

export interface PriorityInfo {
  id: number | null;
  name: string;
  level: number | null;
}

export interface CategoryInfo {
  id: number;
  name: string;
  description?: string | null;
}

export interface TeamInfo {
  id: number;
  name: string;
  description?: string | null;
}

export interface CommentItem {
  id: number;
  request_id: number;
  user_id: number;
  content: string;
  is_internal: boolean;
  created_at: string;
  user: UserSummary | null;
}

export interface AttachmentItem {
  id: number;
  request_id: number;
  uploaded_by: number;
  file_name: string;
  file_path: string;
  created_at: string;
}

export interface CustomerRequestRead {
  id: number;
  description: string;
  status: RequestStatus;
  category_id: number | null;
  priority_id: number | null;
  team_id: number | null;
  created_by: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}

export interface CustomerRequestDetail extends CustomerRequestRead {
  category: CategoryInfo | null;
  priority: PriorityInfo | null;
  team: TeamInfo | null;
  creator: UserSummary;
  assignee: UserSummary | null;
  comments: CommentItem[];
  attachments: AttachmentItem[];
}
