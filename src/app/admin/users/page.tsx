import type { Metadata } from "next";
import { UsersSection } from "@/components/admin/UsersSection";

export const metadata: Metadata = {
  title: "Usuarios | ServiceFlow",
};

export default function AdminUsersPage() {
  return <UsersSection />;
}