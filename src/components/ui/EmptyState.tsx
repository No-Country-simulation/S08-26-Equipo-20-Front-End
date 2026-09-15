import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No hay resultados" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-sm text-zinc-500">
      <Inbox className="h-6 w-6" />
      <p>{message}</p>
    </div>
  );
}