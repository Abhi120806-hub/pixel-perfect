import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export const sections = ["home", "about", "skills", "projects", "journey", "contact"] as const;

export function Nav({ go }: { go: (id: string) => void }) {
  const { scrollY } = useScroll();
  const pad = useTransform(scrollY, [0, 200], [14, 8]);
  const width = useTransform(scrollY, [0, 200], ["min(92vw, 760px)", "min(92vw, 620px)"]);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => { const el = document.getElementById(s); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <motion.nav aria-label="Main" style={{ paddingTop: pad, paddingBottom: pad, width }}
      className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center justify-between rounded-full glass px-4">
      <button onClick={() => go("home")} className="font-display text-lg font-bold">AP<span className="text-glow">.</span></button>
      <ul className="flex gap-1 overflow-x-auto">
        {sections.slice(1).map((s) => (
          <li key={s}>
            <button onClick={() => go(s)} aria-current={active === s} className="relative rounded-full px-3 py-1.5 text-xs capitalize opacity-80 hover:opacity-100 sm:text-sm">
              {active === s && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-glow/20 ring-1 ring-glow/40" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
              <span className="relative">{s}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
