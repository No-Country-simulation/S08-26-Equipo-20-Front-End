import type { Metadata } from "next";
import { ProtectedArea } from "@/components/auth/ProtectedArea";
import { AgentShell } from "@/components/agent/AgentShell";

export const metadata: Metadata = {
  title: "Área de Agente | ServiceFlow",
};

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedArea area="AGENT">
      <AgentShell>{children}</AgentShell>
    </ProtectedArea>
  );
}
