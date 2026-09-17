export type RequestStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "PENDING"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UserBrief {
  id: number;
  name: string;
  email: string;
}

export interface CategoryBrief {
  id: number;
  name: string;
  requires_approval: boolean;
}

export interface PriorityBrief {
  id: number;
  name: string;
  level: number;
}

export interface TeamBrief {
  id: number;
  name: string;
}

export interface Request {
  id: number;
  description: string;
  status: RequestStatus;
  category: CategoryBrief | null;
  priority: PriorityBrief | null;
  team: TeamBrief | null;
  creator: UserBrief;
  assignee: UserBrief | null;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestListOut {
  id: number;
  description: string;
  status: RequestStatus;
  category: CategoryBrief | null;
  priority: PriorityBrief | null;
  assignee: UserBrief | null;
  created_at: string;
}

export interface RequestCreate {
  description: string;
}

export interface RequestUpdate {
  category_id?: number | null;
  priority_id?: number | null;
  team_id?: number | null;
  assigned_to?: number | null;
}

export interface StatusUpdate {
  status: RequestStatus;
}

export interface Comment {
  id: number;
  content: string;
  is_internal: boolean;
  user: UserBrief;
  created_at: string;
}

export interface CommentCreate {
  content: string;
  is_internal?: boolean;
}

export interface History {
  id: number;
  action: string;
  old_value: string | null;
  new_value: string | null;
  user: UserBrief;
  created_at: string;
}

export interface Sla {
  id: number;
  response_deadline: string | null;
  resolution_deadline: string | null;
  responded_at: string | null;
  resolved_at: string | null;
  response_on_time: boolean | null;
  resolution_on_time: boolean | null;
  created_at: string;
}

export interface SlaCreate {
  response_deadline?: string | null;
  resolution_deadline?: string | null;
}

export interface Approval {
  id: number;
  status: ApprovalStatus;
  comment: string | null;
  approver: UserBrief;
  created_at: string;
  decided_at: string | null;
}

export interface ApprovalDecision {
  status: ApprovalStatus;
  comment?: string | null;
}
