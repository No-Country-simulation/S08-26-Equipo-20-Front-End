"use client";

import { useEffect, useState } from "react";
import { History as HistoryIcon, Loader2 } from "lucide-react";
import { requestsService } from "@/services/requests";
import type { History } from "@/types/requests";
import { errorMessage } from "@/utils/error";

interface RequestHistoryProps {
  requestId: number;
}

export function RequestHistory({ requestId }: RequestHistoryProps) {
  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [requestId]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestsService.listHistory(requestId);
      setHistory(data);
    } catch (err) {
      setError(errorMessage(err, "Error al cargar historial"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatAction = (item: History) => {
    const action = item.action.replace("change_", "");
    const fieldMap: Record<string, string> = {
      status: "Estado",
      category_id: "Categoría",
      priority_id: "Prioridad",
      team_id: "Equipo asignado",
      assigned_to: "Agente responsable",
    };

    const fieldName = fieldMap[action] || action;
    return `Cambió ${fieldName} a "${item.new_value || "Ninguno"}"`;
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-2">
        <HistoryIcon className="h-5 w-5 text-zinc-400" />
        <h2 className="text-sm font-semibold text-white">Historial de Cambios</h2>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No hay historial de cambios.</p>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 relative border-l border-zinc-800 ml-3 pl-4">
            {history.map((item) => (
              <div key={item.id} className="relative">
                <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-zinc-600 ring-4 ring-zinc-900" />
                <div className="text-sm">
                  <p className="text-zinc-300">
                    <span className="font-medium text-white">{item.user.name}</span>{" "}
                    {formatAction(item)}
                  </p>
                  <p className="text-[10px] text-zinc-600 tracking-wide mt-0.5">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
