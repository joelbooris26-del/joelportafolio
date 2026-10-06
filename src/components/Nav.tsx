import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { Close, MenuIcon } from "./ui";

const links = [
  { id: "proyectos", label: "Proyectos" },
  { id: "demos", label: "Demos" },
  { id: "historia", label: "Historia" },
  { id: "laboratorio", label: "Laboratorio" },
  { id: "servicios", label: "Servicios" },
  { id: "contacto", label: "Contacto" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, y / h) : 0);
      let cur = "";
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = l.id;
      }
      setActive(cur);
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
      {/* Barra de progreso */}
      <div className="fixed inset-x-0 top-0 z-[90] h-[2px] bg-transparent">
        <div
          className="h-full origin-left bg-lime shadow-[0_0_14px_rgba(200,255,62,0.9)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <header
        data-site-nav
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-500",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <div className="mx-auto flex max-w-[84rem] items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="group flex items-center gap-3" data-hover>
            <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] font-display text-[0.8rem] font-extrabold text-white backdrop-blur-xl transition-colors group-hover:border-lime/70 group-hover:text-lime">
              JM
            </span>
            <span className="hidden font-mono text-[0.64rem] uppercase leading-tight tracking-[0.22em] text-mute sm:block">
              Joel
              <br />
              portafolio
            </span>
          </a>

          <nav
            className={cn(
              "hidden items-center gap-1 rounded-full border border-white/10 p-1.5 backdrop-blur-xl transition-colors lg:flex",
              scrolled ? "bg-ink/70" : "bg-white/[0.03]",
            )}
          >
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "rounded-full px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] transition-all",
                  active === l.id ? "bg-lime text-ink" : "text-soft hover:text-white",
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contacto"
              className="btn-lime hidden px-5 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] sm:inline-flex"
            >
              Hablemos
            </a>
            <button
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-white backdrop-blur-xl lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <div
        className={cn(
          "fixed inset-0 z-[120] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink/90 backdrop-blur-xl transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col border-l border-white/10 bg-panel px-7 py-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-mute">Menú</span>
            <button
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col">
            {links.map((l, i) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-white/[0.06] py-4 font-display text-2xl font-semibold text-white transition-colors hover:text-lime"
              >
                <span className="font-mono text-xs text-lime">0{i + 1}</span>
                {l.label}
              </a>
            ))}
          </nav>
          <a href="#contacto" onClick={() => setOpen(false)} className="btn-lime mt-8 justify-center px-5 py-3.5 text-sm">
            Hablemos
          </a>
        </div>
      </div>
    </>
  );
}
