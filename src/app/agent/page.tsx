import type { Metadata } from "next";
import { ProtectedArea } from "@/components/auth/ProtectedArea";

export const metadata: Metadata = {
  title: "Área de Agente | ServiceFlow",
};

export default function AgentAreaPage() {
  return (
    <ProtectedArea area="AGENT">
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-200">Área de Agente — en construcción</p>
      </main>
    </ProtectedArea>
  );
}