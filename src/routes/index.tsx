import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import Lenis from "lenis";
import { FaGithub, FaLinkedin, FaEnvelope, FaRocket, FaArrowRight, FaExternalLinkAlt, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import { profile } from "@/lib/profile";
import { Cursor } from "@/components/portfolio/Cursor";
import { Loader } from "@/components/portfolio/Loader";
import { Nav } from "@/components/portfolio/Nav";
import { Magnetic, Reveal, SectionHead, TiltCard } from "@/components/portfolio/ui";

const Universe = lazy(() => import("@/components/portfolio/Universe"));

const title = "Abhi Patel — AI Engineer Portfolio";
const desc = "Abhi Patel, AI Engineer and CS student at JECRC University & IIT Jodhpur. Gen AI, machine learning, quant finance and backend projects.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: profile.tagline, email: profile.email, sameAs: [profile.github, profile.linkedin] }),
    }],
  }),
  component: Index,
});

const STOPS = [0, 0.12, 0.3, 0.5, 0.72, 1];
const LAYERS = ["--stop-1", "--stop-2", "--stop-3", "--stop-4", "--stop-5", "--stop-6"];

function Backdrop() {
  const { scrollYProgress: p } = useScroll();
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      {LAYERS.map((v, i) => (
        <Layer key={v} v={v} i={i} p={p} />
      ))}
      <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(60% 50% at 70% 30%, color-mix(in oklab, var(--glow) 25%, transparent), transparent 70%), radial-gradient(40% 40% at 15% 80%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%)" }} />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}><div className="absolute inset-0"><Universe /></div></Suspense>
      </ClientOnly>
    </div>
  );
}

function Layer({ v, i, p }: { v: string; i: number; p: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const prev = STOPS[Math.max(0, i - 1)];
  const opacity = useTransform(p, i === 0 ? [0, 1] : [prev, STOPS[i]], i === 0 ? [1, 1] : [0, 1]);
  return <motion.div className="absolute inset-0" style={{ background: `var(${v})`, opacity }} />;
}

function Roles() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2200); return () => clearInterval(id); }, []);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ type: "spring", stiffness: 120, damping: 16 }} className="text-gradient">
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Btn({ children, onClick, href, primary }: { children: React.ReactNode; onClick?: () => void; href?: string; primary?: boolean }) {
  const cls = `inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-shadow ${primary ? "bg-primary text-primary-foreground shadow-[0_0_40px_-8px_var(--glow)] hover:shadow-[0_0_60px_-4px_var(--glow)]" : "glass"}`;
  return (
    <Magnetic>
      <motion.div whileTap={{ scale: 0.92 }}>
        {href ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a> : <button onClick={onClick} className={cls}>{children}</button>}
      </motion.div>
    </Magnetic>
  );
}

function Index() {
  const lenis = useRef<Lenis | null>(null);
  const { scrollYProgress } = useScroll();
  const color = useTransform(scrollYProgress, [0.08, 0.2], ["oklch(0.18 0.04 265)", "oklch(0.97 0.01 250)"]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ duration: 1.4, smoothWheel: true });
    lenis.current = l;
    let raf = 0;
    const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); l.destroy(); };
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis.current) lenis.current.scrollTo(el, { offset: -40 }); else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div style={{ color }} className="relative">
      <Loader />
      <Cursor />
      <Backdrop />
      <Nav go={go} />
      <main>
        <Hero go={go} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}

function Hero({ go }: { go: (id: string) => void }) {
  return (
    <section id="home" className="relative flex min-h-screen items-center px-6 pt-24 sm:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }} className="kicker flex items-center gap-2">
          <FaMapMarkerAlt aria-hidden /> {profile.location} · Systems online
        </motion.p>
        <h1 className="mt-6 text-[clamp(3.5rem,11vw,10rem)] font-extrabold leading-[0.9]">
          {"Abhi Patel".split("").map((c, i) => (
            <motion.span key={i} className="inline-block" initial={{ y: 120, opacity: 0, rotateX: -80 }} animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 14, delay: 2.4 + i * 0.05 }}>
              {c === " " ? "\u00a0" : c}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.1 }} className="mt-6 text-2xl font-medium sm:text-4xl">
          <Roles />
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 3.3 }} className="mt-6 max-w-md">
          Building intelligent systems at the edge of software, data and finance.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5 }} className="mt-10 flex flex-wrap gap-3">
          <Btn primary onClick={() => go("projects")}>View Projects <FaArrowRight aria-hidden /></Btn>
          <Btn href={profile.linkedin}>Resume / LinkedIn</Btn>
          <Btn onClick={() => go("contact")}>Contact Me</Btn>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  const stats = [["2", "Degrees in parallel"], ["8+", "Languages & tools"], ["1", "Shipped project"], ["∞", "DSA problems"]];
  return (
    <section id="about" className="px-6 py-32 sm:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHead k="01 — Identity" title="The human behind the core" />
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <TiltCard className="p-8 sm:p-10">
              <p className="kicker mb-4">Biography.log</p>
              <p className="text-lg leading-relaxed opacity-85">{profile.about}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {profile.interests.map((t) => <span key={t} className="rounded-full border border-glow/30 px-3 py-1 font-mono text-xs">{t}</span>)}
              </div>
            </TiltCard>
          </Reveal>
          <div className="grid grid-cols-2 gap-6 lg:col-span-2">
            {stats.map(([n, l], i) => (
              <Reveal key={l} delay={i * 0.08}>
                <TiltCard className="flex h-full flex-col justify-between p-6">
                  <p className="font-display text-5xl font-bold text-gradient">{n}</p>
                  <p className="mt-4 text-sm opacity-70">{l}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [sel, setSel] = useState(0);
  const s = profile.skills[sel];
  return (
    <section id="skills" className="px-6 py-32 sm:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHead k="02 — Arsenal" title="A system of skill planets" />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-4 gap-6 sm:gap-8">
            {profile.skills.map((sk, i) => (
              <Reveal key={sk.name} delay={i * 0.05}>
                <motion.button data-magnetic onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)}
                  aria-label={sk.name} aria-pressed={sel === i}
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.15 }}
                  className="relative mx-auto flex aspect-square w-full max-w-24 items-center justify-center rounded-full text-[0.65rem] font-bold sm:text-xs"
                  style={{ background: `radial-gradient(circle at 30% 30%, oklch(0.85 0.12 ${sk.hue}), oklch(0.4 0.15 ${sk.hue}) 70%)`, boxShadow: sel === i ? `0 0 40px oklch(0.7 0.16 ${sk.hue})` : "none", color: "var(--space)" }}>
                  <motion.span aria-hidden animate={{ rotate: 360 }} transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }} className="absolute -inset-2 rounded-full border border-dashed border-glow/40">
                    <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-glow" />
                  </motion.span>
                  {sk.name}
                </motion.button>
              </Reveal>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={s.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
              <TiltCard className="p-8">
                <p className="kicker">Planet scan</p>
                <h3 className="mt-3 text-4xl font-bold">{s.name}</h3>
                <p className="mt-4 opacity-80">{s.desc}</p>
                <p className="mt-6 font-mono text-sm text-glow">{s.stack}</p>
              </TiltCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const featured = profile.projects[0]!;
  return (
    <section id="projects" className="px-6 py-32 sm:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHead k="03 — Missions" title="Featured work" />
        <Reveal>
          <TiltCard className="p-6 sm:p-10"><div className="grid gap-8 lg:grid-cols-2">
            <div className="relative flex aspect-video items-end overflow-hidden rounded-xl border border-border p-4" style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--glow) 25%, transparent), transparent)" }}>
              <svg viewBox="0 0 200 80" className="absolute inset-0 h-full w-full" aria-hidden>
                <motion.path d="M0 60 L20 52 L40 56 L60 38 L80 44 L100 26 L120 34 L140 18 L160 24 L180 10 L200 14" fill="none" stroke="var(--glow)" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }} />
              </svg>
              <span className="relative font-mono text-xs text-glow">▲ market trend · live</span>
            </div>
            <div className="flex flex-col justify-center">
              <p className="kicker">Featured mission</p>
              <h3 className="mt-3 text-3xl font-bold sm:text-4xl">{featured.name}</h3>
              <p className="mt-4 opacity-80">{featured.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {featured.stack.map((t) => <span key={t} className="rounded-full bg-glow/15 px-3 py-1 font-mono text-xs text-glow">{t}</span>)}
              </div>
              <div className="mt-8 flex gap-3">
                <Btn primary href={featured.github}><FaGithub aria-hidden /> GitHub</Btn>
                <Btn href={featured.github}><FaExternalLinkAlt aria-hidden /> Details</Btn>
              </div>
            </div>
          </div></TiltCard>
        </Reveal>
        <Reveal delay={0.1} className="mt-6">
          <div className="rounded-2xl border border-dashed border-border p-8 text-center opacity-70">More missions launching soon — follow along on GitHub.</div>
        </Reveal>
      </div>
    </section>
  );
}

function Journey() {
  const steps = [
    ...profile.education.map((e) => ({ t: e.school, s: e.degree, n: e.note })),
    { t: "Now", s: "Open to internships & opportunities", n: "Software Engineering · Gen AI · Data Science" },
  ];
  return (
    <section id="journey" className="px-6 py-32 sm:px-12">
      <div className="mx-auto max-w-4xl">
        <SectionHead k="04 — Trajectory" title="Flight path" />
        <ol className="relative border-l border-glow/30 pl-8">
          {steps.map((st, i) => (
            <li key={st.t} className="mb-10">
              <Reveal delay={i * 0.1}>
                <span className="absolute -left-[9px] mt-6 h-4 w-4 rounded-full bg-glow shadow-[0_0_20px_var(--glow)]" />
                <TiltCard className="p-6">
                  <p className="kicker flex items-center gap-2"><FaGraduationCap aria-hidden /> {st.t}</p>
                  <h3 className="mt-2 text-2xl font-bold">{st.s}</h3>
                  <p className="mt-2 opacity-70">{st.n}</p>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  const [launched, setLaunched] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLaunched(true);
    const body = encodeURIComponent(`${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`);
    setTimeout(() => { window.location.href = `mailto:${profile.email}?subject=Hello from your portfolio&body=${body}`; }, 900);
    setTimeout(() => setLaunched(false), 2500);
  };
  const field = "w-full rounded-xl border border-input bg-transparent px-4 py-3 outline-none transition focus:border-glow focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--glow)_25%,transparent)]";
  return (
    <section id="contact" className="px-6 py-32 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <SectionHead k="05 — Mission control" title="Open a channel" />
        <Reveal>
          <form onSubmit={submit} className="glass space-y-4 rounded-2xl p-6 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="kicker">Name</span><input required name="name" className={`${field} mt-2`} /></label>
              <label className="block"><span className="kicker">Email</span><input required type="email" name="email" className={`${field} mt-2`} /></label>
            </div>
            <label className="block"><span className="kicker">Message</span><textarea required name="message" rows={5} className={`${field} mt-2`} /></label>
            <motion.button whileTap={{ scale: 0.95 }} type="submit" className="relative inline-flex items-center gap-3 overflow-visible rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground">
              <motion.span animate={launched ? { y: -400, x: 200, rotate: -45, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }} transition={{ duration: 1, ease: "easeIn" }}>
                <FaRocket aria-hidden />
              </motion.span>
              {launched ? "Launched!" : "Launch message"}
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const links = [[FaGithub, profile.github, "GitHub"], [FaLinkedin, profile.linkedin, "LinkedIn"], [FaEnvelope, `mailto:${profile.email}`, "Email"]] as const;
  return (
    <footer className="relative px-6 pb-12 pt-24 text-center">
      <svg aria-hidden viewBox="0 0 300 60" className="mx-auto mb-10 h-16 w-72 opacity-60">
        <polyline points="10,40 60,15 110,35 160,10 210,30 260,12 290,40" fill="none" stroke="var(--glow)" strokeWidth="0.6" />
        {[[10, 40], [60, 15], [110, 35], [160, 10], [210, 30], [260, 12], [290, 40]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2" fill="var(--starlight)" />)}
      </svg>
      <div className="flex justify-center gap-4">
        {links.map(([Icon, href, label]) => (
          <Magnetic key={label}>
            <motion.a whileHover={{ rotate: 360, scale: 1.15 }} transition={{ type: "spring" }} href={href} target="_blank" rel="noreferrer" aria-label={label}
              className="glass flex h-12 w-12 items-center justify-center rounded-full text-lg"><Icon /></motion.a>
          </Magnetic>
        ))}
      </div>
      <p className="mt-8 font-mono text-xs opacity-50">© {new Date().getFullYear()} Abhi Patel · Drifting through deep space</p>
    </footer>
  );
}
