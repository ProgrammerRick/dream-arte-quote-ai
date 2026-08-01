import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden
      >
        <defs>
          <linearGradient id="dfsGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B385FF" />
            <stop offset="0.55" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#451D94" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#dfsGradient)" />
        <path
          d="M11 27.5V12.5C11 12.5 15.5 12.5 18.2 12.5C22.8 12.5 26 15.7 26 20C26 24.3 22.8 27.5 18.2 27.5C15.5 27.5 11 27.5 11 27.5Z"
          stroke="white"
          strokeWidth="2.1"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="27.5" cy="13.2" r="1.9" fill="white" />
      </svg>
      {!compact ? (
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">DreamFlow</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-500">Studio</p>
        </div>
      ) : null}
    </div>
  );
}
