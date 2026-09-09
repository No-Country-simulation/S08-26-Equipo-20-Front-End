"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@/hooks/useSession";

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}