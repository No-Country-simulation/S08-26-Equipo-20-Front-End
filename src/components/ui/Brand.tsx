const SIZES = {
  sm: "h-10 w-10",
  lg: "h-14 w-14",
} as const;

interface BrandProps {
  tagline?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function Brand({ tagline, size = "sm", className = "" }: BrandProps) {
  return (
    <span className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        role="img"
        className={`${SIZES[size]} shrink-0`}
      >
        <title>ServiceFlow</title>
        <rect
          x="0.5"
          y="0.5"
          width="39"
          height="39"
          rx="8"
          className="fill-zinc-800 stroke-zinc-700"
          strokeWidth="1"
        />
        <path
          d="M12 14H28M12 20H24M12 26H20"
          className="stroke-zinc-100"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="27"
          cy="24"
          r="3.8"
          className="fill-white stroke-zinc-800"
          strokeWidth="1.8"
        />
        <path
          d="M25.8 24L26.6 24.8L28.2 23.2"
          className="stroke-zinc-800"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {tagline && <span className="text-xs text-gray-400">{tagline}</span>}
    </span>
  );
}
