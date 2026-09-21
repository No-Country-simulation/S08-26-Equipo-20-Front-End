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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#0e0e11] border border-zinc-800/90 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Nueva Solicitud</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Detalla tu problema para que un agente lo tome</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-950/40 border border-red-900/50 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-xs font-medium text-zinc-400 mb-1.5">
              Descripción del requerimiento
            </label>
            <textarea
              id="description"
              rows={4}
              required
              placeholder="Explica qué necesitas o qué falla encontraste..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#08080a] border border-zinc-800 text-white rounded-xl px-3.5 py-2.5 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Adjunto (opcional)
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer border border-zinc-800 hover:border-zinc-700 bg-[#08080a] text-zinc-300 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                <span>{file ? file.name : "Seleccionar archivo"}</span>
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
                  className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-2.5 pt-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-300 px-4 py-2 rounded-xl text-xs font-medium hover:bg-zinc-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs px-4 py-2 rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Crear Solicitud</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
