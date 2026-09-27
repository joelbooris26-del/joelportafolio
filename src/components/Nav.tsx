import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { getAge, profile } from "@/data/site";
import { Close, Menu } from "./icons";

const links = [
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "web", label: "Web a medida" },
  { id: "automatizacion", label: "Automatización IA" },
  { id: "apps", label: "Apps" },
  { id: "sectores", label: "Sectores" },
  { id: "por-que-yo", label: "Por qué yo" },
  { id: "contacto", label: "Contacto" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, y / h) : 0);

      let current = "";
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= 160) current = l.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-white/10 bg-black/75 backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[86rem] items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#top" className="group flex items-center gap-3">
            <span className="glass-btn relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl font-display text-[0.92rem] font-bold tracking-tight text-white transition-transform group-hover:scale-105">
              JM
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[1rem] font-bold tracking-tight text-white">
                {profile.alias}
              </span>
              <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-400">
                {profile.fullName}
              </span>
            </span>
          </a>

          <nav className="glass hidden items-center gap-0.5 rounded-full p-1.5 min-[1380px]:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "relative rounded-full px-3.5 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-all duration-300",
                  active === l.id
                    ? "bg-white/15 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                {l.label}
                {l.id === "apps" && (
                  <span className="ml-1.5 inline-block h-1 w-1 rounded-full bg-white align-middle" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="glass hidden items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-300 md:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {getAge()} años · disponible
            </span>
            <a
              href="#contacto"
              className="glass-btn-primary rounded-full px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.14em]"
            >
              Hablemos
            </a>
            <button
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="glass-btn grid h-10 w-10 place-items-center rounded-xl min-[1380px]:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-white/5">
          <div
            className="h-px bg-gradient-to-r from-transparent via-white/80 to-transparent transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </header>

      {/* Menú móvil */}
      <div
        className={cn(
          "fixed inset-0 z-[60] min-[1380px]:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "glass-card absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col border-l border-white/10 bg-black/95 px-7 py-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-400">
              Menú
            </span>
            <button
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="glass-btn grid h-10 w-10 place-items-center rounded-xl text-white"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1">
            {links.map((l, i) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-b border-white/5 py-4 font-display text-2xl font-bold tracking-tight text-white transition-colors hover:text-zinc-400"
              >
                <span className="font-mono text-xs text-zinc-500">0{i + 1}</span>
                {l.label}
                {l.id === "apps" && (
                  <span className="ml-auto rounded-full border border-white/20 px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-zinc-400">
                    pronto
                  </span>
                )}
              </a>
            ))}
          </nav>
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="glass-btn-primary mt-8 rounded-full px-5 py-3.5 text-center font-mono text-xs uppercase tracking-[0.16em]"
          >
            Cuéntame tu proyecto
          </a>
          <p className="mt-auto pt-8 font-mono text-[0.62rem] leading-relaxed text-zinc-500">
            {profile.city} · {profile.region}
            <br />
            {profile.email}
          </p>
        </div>
      </div>
    </>
  );
}
