import type { Metadata } from "next";
import { ProtectedArea } from "@/components/auth/ProtectedArea";

export const metadata: Metadata = {
  title: "Área de Administración | ServiceFlow",
};

export default function AdminAreaPage() {
  return (
    <ProtectedArea area="ADMIN">
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-200">
          Área de Administración — en construcción
        </p>
      </main>
    </ProtectedArea>
  );
}