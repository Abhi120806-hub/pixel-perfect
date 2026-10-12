import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 30, mass: 0.5 });
  const tx = useSpring(x, { stiffness: 120, damping: 20 });
  const ty = useSpring(y, { stiffness: 120, damping: 20 });
  const [big, setBig] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = e.target as HTMLElement;
      setBig(!!t.closest("a,button,[data-magnetic]"));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!on) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div style={{ x: tx, y: ty }} className="absolute -left-6 -top-6">
        <motion.div animate={{ scale: big ? 2.2 : 1, rotate: 360 }} transition={{ rotate: { duration: 6, repeat: Infinity, ease: "linear" }, scale: { type: "spring" } }}
          className="relative h-12 w-12 rounded-full border border-glow/40">
          <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-glow" />
          <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
        </motion.div>
      </motion.div>
      <motion.div style={{ x: sx, y: sy }} className="absolute -left-2 -top-2">
        <div className="h-4 w-4 rounded-full bg-starlight shadow-[0_0_24px_6px_var(--glow)]" />
      </motion.div>
    </div>
  );
}
