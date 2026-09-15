import type { ReactNode } from "react";
import { ProtectedArea } from "@/components/auth/ProtectedArea";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedArea area="ADMIN">
      <AdminShell>{children}</AdminShell>
    </ProtectedArea>
  );
}