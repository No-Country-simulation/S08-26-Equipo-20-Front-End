"use client";

import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function SectionHeader({ title, description, actionLabel, onAction, children }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}