export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`relative flex ${className} items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 shadow-[0_4px_20px_-4px_rgba(147,51,234,0.7)]`}>
      <svg viewBox="0 0 64 64" className="h-[60%] w-[60%]" aria-hidden="true">
        <path d="M32 8L50 32L32 56L14 32L32 8Z" fill="white" fillOpacity={0.95} />
        <path d="M32 20L42 32L32 44L22 32L32 20Z" fill="url(#logoInner)" />
        <defs>
          <linearGradient id="logoInner" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0" stopColor="#4c1d95" />
            <stop offset="1" stopColor="#9333ea" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}
