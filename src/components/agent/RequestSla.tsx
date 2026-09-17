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

  const [responseDeadline, setResponseDeadline] = useState("");
  const [resolutionDeadline, setResolutionDeadline] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadSla();
  }, [requestId]);

  const loadSla = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestsService.getSla(requestId);
      setSla(data);
      if (data.response_deadline) {
        setResponseDeadline(new Date(data.response_deadline).toISOString().slice(0, 16));
      }
      if (data.resolution_deadline) {
        setResolutionDeadline(new Date(data.resolution_deadline).toISOString().slice(0, 16));
      }
    } catch (err: any) {
      if (err.status !== 404) {
        setError(errorMessage(err, "Error al cargar SLA"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      const data = await requestsService.upsertSla(requestId, {
        response_deadline: responseDeadline ? new Date(responseDeadline).toISOString() : null,
        resolution_deadline: resolutionDeadline ? new Date(resolutionDeadline).toISOString() : null,
      });
      setSla(data);
    } catch (err) {
      setError(errorMessage(err, "Error al actualizar SLA"));
    } finally {
      setIsUpdating(false);
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
        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
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
            <label className="block text-[10px] text-zinc-500 mb-1">Vencimiento</label>
            <input
              type="datetime-local"
              value={responseDeadline}
              onChange={(e) => setResponseDeadline(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
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
            <label className="block text-[10px] text-zinc-500 mb-1">Vencimiento</label>
            <input
              type="datetime-local"
              value={resolutionDeadline}
              onChange={(e) => setResolutionDeadline(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
          {sla?.resolved_at && (
            <div>
              <span className="block text-[10px] text-zinc-500">Resuelto en:</span>
              <span className="text-xs text-zinc-300">{new Date(sla.resolved_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-full bg-white text-black font-medium text-xs py-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-60"
        >
          Actualizar SLA
        </button>
      </div>
    </div>
  );
}
