"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  createPriority,
  deletePriority,
  listPriorities,
  updatePriority,
} from "@/services/priorities";
import type { Priority, PriorityFormPayload } from "@/types/priorities";
import { errorMessage } from "@/utils/error";

const INPUT_CLASS =
  "w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600";

const LABEL_CLASS = "mb-1.5 block text-xs text-gray-400";

interface PriorityFormProps {
  initial?: Priority;
  isPending: boolean;
  onSubmit: (payload: PriorityFormPayload) => Promise<void>;
  onClose: () => void;
}

function PriorityForm({ initial, isPending, onSubmit, onClose }: PriorityFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [level, setLevel] = useState(initial ? String(initial.level) : "");
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) {
      return "Ingresá un nombre";
    }
    if (!level.trim()) {
      return "Ingresá un nivel";
    }
    const levelNumber = Number(level);
    if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 10) {
      return "El nivel debe ser un número entre 1 y 10";
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
    await onSubmit({ name: name.trim(), level: Number(level) });
  }

  return (
    <Modal
      title={initial ? "Editar Prioridad" : "Crear Prioridad"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="priority-name" className={LABEL_CLASS}>
            Nombre
          </label>
          <input
            id="priority-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={INPUT_CLASS}
            placeholder="Nombre de la prioridad"
          />
        </div>
        <div>
          <label htmlFor="priority-level" className={LABEL_CLASS}>
            Nivel
          </label>
          <input
            id="priority-level"
            type="number"
            min={1}
            max={10}
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className={INPUT_CLASS}
            placeholder="1 a 10"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Guardando..." : initial ? "Guardar Cambios" : "Crear Prioridad"}
        </button>
      </form>
    </Modal>
  );
}

export function PrioritiesSection() {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Priority | null>(null);
  const [deleting, setDeleting] = useState<Priority | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listPriorities()
      .then((result) => {
        if (cancelled) return;
        setPriorities(result.items);
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
      const result = await listPriorities();
      setPriorities(result.items);
      setError(null);
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo cargar la información"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(payload: PriorityFormPayload) {
    setIsPending(true);
    try {
      await createPriority(payload);
      setCreateOpen(false);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo crear la prioridad"));
    } finally {
      setIsPending(false);
    }
  }

  async function handleUpdate(payload: PriorityFormPayload) {
    if (editing === null) {
      return;
    }
    setIsPending(true);
    try {
      await updatePriority(editing.id, payload);
      setEditing(null);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo actualizar la prioridad"));
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
      await deletePriority(deleting.id);
      setDeleting(null);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo eliminar la prioridad"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <SectionHeader
        title="Prioridades"
        actionLabel="Crear Prioridad"
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
              <th className="px-4 py-3 text-xs text-gray-400">Nivel</th>
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
            ) : priorities.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <EmptyState message="No hay prioridades" />
                </td>
              </tr>
            ) : (
              priorities.map((priority) => (
                <tr
                  key={priority.id}
                  className="border-b border-zinc-800 transition-colors hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 font-mono text-sm text-zinc-200">
                    {priority.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-200">
                    {priority.level}
                  </td>
                  <td className="flex justify-end gap-1 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditing(priority)}
                      aria-label={`Editar prioridad ${priority.name}`}
                      className="text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(priority)}
                      aria-label={`Eliminar prioridad ${priority.name}`}
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
        <PriorityForm
          isPending={isPending}
          onSubmit={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editing && (
        <PriorityForm
          initial={editing}
          isPending={isPending}
          onSubmit={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar Prioridad"
          description={`¿Deseás eliminar la prioridad "${deleting.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          isPending={isPending}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}