import type { Metadata } from "next";
import { ProtectedArea } from "@/components/auth/ProtectedArea";

export const metadata: Metadata = {
  title: "Área de Usuario | ServiceFlow",
};

export default function UserAreaPage() {
  return (
    <ProtectedArea area="USER">
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-200">Área de Usuario — en construcción</p>
      </main>
    </ProtectedArea>
  );
}