"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requestsService } from "@/services/requests";
import type { Request } from "@/types/requests";
import { LoadingState } from "@/components/ui/LoadingState";
import { errorMessage } from "@/utils/error";

// Sub-components
import { RequestProperties } from "./RequestProperties";
import { RequestComments } from "./RequestComments";
import { RequestHistory } from "./RequestHistory";
import { RequestSla } from "./RequestSla";
import { RequestApprovals } from "./RequestApprovals";

interface RequestDetailProps {
  id: number;
}

export function RequestDetail({ id }: RequestDetailProps) {
  const router = useRouter();
  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestsService.get(id);
      setRequest(data);
    } catch (err) {
      setError(errorMessage(err, "Error al cargar detalles"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = () => {
    loadRequest(); // Recargar datos al actualizar propiedades/estado
  };

  if (isLoading) {
    return <LoadingState message="Cargando detalles de la solicitud..." />;
  }

  if (error || !request) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500" role="alert">
          {error || "Solicitud no encontrada"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/agent/requests")}
          className="rounded-full p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
          aria-label="Volver a solicitudes"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Solicitud #{request.id}
          </h1>
          <p className="text-sm text-zinc-400">
            Creada por {request.creator.name} el {new Date(request.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (Main content) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description Card */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
            <h2 className="mb-4 text-sm font-semibold text-white">Descripción</h2>
            <div className="whitespace-pre-wrap text-sm text-zinc-300">
              {request.description}
            </div>
          </div>

          <RequestComments requestId={request.id} />
          <RequestHistory requestId={request.id} />
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          <RequestProperties request={request} onUpdate={handleUpdate} />
          <RequestSla requestId={request.id} />
          {request.category?.requires_approval && (
            <RequestApprovals requestId={request.id} />
          )}
        </div>
      </div>
    </div>
  );
}
