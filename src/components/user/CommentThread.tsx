"use client";

import { useState } from "react";
import { CommentItem } from "@/types/request";
import { RequestService } from "@/services/request.service";
import { Send, Loader2 } from "lucide-react";

interface Props {
  requestId: number;
  comments: CommentItem[];
  onCommentAdded: (comment: CommentItem) => void;
}

export function CommentThread({ requestId, comments, onCommentAdded }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const newComment = await RequestService.addComment(requestId, content);
      onCommentAdded(newComment);
      setContent("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-zinc-800">
        {comments.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">
            No hay mensajes registrados en esta solicitud.
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-zinc-950 border border-zinc-800/80 rounded-md p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-300">{c.user?.name ?? "Usuario"}</span>
                <span className="text-[11px] text-zinc-500">
                  {new Date(c.created_at).toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <p className="text-sm text-zinc-200 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-zinc-900/40 space-y-2">
        {error && (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <input
            id="comment-input"
            type="text"
            placeholder="Escriba su respuesta o consulta..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            aria-label="Enviar comentario"
            className="bg-white text-black font-medium text-sm px-4 py-2 rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Responder</span>
          </button>
        </div>
      </form>
    </div>
  );
}
