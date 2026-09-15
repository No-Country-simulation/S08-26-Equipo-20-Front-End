import type { Metadata } from "next";
import { PrioritiesSection } from "@/components/admin/PrioritiesSection";

export const metadata: Metadata = {
  title: "Prioridades | ServiceFlow",
};

export default function AdminPrioritiesPage() {
  return <PrioritiesSection />;
}