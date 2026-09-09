"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSession } from "@/hooks/useSession";
import { ROLE_AREA, type Role } from "@/types/auth";

interface ProtectedAreaProps {
  area: Role;
  children: ReactNode;
}

export function ProtectedArea({ area, children }: ProtectedAreaProps) {
  const router = useRouter();
  const { user, loading } = useSession();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.must_change_password) {
      router.replace("/change-password");
      return;
    }
    if (user.role !== area) {
      router.replace(ROLE_AREA[user.role]);
    }
  }, [loading, user, area, router]);

  const isAllowed = !loading && user !== null && !user.must_change_password && user.role === area;

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando...
      </div>
    );
  }

  return <>{children}</>;
}