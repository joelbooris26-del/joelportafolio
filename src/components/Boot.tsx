import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { prefersReducedMotion } from "./ui";

const LINES = [
  "> iniciando portafolio.joel",
  "> cargando proyectos ............ ok",
  "> conectando agentes ............ ok",
  "> compilando historia ........... ok",
];

const KEY = "jm:boot-visto";

function alreadySeen() {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Pantalla de arranque breve. Solo se muestra una vez por sesión. */
export function Boot() {
  const [show, setShow] = useState(() => !prefersReducedMotion() && !alreadySeen());
  const [leaving, setLeaving] = useState(false);
  const [lines, setLines] = useState(0);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const timers: number[] = [];
    LINES.forEach((_, i) => timers.push(window.setTimeout(() => setLines(i + 1), 220 + i * 280)));
    timers.push(window.setTimeout(() => finish(), 1750));
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const finish = () => {
    setLeaving(true);
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* sin almacenamiento */
    }
    window.setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 650);
  };

  if (!show) return null;

  return (
    <div
      onClick={finish}
      className={cn(
        "fixed inset-0 z-[300] grid place-items-center bg-ink transition-all duration-700",
        leaving && "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="relative w-[min(26rem,86vw)] font-mono text-[0.8rem] leading-relaxed text-soft">
        <div className="mb-6 flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-lime/50 font-display text-sm font-extrabold text-lime">
            JM
            <span className="pulse-ring absolute inset-0 rounded-xl text-lime/60" />
          </span>
          <span className="text-[0.66rem] uppercase tracking-[0.3em] text-mute">cargando…</span>
        </div>
        {LINES.slice(0, lines).map((l) => (
          <p key={l} className="pop">
            {l}
          </p>
        ))}
        <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
          <div
            className="h-px origin-left bg-lime"
            style={{ animation: "load-bar 1.5s cubic-bezier(0.22,1,0.36,1) forwards" }}
          />
        </div>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.2em] text-mute">toca para saltar</p>
      </div>
    </div>
  );
}
