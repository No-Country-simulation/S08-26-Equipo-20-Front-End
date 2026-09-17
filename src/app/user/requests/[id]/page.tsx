"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Paperclip,
  Send,
  Loader2,
  Calendar,
  Clock,
} from "lucide-react";
import { CustomerRequestDetail } from "@/types/request";
import { RequestService } from "@/services/request.service";
import { StatusBadge } from "@/components/user/StatusBadge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function formatDate(dateString?: string | null): string {
  if (!dateString) return "--";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "--";

    return d.toLocaleString("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "--";
  }
}

function resolveFileUrl(filePath: string): string {
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const requestId = parseInt(resolvedParams.id, 10);
  const router = useRouter();

  const [detail, setDetail] = useState<CustomerRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(requestId)) return;

    let isSubscribed = true;

    RequestService.getRequestDetail(requestId)
      .then((data) => {
        if (isSubscribed) {
          setDetail(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : "Error al cargar la solicitud");
        }
      })
      .finally(() => {
        if (isSubscribed) {
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [requestId]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const newComment = await RequestService.addComment(requestId, commentText.trim());
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), newComment],
            }
          : prev
      );
      setCommentText("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "No se pudo publicar el comentario");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center text-zinc-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-xs font-mono">Cargando detalles del ticket...</span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] text-zinc-300 flex flex-col items-center justify-center gap-4">
        <p className="text-sm font-mono text-red-400">{error || "Solicitud no encontrada"}</p>
        <button
          onClick={() => router.push("/user")}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-2 border border-zinc-800 px-3 py-1.5 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al portal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-zinc-100 font-sans antialiased p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cabecera y Navegación */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/user")}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-2 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a mis solicitudes
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">#REQ-{detail.id}</span>
            <StatusBadge status={detail.status} />
          </div>
        </div>

        {/* Detalle Principal */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-lg p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-white tracking-tight">
              {detail.description}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Creado: {formatDate(detail.created_at)}
              </span>
              {detail.updated_at && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Actualizado: {formatDate(detail.updated_at)}
                </span>
              )}
            </div>
          </div>

          {/* Adjuntos del ticket */}
          {detail.attachments && detail.attachments.length > 0 && (
            <div className="pt-4 border-t border-zinc-800/60">
              <p className="text-[11px] font-mono uppercase text-zinc-400 mb-2">
                Archivos Adjuntos ({detail.attachments.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {detail.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={resolveFileUrl(att.file_path)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-md text-xs text-zinc-300 hover:text-white transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="truncate max-w-50">{att.file_name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sección de Comentarios */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-lg p-6 space-y-6">
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Actividad y Respuestas
          </h2>

          <div className="space-y-4">
            {!detail.comments || detail.comments.length === 0 ? (
              <p className="text-xs text-zinc-500 font-mono text-center py-6">
                No hay respuestas registradas aún en esta solicitud.
              </p>
            ) : (
              detail.comments
                .filter((c) => !c.is_internal)
                .map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-lg bg-[#0a0a0b] border border-zinc-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-200">
                          {comment.user?.name || "Usuario / Soporte"}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                          {comment.user?.email || "NOTIFICACIÓN"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
            )}
          </div>

          {/* Caja de Respuesta */}
          <form onSubmit={handleSendComment} className="space-y-3 pt-4 border-t border-zinc-800/60">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe una respuesta o consulta adicional..."
              className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-md p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="bg-white text-black font-medium text-xs py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {submittingComment ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Enviar Respuesta</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
