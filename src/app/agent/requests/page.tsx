import { SectionHeader } from "@/components/ui/SectionHeader";
import { RequestList } from "@/components/agent/RequestList";

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestión de Solicitudes"
        description="Visualiza, categoriza y resuelve las solicitudes de los usuarios"
      />
      <RequestList />
    </div>
  );
}
