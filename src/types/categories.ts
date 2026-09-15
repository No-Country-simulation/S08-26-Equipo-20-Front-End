export interface Category {
  id: number;
  name: string;
  description: string | null;
  requires_approval: boolean;
}

export interface CategoryList {
  items: Category[];
  total: number;
}

export interface CategoryCreatePayload {
  name: string;
  description?: string | null;
  requires_approval?: boolean;
}

export interface CategoryUpdatePayload {
  name?: string;
  description?: string | null;
  requires_approval?: boolean;
}

export interface CategoryFormPayload {
  name: string;
  description: string | null;
  requires_approval: boolean;
}