"use client";

import { useEffect, useState } from "react";
import type { Request, RequestStatus } from "@/types/requests";
import { requestsService } from "@/services/requests";
import { listCategories } from "@/services/categories";
import { listPriorities } from "@/services/priorities";
import { listTeams } from "@/services/teams";
import { listUsers } from "@/services/users";
import { errorMessage } from "@/utils/error";

// Iconos (opcional)
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface RequestPropertiesProps {
  request: Request;
  onUpdate: () => void;
}

export function RequestProperties({ request, onUpdate }: RequestPropertiesProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Opciones
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [priorities, setPriorities] = useState<{ id: number; name: string }[]>([]);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [agents, setAgents] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [cats, prios, tms, ags] = await Promise.all([
        listCategories(),
        listPriorities(),
        listTeams(),
        listUsers({ role: "AGENT", is_active: true }), // Solo agentes activos
      ]);
      setCategories(cats.items);
      setPriorities(prios.items);
      setTeams(tms.items);
      setAgents(ags.items);
    } catch (err) {
      console.error("Error loading options", err);
    }
  };

  const handleUpdate = async (field: string, value: string | number | null) => {
    try {
      setIsUpdating(true);
      setError(null);
      if (field === "status") {
        await requestsService.changeStatus(request.id, { status: value as RequestStatus });
      } else {
        await requestsService.classify(request.id, { [field]: value });
      }
      onUpdate();
    } catch (err) {
      setError(errorMessage(err, "Error al actualizar propiedades"));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Propiedades</h2>
        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Estado */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Estado</label>
          <div className="flex items-center gap-3">
            <Badge status={request.status as any} />
            <select
              disabled={isUpdating}
              value=""
              onChange={(e) => handleUpdate("status", e.target.value)}
              className="bg-transparent text-sm text-zinc-400 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>Cambiar estado...</option>
              <option value="NEW">Nuevo</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="PENDING">Pendiente</option>
              <option value="RESOLVED">Resuelto</option>
              <option value="CLOSED">Cerrado</option>
            </select>
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category_id" className="block text-xs text-gray-400 mb-1.5">Categoría</label>
          <select
            id="category_id"
            value={request.category?.id || ""}
            disabled={isUpdating}
            onChange={(e) => handleUpdate("category_id", e.target.value ? parseInt(e.target.value) : null)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-colors"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label htmlFor="priority_id" className="block text-xs text-gray-400 mb-1.5">Prioridad</label>
          <select
            id="priority_id"
            value={request.priority?.id || ""}
            disabled={isUpdating}
            onChange={(e) => handleUpdate("priority_id", e.target.value ? parseInt(e.target.value) : null)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-colors"
          >
            <option value="">Sin prioridad</option>
            {priorities.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Equipo */}
        <div>
          <label htmlFor="team_id" className="block text-xs text-gray-400 mb-1.5">Equipo Asignado</label>
          <select
            id="team_id"
            value={request.team?.id || ""}
            disabled={isUpdating}
            onChange={(e) => handleUpdate("team_id", e.target.value ? parseInt(e.target.value) : null)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-colors"
          >
            <option value="">Sin equipo</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Responsable */}
        <div>
          <label htmlFor="assigned_to" className="block text-xs text-gray-400 mb-1.5">Agente Responsable</label>
          <select
            id="assigned_to"
            value={request.assignee?.id || ""}
            disabled={isUpdating}
            onChange={(e) => handleUpdate("assigned_to", e.target.value ? parseInt(e.target.value) : null)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-colors"
          >
            <option value="">Sin asignar</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
