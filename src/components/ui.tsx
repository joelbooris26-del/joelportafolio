import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** ¿Hay una demo abierta? Mientras lo esté, los bucles de animación de la página se paran. */
export const demoOpen = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("demo-open");

/* ── Aparece con fundido al entrar en pantalla ──────────────────────────── */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("rv", seen && "in", className)}
      style={{ ["--d" as string]: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ── Etiqueta de sección ────────────────────────────────────────────────── */
export function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.26em] text-mute">
      <span className="text-lime">{n}</span>
      <span className="h-px w-8 bg-lime/50" />
      {label}
    </div>
  );
}

/* ── Tarjeta con foco que sigue al ratón ────────────────────────────────── */
export function SpotCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const onMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
  return (
    <div onMouseMove={onMove} className={cn("spot panel rounded-3xl", className)}>
      {children}
    </div>
  );
}

/* ── Elemento magnético: se acerca al cursor ────────────────────────────── */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={cn("inline-block transition-transform duration-300 ease-out", className)}
    >
      {children}
    </div>
  );
}

/* ── Texto que se "descifra" al cambiar ─────────────────────────────────── */
const GLYPHS = "▮▯01<>/\\{}[]*#=+-_";

export function ScrambleText({
  words,
  interval = 2600,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [text, setText] = useState(words[0]);
  const idx = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      let i = 0;
      const id = window.setInterval(() => {
        i = (i + 1) % words.length;
        setText(words[i]);
      }, interval);
      return () => clearInterval(id);
    }

    let raf = 0;
    const scramble = (to: string) => {
      const start = performance.now();
      const dur = 650;
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const reveal = Math.floor(p * to.length);
        let out = "";
        for (let i = 0; i < to.length; i++) {
          if (to[i] === " ") out += " ";
          else if (i < reveal) out += to[i];
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setText(out);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const id = window.setInterval(() => {
      idx.current = (idx.current + 1) % words.length;
      scramble(words[idx.current]);
    }, interval);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [words, interval]);

  return <span className={className}>{text}</span>;
}

/* ── Iconos ─────────────────────────────────────────────────────────────── */
type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowRight = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);
export const ArrowLeft = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M20 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);
export const ArrowUpRight = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);
export const ArrowDown = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 4v15" />
    <path d="m6 13 6 6 6-6" />
  </svg>
);
export const Close = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const MenuIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const Check = ({ className }: P) => (
  <svg {...base} strokeWidth={2.4} className={className}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);
export const Copy = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="9" y="9" width="11.5" height="11.5" rx="2" />
    <path d="M15 6.2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1.2" />
  </svg>
);
export const Send = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M21 3 10.5 13.5" />
    <path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" />
  </svg>
);
export const Pin = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);
export const GlobeIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.2-3.8-8.5S9.4 5.9 12 3.5Z" />
  </svg>
);
export const ChatIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M20 12.5c0 3.9-3.6 7-8 7-1 0-2-.2-2.9-.5L4 21l1.4-3.6C4.2 16.1 3.5 14.4 3.5 12.5c0-3.9 3.8-7 8.5-7s8 3.1 8 7Z" />
    <path d="M9 12h.01M12 12h.01M15 12h.01" strokeWidth={2.2} />
  </svg>
);
export const FlowIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="5.5" cy="6.5" r="2.2" />
    <circle cx="18.5" cy="12" r="2.2" />
    <circle cx="5.5" cy="17.5" r="2.2" />
    <path d="M7.7 6.7c4 0 4 5.3 8.6 5.3M7.7 17.3c4 0 4-5.3 8.6-5.3" />
  </svg>
);
export const MobileIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 5.2h3" />
    <circle cx="12" cy="18.4" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
