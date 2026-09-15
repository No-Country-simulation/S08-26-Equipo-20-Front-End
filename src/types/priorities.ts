export interface Priority {
  id: number;
  name: string;
  level: number;
}

export interface PriorityList {
  items: Priority[];
  total: number;
}

export interface PriorityCreatePayload {
  name: string;
  level: number;
}

export interface PriorityUpdatePayload {
  name?: string;
  level?: number;
}