import type {
  Category,
  CategoryCreatePayload,
  CategoryList,
  CategoryUpdatePayload,
} from "@/types/categories";
import { apiRequest } from "./http";

const CATEGORIES_PATH = "/categories/?offset=0&limit=100";

export async function listCategories(): Promise<CategoryList> {
  return apiRequest<CategoryList>(CATEGORIES_PATH);
}

export async function createCategory(
  payload: CategoryCreatePayload,
): Promise<Category> {
  return apiRequest<Category>("/categories", {
    method: "POST",
    body: payload,
  });
}

export async function updateCategory(
  id: number,
  payload: CategoryUpdatePayload,
): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, { method: "DELETE" });
}