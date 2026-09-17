import { RequestStatus } from "@/types/request";

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  NEW: { label: "Nueva", className: "bg-blue-500/20 text-blue-400" },
  IN_PROGRESS: { label: "En Proceso", className: "bg-amber-500/20 text-amber-400" },
  PENDING: { label: "Pendiente", className: "bg-amber-500/10 text-amber-300" },
  RESOLVED: { label: "Resuelta", className: "bg-emerald-500/20 text-emerald-400" },
  CLOSED: { label: "Cerrada", className: "bg-zinc-800 text-zinc-400" },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status] ?? { label: status, className: "bg-zinc-800 text-zinc-300" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
