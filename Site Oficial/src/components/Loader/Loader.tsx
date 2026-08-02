import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LoaderProps {
  onFinish?: () => void;
}

/**
 * Tela de carregamento inicial premium — transmite sofisticação
 * e tecnologia antes de revelar o site.
 */
export function Loader({ onFinish }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 1600;

    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 350);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-ink-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-brand-600/30 blur-[110px]" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center gap-6"
          >
            <div className="relative flex h-16 w-16 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-2xl border border-brand-400/40"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              />
              <svg viewBox="0 0 64 64" className="h-9 w-9">
                <path d="M32 8L50 32L32 56L14 32L32 8Z" fill="url(#loaderGrad)" />
                <defs>
                  <linearGradient id="loaderGrad" x1="0" y1="0" x2="64" y2="64">
                    <stop offset="0" stopColor="#d9c2ff" />
                    <stop offset="0.5" stopColor="#9333ea" />
                    <stop offset="1" stopColor="#4c1d95" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="font-display text-sm uppercase tracking-[0.4em] text-white/70">
                Dream Arte
              </p>
              <div className="h-[2px] w-52 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-lilac-300 via-brand-400 to-brand-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-display text-xs tabular-nums text-white/40">{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
