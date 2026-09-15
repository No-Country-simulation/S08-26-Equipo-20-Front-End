import type { Metadata } from "next";
import { CategoriesSection } from "@/components/admin/CategoriesSection";

export const metadata: Metadata = {
  title: "Categorías | ServiceFlow",
};

export default function AdminCategoriesPage() {
  return <CategoriesSection />;
}