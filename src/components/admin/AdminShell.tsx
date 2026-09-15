"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSession } from "@/hooks/useSession";

const SECTIONS = [
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/teams", label: "Equipos" },
  { href: "/admin/categories", label: "Categorías" },
  { href: "/admin/priorities", label: "Prioridades" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useSession();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex flex-col">
            <p className="text-lg font-bold uppercase tracking-widest text-white">
              ServiceFlow
            </p>
            <p className="text-xs text-gray-400">Área de Administración</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-200">{user?.name}</span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-md border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
        <nav className="mx-auto flex w-full max-w-5xl gap-6 px-6">
          {SECTIONS.map((section) => {
            const isActive = pathname.startsWith(section.href);
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`border-b-2 py-3 text-sm transition-colors ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}