"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import {
  Inbox,
  PlusCircle,
  Search,
  Hourglass,
  CheckCircle2,
  FileCheck2,
  Plus,
  LogOut,
  Loader2,
} from "lucide-react";
import { CustomerRequestRead } from "@/types/request";
import { RequestService } from "@/services/request.service";
import { NewRequestModal } from "@/components/user/NewRequestModal";
import { RequestList } from "@/components/user/RequestList";
import { clearAccessToken } from "@/services/session";

interface Stats {
  active: number;
  inApproval: number;
  resolved: number;
}

// Hook idiomático para evitar 'setMounted(true)' en useEffect y silenciar errores de hidratación
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function UserPortalPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const isMounted = useMounted();
  const [requests, setRequests] = useState<CustomerRequestRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    RequestService.getMyRequests()
      .then((data) => {
        if (isSubscribed) setRequests(data);
      })
      .catch((err) => console.error("Error al cargar solicitudes:", err))
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const userObj = user as Record<string, unknown> | null;
  const displayName =
    (typeof userObj?.name === "string" && userObj.name) ||
    (typeof userObj?.full_name === "string" && userObj.full_name) ||
    (typeof userObj?.username === "string" && userObj.username) ||
    (typeof userObj?.email === "string" ? userObj.email.split("@")[0] : "") ||
    "Usuario";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const stats: Stats = {
    active: requests.filter((r) => ["NEW", "IN_PROGRESS"].includes(r.status)).length,
    inApproval: requests.filter((r) => r.status === "PENDING").length,
    resolved: requests.filter((r) => ["RESOLVED", "CLOSED"].includes(r.status)).length,
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      `#REQ-${r.id}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreated = (newReq: CustomerRequestRead) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  const handleLogout = () => {
    clearAccessToken();
    router.replace("/login");
  };

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-[#0d0d0e] text-zinc-100 font-sans antialiased"
      suppressHydrationWarning
    >
      {/* 1. Sidebar con altura fija (h-screen / h-full) para que SALIR nunca se desplace */}
      <aside className="w-64 h-full border-r border-zinc-800/80 flex flex-col justify-between p-4 bg-[#0a0a0b] shrink-0 select-none">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="bg-white text-black p-1 rounded">
              <div className="w-4 h-4 border-2 border-black rotate-45 flex items-center justify-center" />
            </div>
            <span className="font-semibold tracking-wider text-sm text-white">SERVICEFLOW</span>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold text-zinc-500 tracking-wider">PORTAL</p>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg bg-white text-black transition-colors">
              <Inbox className="w-4 h-4" />
              <span>Mis Solicitudes</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nuevo Ticket</span>
            </button>
          </div>
        </div>

        {/* Botón SALIR fijado al pie del sidebar */}
        <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-between px-3 text-xs text-zinc-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px]">EN LÍNEA</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 hover:text-zinc-300 font-medium tracking-wide text-[11px] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SALIR</span>
          </button>
        </div>
      </aside>

      {/* 2. Contenedor Principal: scrolleable de manera independiente */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/80 flex items-center justify-between px-8 bg-[#0a0a0b] shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-400">
              ROL: <span className="text-white font-medium">USUARIO</span>
            </span>
            <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar en mis solicitudes..."
                className="w-full bg-[#121214] border border-zinc-800/80 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-300">
              {!isMounted || sessionLoading ? "Cargando..." : displayName}
            </span>
            <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-medium text-white uppercase">
              {!isMounted || sessionLoading ? "..." : initials}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">Mis Solicitudes</h1>
              <p className="text-xs text-zinc-500 mt-1 font-mono">Seguimiento de tickets y requerimientos activos</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black font-medium text-xs py-2 px-3.5 rounded-md hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Solicitud</span>
            </button>
          </div>

          {/* Tarjetas de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <div className="bg-[#121214] border border-zinc-800/80 rounded-lg p-5 flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-wider text-zinc-400">SOLICITUDES ACTIVAS</p>
                <p className="text-2xl font-bold font-mono text-white tracking-tight">
                  {String(stats.active).padStart(2, "0")}
                </p>
              </div>
              <Hourglass className="w-5 h-5 text-zinc-600 stroke-[1.5]" />
            </div>

            <div className="bg-[#121214] border border-zinc-800/80 rounded-lg p-5 flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-wider text-zinc-400">EN APROBACIÓN</p>
                <p className="text-2xl font-bold font-mono text-white tracking-tight">
                  {String(stats.inApproval).padStart(2, "0")}
                </p>
              </div>
              <FileCheck2 className="w-5 h-5 text-zinc-600 stroke-[1.5]" />
            </div>

            <div className="bg-[#121214] border border-zinc-800/80 rounded-lg p-5 flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-wider text-zinc-400">RESUELTAS</p>
                <p className="text-2xl font-bold font-mono text-white tracking-tight">
                  {String(stats.resolved).padStart(2, "0")}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-zinc-600 stroke-[1.5]" />
            </div>
          </div>

          {/* Lista delimitada con scroll propio */}
          <div className="flex-1 min-h-0 bg-[#121214] border border-zinc-800/80 rounded-lg overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center p-12 text-zinc-500 gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-mono">Cargando solicitudes...</span>
              </div>
            ) : (
              <RequestList
                requests={filteredRequests}
                selectedId={null}
                onSelect={(id: number) => router.push(`/user/requests/${id}`)}
              />
            )}
          </div>
        </div>
      </main>

      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
}
