"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Shield, Loader2 } from "lucide-react";
import { requestsService } from "@/services/requests";
import type { Comment } from "@/types/requests";
import { errorMessage } from "@/utils/error";

interface RequestCommentsProps {
  requestId: number;
}

export function RequestComments({ requestId }: RequestCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newContent, setNewContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [requestId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestsService.listComments(requestId);
      setComments(data);
    } catch (err) {
      setError(errorMessage(err, "Error al cargar comentarios"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await requestsService.addComment(requestId, {
        content: newContent.trim(),
        is_internal: isInternal,
      });
      setNewContent("");
      setIsInternal(false);
      await loadComments();
    } catch (err) {
      setError(errorMessage(err, "Error al enviar comentario"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-zinc-400" />
        <h2 className="text-sm font-semibold text-white">Comentarios y Notas</h2>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500" role="alert">
          {error}
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No hay comentarios todavía.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`rounded-md p-4 text-sm ${
                  comment.is_internal
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "bg-zinc-950 border border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-200">{comment.user.name}</span>
                    {comment.is_internal && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-500">
                        <Shield className="h-3 w-3" />
                        Nota Interna
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-600 tracking-wide">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-zinc-300">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border-t border-zinc-800 pt-4">
        <div>
          <label htmlFor="new_comment" className="sr-only">Escribir un comentario</label>
          <textarea
            id="new_comment"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            disabled={isSubmitting}
            placeholder="Escribe un comentario o nota interna..."
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-colors min-h-[100px] resize-y"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-zinc-800 bg-zinc-950 text-white focus:ring-zinc-600 focus:ring-offset-zinc-900"
            />
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Solo visible para agentes (Nota Interna)
            </span>
          </label>
          
          <button
            type="submit"
            disabled={!newContent.trim() || isSubmitting}
            className="bg-white text-black font-medium text-sm py-2 px-4 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando
              </>
            ) : (
              "Agregar Comentario"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
