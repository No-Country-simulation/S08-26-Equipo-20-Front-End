"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/services/categories";
import type { Category, CategoryFormPayload } from "@/types/categories";
import { errorMessage } from "@/utils/error";

const INPUT_CLASS =
  "w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600";

const LABEL_CLASS = "mb-1.5 block text-xs text-gray-400";

interface CategoryFormProps {
  initial?: Category;
  isPending: boolean;
  onSubmit: (payload: CategoryFormPayload) => Promise<void>;
  onClose: () => void;
}

function CategoryForm({ initial, isPending, onSubmit, onClose }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [requiresApproval, setRequiresApproval] = useState(
    initial?.requires_approval ?? false,
  );
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
      requires_approval: requiresApproval,
    });
  }

  return (
    <Modal
      title={initial ? "Editar Categoría" : "Crear Categoría"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="category-name" className={LABEL_CLASS}>
            Nombre
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={INPUT_CLASS}
            placeholder="Nombre de la categoría"
          />
        </div>
        <div>
          <label htmlFor="category-description" className={LABEL_CLASS}>
            Descripción
          </label>
          <textarea
            id="category-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={INPUT_CLASS}
            placeholder="Descripción de la categoría"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-200">
          <input
            type="checkbox"
            checked={requiresApproval}
            onChange={(event) => setRequiresApproval(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 accent-white"
          />
          Requiere aprobación
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Guardando..." : initial ? "Guardar Cambios" : "Crear Categoría"}
        </button>
      </form>
    </Modal>
  );
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listCategories()
      .then((result) => {
        if (cancelled) return;
        setCategories(result.items);
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
      const result = await listCategories();
      setCategories(result.items);
      setError(null);
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo cargar la información"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(payload: CategoryFormPayload) {
    setIsPending(true);
    try {
      await createCategory(payload);
      setCreateOpen(false);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo crear la categoría"));
    } finally {
      setIsPending(false);
    }
  }

  async function handleUpdate(payload: CategoryFormPayload) {
    if (editing === null) {
      return;
    }
    setIsPending(true);
    try {
      await updateCategory(editing.id, payload);
      setEditing(null);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo actualizar la categoría"));
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
      await deleteCategory(deleting.id);
      setDeleting(null);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo eliminar la categoría"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <SectionHeader
        title="Categorías"
        actionLabel="Crear Categoría"
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
              <th className="px-4 py-3 text-xs text-gray-400">Aprobación</th>
              <th className="px-4 py-3 text-right text-xs text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <LoadingState />
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState message="No hay categorías" />
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-zinc-800 transition-colors hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 text-sm text-zinc-200">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-200">
                    {category.description ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={category.requires_approval ? "yes" : "no"}>
                      {category.requires_approval ? "Sí" : "No"}
                    </Badge>
                  </td>
                  <td className="flex justify-end gap-1 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditing(category)}
                      aria-label={`Editar categoría ${category.name}`}
                      className="text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(category)}
                      aria-label={`Eliminar categoría ${category.name}`}
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
        <CategoryForm
          isPending={isPending}
          onSubmit={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editing && (
        <CategoryForm
          initial={editing}
          isPending={isPending}
          onSubmit={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar Categoría"
          description={`¿Deseás eliminar la categoría "${deleting.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          isPending={isPending}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}