import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  const move = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} className={cn("inline-block", className)}>
      {children}
    </motion.div>
  );
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 15 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  return (
    <motion.div data-magnetic
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
      whileHover={{ y: -8 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("group relative overflow-hidden rounded-2xl glass", className)}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: useTransform([gx, gy], ([a, b]) => `radial-gradient(400px at ${a} ${b}, color-mix(in oklab, var(--glow) 22%, transparent), transparent 60%)`) }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 50, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }} transition={{ type: "spring", stiffness: 70, damping: 18, delay }}>
      {children}
    </motion.div>
  );
}

export function SectionHead({ k, title }: { k: string; title: string }) {
  return (
    <Reveal className="mb-14">
      <p className="kicker">{k}</p>
      <h2 className="mt-3 text-4xl font-bold sm:text-6xl">{title}</h2>
    </Reveal>
  );
}
