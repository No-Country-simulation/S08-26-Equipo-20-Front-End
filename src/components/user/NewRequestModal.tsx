"use client";

import { useState } from "react";
import { RequestService } from "@/services/request.service";
import { CustomerRequestRead } from "@/types/request";
import { X, Upload, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReq: CustomerRequestRead) => void;
}

export function NewRequestModal({ isOpen, onClose, onSuccess }: Props) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 10) {
      setError("Por favor, ingrese una descripción detallada (mínimo 10 caracteres).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await RequestService.createRequest(description);
      if (file) {
        await RequestService.uploadAttachment(created.id, file);
      }
      onSuccess(created);
      onClose();
      setDescription("");
      setFile(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-md shadow-xl relative space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-medium text-white">Nueva Solicitud</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-xs text-gray-400 mb-1.5">
              Descripción del inconveniente o requerimiento
            </label>
            <textarea
              id="description"
              rows={4}
              required
              placeholder="Describa el motivo de su solicitud con la mayor claridad posible..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
            />
          </div>

          <div>
            <label htmlFor="file-upload" className="block text-xs text-gray-400 mb-1.5">
              Archivo adjunto (opcional, máx. 10 MB)
            </label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer border border-zinc-800 text-zinc-300 px-3 py-2 rounded-md hover:bg-zinc-800/50 flex items-center gap-2 text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{file ? file.name : "Adjuntar archivo"}</span>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="border border-zinc-800 text-zinc-300 px-4 py-2 rounded-md hover:bg-zinc-800/50 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black font-medium text-sm px-4 py-2 rounded-md hover:bg-zinc-200 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Crear Solicitud</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
