import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const diag = ["Initializing AI core", "Calibrating star maps", "Activating particles", "Igniting engines", "All systems nominal"];

export function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setPct((p) => {
      const n = Math.min(100, p + Math.random() * 9 + 3);
      if (n >= 100) { clearInterval(id); setTimeout(() => setDone(true), 500); }
      return n;
    }), 70);
    return () => clearInterval(id);
  }, []);
  const step = Math.min(diag.length - 1, Math.floor(pct / 21));
  return (
    <AnimatePresence>
      {!done && (
        <motion.div role="status" aria-label="Loading" exit={{ opacity: 0, scale: 1.1, filter: "blur(12px)" }} transition={{ duration: 0.9 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-space">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative h-28 w-28 rounded-full border border-glow/30">
            <div className="absolute inset-3 rounded-full border border-dashed border-glow/50" />
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
              className="absolute inset-9 rounded-full bg-glow shadow-[0_0_60px_10px_var(--glow)]" />
          </motion.div>
          <p className="mt-10 font-display text-6xl font-bold tabular-nums text-starlight">{Math.floor(pct)}<span className="text-glow">%</span></p>
          <div className="mt-6 h-px w-64 overflow-hidden bg-border">
            <motion.div className="h-full bg-glow" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-6 space-y-1 font-mono text-xs text-muted-foreground">
            {diag.slice(0, step + 1).map((d, i) => (
              <motion.li key={d} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-glow">{i < step ? "✓" : "›"}</span> {d}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
