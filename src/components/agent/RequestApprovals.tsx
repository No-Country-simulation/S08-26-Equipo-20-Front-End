"use client";

import { useEffect, useState } from "react";
import { CheckSquare, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { requestsService } from "@/services/requests";
import type { Approval } from "@/types/requests";
import { errorMessage } from "@/utils/error";

interface RequestApprovalsProps {
  requestId: number;
}

export function RequestApprovals({ requestId }: RequestApprovalsProps) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApprovals();
  }, [requestId]);

  const loadApprovals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestsService.listApprovals(requestId);
      setApprovals(data);
    } catch (err) {
      setError(errorMessage(err, "Error al cargar aprobaciones"));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="text-emerald-500 font-medium">Aprobado</span>;
      case "REJECTED":
        return <span className="text-red-500 font-medium">Rechazado</span>;
      default:
        return <span className="text-amber-500 font-medium">Pendiente</span>;
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-zinc-400" />
        <h2 className="text-sm font-semibold text-white">Aprobaciones</h2>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
          </div>
        ) : approvals.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-2">
            No requiere aprobación o no ha sido categorizada.
          </p>
        ) : (
          <div className="space-y-3">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="rounded-md bg-zinc-950 p-4 border border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(approval.status)}
                    {getStatusLabel(approval.status)}
                  </div>
                  <span className="text-zinc-500">
                    Aprobador: {approval.approver.name}
                  </span>
                </div>
                {approval.comment && (
                  <p className="text-xs text-zinc-400 border-t border-zinc-800 pt-2 mt-2">
                    "{approval.comment}"
                  </p>
                )}
                {approval.decided_at && (
                  <p className="text-[10px] text-zinc-600 pt-1">
                    Decidido el: {new Date(approval.decided_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
