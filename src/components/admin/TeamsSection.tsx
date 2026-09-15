"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  createTeam,
  deleteTeam,
  listTeams,
  updateTeam,
} from "@/services/teams";
import type { Team, TeamFormPayload } from "@/types/teams";
import { errorMessage } from "@/utils/error";

const INPUT_CLASS =
  "w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600";

const LABEL_CLASS = "mb-1.5 block text-xs text-gray-400";

interface TeamFormProps {
  initial?: Team;
  isPending: boolean;
  onSubmit: (payload: TeamFormPayload) => Promise<void>;
  onClose: () => void;
}

function TeamForm({ initial, isPending, onSubmit, onClose }: TeamFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) {
      return "Ingresá un nombre";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) {
      return;
    }
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    await onSubmit({
      name: name.trim(),
      description: description.trim() || null,
    });
  }

  return (
    <Modal title={initial ? "Editar Equipo" : "Crear Equipo"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="team-name" className={LABEL_CLASS}>
            Nombre
          </label>
          <input
            id="team-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={INPUT_CLASS}
            placeholder="Nombre del equipo"
          />
        </div>
        <div>
          <label htmlFor="team-description" className={LABEL_CLASS}>
            Descripción
          </label>
          <textarea
            id="team-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={INPUT_CLASS}
            placeholder="Descripción del equipo"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Guardando..." : initial ? "Guardar Cambios" : "Crear Equipo"}
        </button>
      </form>
    </Modal>
  );
}

export function TeamsSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [deleting, setDeleting] = useState<Team | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listTeams()
      .then((result) => {
        if (cancelled) return;
        setTeams(result.items);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(errorMessage(cause, "No se pudo cargar la información"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function reload() {
    setLoading(true);
    try {
      const result = await listTeams();
      setTeams(result.items);
      setError(null);
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo cargar la información"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(payload: TeamFormPayload) {
    setIsPending(true);
    try {
      await createTeam(payload);
      setCreateOpen(false);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo crear el equipo"));
    } finally {
      setIsPending(false);
    }
  }

  async function handleUpdate(payload: TeamFormPayload) {
    if (editing === null) {
      return;
    }
    setIsPending(true);
    try {
      await updateTeam(editing.id, payload);
      setEditing(null);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo actualizar el equipo"));
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (deleting === null) {
      return;
    }
    setIsPending(true);
    try {
      await deleteTeam(deleting.id);
      setDeleting(null);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo eliminar el equipo"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <SectionHeader
        title="Equipos"
        actionLabel="Crear Equipo"
        onAction={() => setCreateOpen(true)}
      />
      {error && (
        <p role="alert" className="mb-6 text-xs text-red-500">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-xs text-gray-400">Nombre</th>
              <th className="px-4 py-3 text-xs text-gray-400">Descripción</th>
              <th className="px-4 py-3 text-right text-xs text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3}>
                  <LoadingState />
                </td>
              </tr>
            ) : teams.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <EmptyState message="No hay equipos" />
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr
                  key={team.id}
                  className="border-b border-zinc-800 transition-colors hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 text-sm text-zinc-200">{team.name}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">
                    {team.description ?? "—"}
                  </td>
                  <td className="flex justify-end gap-1 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditing(team)}
                      aria-label={`Editar equipo ${team.name}`}
                      className="text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(team)}
                      aria-label={`Eliminar equipo ${team.name}`}
                      className="text-zinc-500 transition-colors hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {createOpen && (
        <TeamForm
          isPending={isPending}
          onSubmit={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editing && (
        <TeamForm
          initial={editing}
          isPending={isPending}
          onSubmit={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar Equipo"
          description={`¿Deseás eliminar el equipo "${deleting.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          isPending={isPending}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}