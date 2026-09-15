import type { ReactNode } from "react";

export type BadgeVariant =
  | "admin"
  | "agent"
  | "user"
  | "active"
  | "inactive"
  | "yes"
  | "no"
  | "muted";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  admin: "bg-white text-black",
  agent: "bg-blue-500/20 text-blue-400",
  user: "bg-zinc-800 text-zinc-300",
  active: "bg-emerald-500/20 text-emerald-400",
  inactive: "bg-zinc-800 text-zinc-400",
  yes: "bg-emerald-500/20 text-emerald-400",
  no: "bg-zinc-800 text-zinc-400",
  muted: "bg-zinc-800 text-zinc-400",
};

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}

export function roleBadgeVariant(role: string): BadgeVariant {
  if (role === "ADMIN") {
    return "admin";
  }
  if (role === "AGENT") {
    return "agent";
  }
  return "user";
}