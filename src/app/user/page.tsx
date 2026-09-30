"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import {
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
import { Brand } from "@/components/ui/Brand";

interface Stats {
  active: number;
  inApproval: number;
  resolved: number;
}

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
  const { user, loading: sessionLoading, logout } = useSession();
  const isMounted = useMounted();
  const [requests, setRequests] = useState<CustomerRequestRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    if (!user) return;

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
  }, [user]);

  if (sessionLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070708] text-zinc-400">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span className="text-xs font-mono">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  const displayName = user?.name || user?.email?.split("@")[0] || "Usuario";

  const stats: Stats = {
    active: requests.filter((r) => ["NEW", "IN_PROGRESS"].includes(r.status)).length,
    inApproval: requests.filter((r) => r.status === "PENDING").length,
    resolved: requests.filter((r) => ["RESOLVED", "CLOSED"].includes(r.status)).length,
  };

  const filteredRequests = requests.filter((r) => {
    const query = search.trim().toLowerCase();

    // 1. Filtro por texto / ID exacto
    if (query) {
      const cleanIdQuery = query.replace(/^(#req-|#req|#)/, "");
      const isNumeric = /^\d+$/.test(cleanIdQuery);

      const matchesSearch = isNumeric
        ? r.id === Number(cleanIdQuery)
        : r.description.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // 2. Filtro por estado
    if (statusFilter === "ALL") return true;
    if (statusFilter === "NEW") return r.status === "NEW";
    if (statusFilter === "IN_PROGRESS") return r.status === "IN_PROGRESS";
    if (statusFilter === "PENDING") return r.status === "PENDING";
    if (statusFilter === "RESOLVED") return ["RESOLVED", "CLOSED"].includes(r.status);
    return true;
  });

  const handleCreated = (newReq: CustomerRequestRead) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div
      className="min-h-screen w-full bg-[#080809] text-zinc-100 font-sans antialiased flex flex-col"
      suppressHydrationWarning
    >
      {/* 1. Header principal */}
      <header className="border-b border-zinc-900 bg-[#080809] px-8 pt-6 pb-0">
<div className="max-w-7xl mx-auto grid grid-cols-3 items-center pb-6">
          <div className="col-start-2 flex justify-center">
            <h1>
              <Brand tagline="Portal de Solicitudes" />
            </h1>
          </div>

          <div className="col-start-3 flex items-center justify-end gap-4">
            <span className="text-sm text-zinc-300 font-medium">
              {!isMounted || sessionLoading ? "Cargando..." : displayName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-transparent text-xs text-zinc-300 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Pestañas de navegación con borde inferior activo */}
        <div className="max-w-7xl mx-auto flex gap-6 text-sm">
          <button className="pb-3 border-b-2 border-white font-medium text-white transition-colors">
            Solicitudes
          </button>
        </div>
      </header>

      {/* 2. Cuerpo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-6 flex flex-col">
        {/* Fila superior: Título de sección y Botón primario de acción */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white">Solicitudes</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-zinc-200 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Solicitud</span>
          </button>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0e0e10] border border-zinc-900 rounded-xl p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-500 tracking-wider uppercase">Activas</p>
              <p className="text-2xl font-bold text-white font-mono">
                {String(stats.active).padStart(2, "0")}
              </p>
            </div>
            <Hourglass className="w-5 h-5 text-zinc-600" />
          </div>

          <div className="bg-[#0e0e10] border border-zinc-900 rounded-xl p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-500 tracking-wider uppercase">En Aprobación</p>
              <p className="text-2xl font-bold text-white font-mono">
                {String(stats.inApproval).padStart(2, "0")}
              </p>
            </div>
            <FileCheck2 className="w-5 h-5 text-zinc-600" />
          </div>

          <div className="bg-[#0e0e10] border border-zinc-900 rounded-xl p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-500 tracking-wider uppercase">Resueltas</p>
              <p className="text-2xl font-bold text-white font-mono">
                {String(stats.resolved).padStart(2, "0")}
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-zinc-600" />
          </div>
        </div>

        {/* Barra de filtros */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por número o descripción..."
              className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <button
            type="button"
            className="p-2.5 rounded-lg border border-zinc-800 bg-[#0a0a0c] text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#0a0a0c] border border-zinc-800 text-zinc-300 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-zinc-600 transition-colors cursor-pointer"
            >
              <option value="ALL">Todos los estados</option>
              <option value="NEW">Nuevas</option>
              <option value="IN_PROGRESS">En proceso</option>
              <option value="PENDING">En aprobación</option>
              <option value="RESOLVED">Resueltas</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenedor de la lista delimitada tipo tabla */}
        <div className="flex-1 bg-[#0b0b0d] border border-zinc-900 rounded-xl overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center p-16 text-zinc-500 gap-2">
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
      </main>

      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
}
