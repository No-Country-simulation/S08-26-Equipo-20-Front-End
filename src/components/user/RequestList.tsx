"use client";

import { CustomerRequestRead } from "@/types/request";
import { StatusBadge } from "./StatusBadge";
import { Inbox, ChevronRight } from "lucide-react";

interface Props {
  requests: CustomerRequestRead[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function RequestList({ requests, selectedId, onSelect }: Props) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-zinc-500">
        <Inbox className="w-8 h-8 mb-2 stroke-[1.5] text-zinc-600" />
        <p className="text-sm font-medium text-zinc-400">No hay solicitudes registradas</p>
        <p className="text-xs text-zinc-600 mt-1">Crea una nueva solicitud desde el botón superior</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800/70 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase bg-[#0d0d10]">
            <th className="py-3 px-5">Ticket</th>
            <th className="py-3 px-5">Descripción</th>
            <th className="py-3 px-5">Estado</th>
            <th className="py-3 px-5">Fecha</th>
            <th className="py-3 px-5 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50 text-xs">
          {requests.map((req) => {
            const isSelected = req.id === selectedId;
            const dateFormatted = new Date(req.created_at).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <tr
                key={req.id}
                onClick={() => onSelect(req.id)}
                className={`group cursor-pointer transition-colors ${
                  isSelected ? "bg-zinc-800/60" : "hover:bg-zinc-900/50"
                }`}
              >
                <td className="py-3.5 px-5 font-mono text-zinc-300 font-medium">
                  #REQ-{req.id}
                </td>
                <td className="py-3.5 px-5 text-zinc-200 max-w-md truncate font-normal">
                  {req.description}
                </td>
                <td className="py-3.5 px-5">
                  <StatusBadge status={req.status} />
                </td>
                <td className="py-3.5 px-5 text-zinc-500 font-mono text-[11px]">
                  {dateFormatted}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="inline-flex items-center text-zinc-600 group-hover:text-zinc-300 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
