import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Close, MenuIcon, prefersReducedMotion } from "./ui";

/**
 * Botón de pausa de las animaciones, para quien las prefiera quietas.
 * Guarda la preferencia y recarga la página en el mismo punto donde estaba.
 */
function MotionToggle() {
  const paused = prefersReducedMotion();
  const toggle = () => {
    try {
      window.localStorage.setItem("jm:motion", paused ? "on" : "off");
      window.sessionStorage.setItem("jm:scroll", String(window.scrollY));
    } catch {
      /* sin almacenamiento: no se puede recordar */
    }
    window.location.reload();
  };
  return (
    <button
      onClick={toggle}
      aria-pressed={paused}
      aria-label={paused ? "Activar las animaciones" : "Pausar las animaciones"}
      title={paused ? "Activar las animaciones" : "Pausar las animaciones"}
      className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-soft transition-colors hover:border-lime/60 hover:text-lime"
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden="true">
        {paused ? <path d="M8 5.5v13l11-6.5-11-6.5Z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
      </svg>
    </button>
  );
}

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
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  /* Barra de progreso y fondo del menú.
     Antes cada evento de scroll volvía a pintar el menú entero y medía la posición de todas las
     secciones (lectura de layout): con el dedo eso saturaba el hilo principal y la animación de la
     esfera se paraba. Ahora: como máximo una vez por fotograma, sin leer layout y sin repintar React
     (la barra se mueve directamente; el estado solo cambia al cruzar el umbral). */
  useEffect(() => {
    let raf = 0;
    let max = 1;
    let wasScrolled = false;
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, y / max)})`;
      const s = y > 40;
      if (s !== wasScrolled) {
        wasScrolled = s;
        setScrolled(s);
      }
      if (y < 120) setActive("");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    update();
    const ro = new ResizeObserver(measure); // el alto total solo cambia cuando cambia el contenido
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* Sección activa: la que cruza una franja fina a ~40 % de la altura de la pantalla.
     Lo avisa el navegador (IntersectionObserver): no hay que medir nada al hacer scroll. */
  useEffect(() => {
    const live = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) live.add(e.target.id);
          else live.delete(e.target.id);
        }
        const cur = [...links].reverse().find((l) => live.has(l.id));
        if (cur) setActive(cur.id);
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    for (const l of links) {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
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
          ref={bar}
          className="h-full origin-left bg-lime shadow-[0_0_14px_rgba(200,255,62,0.9)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <header
        data-site-nav
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-[padding] duration-300",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <div className="mx-auto flex max-w-[84rem] items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="group flex items-center gap-3" data-hover>
            <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] font-display text-[0.8rem] font-extrabold text-white transition-colors group-hover:border-lime/70 group-hover:text-lime">
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
              "hidden items-center gap-1 rounded-full border border-white/10 p-1.5 transition-colors lg:flex",
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
            <MotionToggle />
            <a
              href="#contacto"
              className="btn-lime hidden px-5 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] sm:inline-flex"
            >
              Hablemos
            </a>
            <button
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-white lg:hidden"
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
            "absolute inset-0 bg-ink/95 transition-opacity duration-300",
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
