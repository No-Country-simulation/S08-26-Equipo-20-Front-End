"use client";

import { CustomerRequestRead } from "@/types/request";
import { StatusBadge } from "./StatusBadge";
import { Inbox } from "lucide-react";

interface Props {
  requests: CustomerRequestRead[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function RequestList({ requests, selectedId, onSelect }: Props) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
        <Inbox className="w-8 h-8 mb-2 stroke-[1.5]" />
        <p className="text-sm">No hay solicitudes registradas</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800/80 overflow-y-auto h-full max-h-full">
      {requests.map((req) => {
        const isSelected = req.id === selectedId;
        const dateStr = new Date(req.created_at).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "short",
        });

        return (
          <button
            key={req.id}
            onClick={() => onSelect(req.id)}
            className={`w-full text-left p-4 transition-colors flex flex-col gap-2 ${
              isSelected ? "bg-zinc-900 border-l-2 border-white" : "hover:bg-zinc-900/50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-zinc-400">#{req.id}</span>
              <StatusBadge status={req.status} />
            </div>
            <p className="text-sm text-zinc-200 line-clamp-2 leading-relaxed">
              {req.description}
            </p>
            <span className="text-[11px] text-zinc-500">{dateStr}</span>
          </button>
        );
      })}
    </div>
  );
}
