import type { Metadata } from "next";
import { TeamsSection } from "@/components/admin/TeamsSection";

export const metadata: Metadata = {
  title: "Equipos | ServiceFlow",
};

export default function AdminTeamsPage() {
  return <TeamsSection />;
}