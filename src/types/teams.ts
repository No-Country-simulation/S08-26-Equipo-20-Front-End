export interface Team {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamList {
  items: Team[];
  total: number;
}

export interface TeamCreatePayload {
  name: string;
  description?: string | null;
}

export interface TeamUpdatePayload {
  name?: string;
  description?: string | null;
}