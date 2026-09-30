"use client";

import { useEffect, useState } from "react";
import { Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { requestsService } from "@/services/requests";
import type { Sla } from "@/types/requests";
import { errorMessage } from "@/utils/error";

interface RequestSlaProps {
  requestId: number;
}

export function RequestSla({ requestId }: RequestSlaProps) {
  const [sla, setSla] = useState<Sla | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSla();
  }, [requestId]);

  const loadSla = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestsService.getSla(requestId);
      setSla(data);
    } catch (err: any) {
      if (err.status !== 404) {
        setError(errorMessage(err, "Error al cargar SLA"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (onTime: boolean | null, resolvedAt: string | null) => {
    if (onTime === null && !resolvedAt) return <span className="text-zinc-500">Pendiente</span>;
    if (onTime) {
      return (
        <span className="flex items-center gap-1 text-emerald-500">
          <CheckCircle2 className="h-3 w-3" /> A tiempo
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-red-500">
        <AlertCircle className="h-3 w-3" /> Vencido
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 flex justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-zinc-400" />
          <h2 className="text-sm font-semibold text-white">SLA (Tiempos)</h2>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Tiempos de Respuesta */}
        <div className="rounded-md bg-zinc-950 p-4 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Respuesta</span>
            {sla && getStatusDisplay(sla.response_on_time, sla.responded_at)}
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500">Vencimiento:</span>
            <span className="text-xs text-white">
              {sla?.response_deadline ? new Date(sla.response_deadline).toLocaleString() : "Sin definir"}
            </span>
          </div>
          {sla?.responded_at && (
            <div>
              <span className="block text-[10px] text-zinc-500">Respondido en:</span>
              <span className="text-xs text-zinc-300">{new Date(sla.responded_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Tiempos de Resolución */}
        <div className="rounded-md bg-zinc-950 p-4 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Resolución</span>
            {sla && getStatusDisplay(sla.resolution_on_time, sla.resolved_at)}
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500">Vencimiento:</span>
            <span className="text-xs text-white">
              {sla?.resolution_deadline ? new Date(sla.resolution_deadline).toLocaleString() : "Sin definir"}
            </span>
          </div>
          {sla?.resolved_at && (
            <div>
              <span className="block text-[10px] text-zinc-500">Resuelto en:</span>
              <span className="text-xs text-zinc-300">{new Date(sla.resolved_at).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
