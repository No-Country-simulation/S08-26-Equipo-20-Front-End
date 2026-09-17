"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requestsService } from "@/services/requests";
import type { RequestListOut } from "@/types/requests";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { errorMessage } from "@/utils/error";

export function RequestList() {
  const [requests, setRequests] = useState<RequestListOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestsService.list();
      setRequests(data);
    } catch (err) {
      setError(errorMessage(err, "Error al cargar solicitudes"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Cargando solicitudes..." />;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500" role="alert">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return <EmptyState message="No hay solicitudes para mostrar" />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
      <table className="w-full text-left text-sm text-zinc-200">
        <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs text-gray-400">
          <tr>
            <th className="px-6 py-4 font-medium">ID</th>
            <th className="px-6 py-4 font-medium">Descripción</th>
            <th className="px-6 py-4 font-medium">Estado</th>
            <th className="px-6 py-4 font-medium">Prioridad</th>
            <th className="px-6 py-4 font-medium">Categoría</th>
            <th className="px-6 py-4 font-medium">Asignado</th>
            <th className="px-6 py-4 font-medium text-right">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {requests.map((request) => (
            <tr
              key={request.id}
              className="group transition-colors hover:bg-zinc-800/50"
            >
              <td className="px-6 py-4">
                <Link
                  href={`/agent/requests/${request.id}`}
                  className="font-mono text-blue-400 hover:underline"
                >
                  #{request.id}
                </Link>
              </td>
              <td className="px-6 py-4">
                <p className="line-clamp-1 max-w-[200px]" title={request.description}>
                  {request.description}
                </p>
              </td>
              <td className="px-6 py-4">
                <Badge status={request.status as any} />
              </td>
              <td className="px-6 py-4">
                {request.priority?.name || <span className="text-zinc-600">-</span>}
              </td>
              <td className="px-6 py-4">
                {request.category?.name || <span className="text-zinc-600">-</span>}
              </td>
              <td className="px-6 py-4">
                {request.assignee?.name || <span className="text-zinc-600">Sin asignar</span>}
              </td>
              <td className="px-6 py-4 text-right text-xs text-zinc-500">
                {new Date(request.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
