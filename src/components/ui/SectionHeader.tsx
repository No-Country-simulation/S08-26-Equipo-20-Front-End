"use client";

interface SectionHeaderProps {
  title: string;
  actionLabel: string;
  onAction: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
      <button
        type="button"
        onClick={onAction}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
      >
        {actionLabel}
      </button>
    </div>
  );
}