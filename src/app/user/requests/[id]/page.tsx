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
  X,
  ExternalLink,
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

function isImageFilename(filename: string): boolean {
  return /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(filename);
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

  // Estado para previsualización modal de la imagen
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

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
      <div className="min-h-screen bg-[#080809] flex items-center justify-center text-zinc-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        <span className="text-xs font-mono">Cargando detalles del ticket...</span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#080809] text-zinc-300 flex flex-col items-center justify-center gap-4">
        <p className="text-sm font-mono text-red-400">{error || "Solicitud no encontrada"}</p>
        <button
          onClick={() => router.push("/user")}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-2 border border-zinc-800 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a mis solicitudes
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#080809] text-zinc-100 font-sans antialiased p-8">
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

          {/* Tarjeta de Detalle Principal */}
                    <div className="bg-[#0b0b0d] border border-zinc-900 rounded-2xl p-6 space-y-5 overflow-hidden">
                      <div className="space-y-2 min-w-0">
                        <h1 className="text-xl font-bold text-white tracking-tight leading-snug wrap-anywhere">
                          {detail.description}
                        </h1>
              <div className="flex items-center gap-5 text-xs font-mono text-zinc-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Creado: {formatDate(detail.created_at)}
                </span>
                {detail.updated_at && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    Actualizado: {formatDate(detail.updated_at)}
                  </span>
                )}
              </div>
            </div>

            {/* Archivos Adjuntos */}
            {detail.attachments && detail.attachments.length > 0 && (
              <div className="pt-4 border-t border-zinc-800/70">
                <p className="text-[11px] font-mono uppercase text-zinc-400 mb-2.5">
                  Archivos Adjuntos ({detail.attachments.length})
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {detail.attachments.map((att) => {
                    const fullUrl = resolveFileUrl(att.file_path);
                    const isImg = isImageFilename(att.file_name);

                    if (isImg) {
                      return (
                        <button
                          key={att.id}
                          type="button"
                          onClick={() => setPreviewImage({ url: fullUrl, name: att.file_name })}
                          className="flex items-center gap-2 bg-[#0e0e11] border border-zinc-800 hover:border-zinc-700 px-3.5 py-2 rounded-xl text-xs text-zinc-300 hover:text-white transition-colors"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="truncate max-w-50">{att.file_name}</span>
                        </button>
                      );
                    }

                    return (
                      <a
                        key={att.id}
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-[#0e0e11] border border-zinc-800 hover:border-zinc-700 px-3.5 py-2 rounded-xl text-xs text-zinc-300 hover:text-white transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="truncate max-w-50">{att.file_name}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sección de Respuestas y Comentarios */}
          <div className="bg-[#0b0b0d] border border-zinc-900 rounded-2xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Actividad y Respuestas
            </h2>

            <div className="space-y-3.5">
              {!detail.comments || detail.comments.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono text-center py-8">
                  No hay respuestas registradas aún en esta solicitud.
                </p>
              ) : (
                detail.comments
                  .filter((c) => !c.is_internal)
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-xl bg-[#0e0e11] border border-zinc-800/70 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-200">
                            {comment.user?.name || "Usuario / Soporte"}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/50">
                            {comment.user?.email || "NOTIFICACIÓN"}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed wrap-anywhere">
                        {comment.content}
                      </p>
                    </div>
                  ))
              )}
            </div>

            {/* Input de Respuesta */}
            <form onSubmit={handleSendComment} className="space-y-3 pt-4 border-t border-zinc-800/70">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe una respuesta o consulta adicional..."
                className="w-full bg-[#08080a] border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-2 px-4 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
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

      {/* Modal / Lightbox de Previsualización */}
            {previewImage && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150"
                onClick={() => setPreviewImage(null)}
              >
                <div
                  className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Barra superior de controles */}
                  <div className="w-full flex items-center justify-between pb-3 text-zinc-400">
                    <span className="text-xs font-mono truncate max-w-xs">{previewImage.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(null)}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        title="Cerrar visor"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Imagen renderizada */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImage.url}
                    alt={previewImage.name}
                    className="max-h-[80vh] w-auto object-contain rounded-xl border border-zinc-800/80 shadow-2xl"
                  />
                </div>
              </div>
            )}
          </>
        );
      }
