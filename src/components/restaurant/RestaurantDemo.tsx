import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { hours, restaurant } from "@/data/restaurant";
import { Assistant, type BotAction } from "./Assistant";
import { Carta, Contacto, Reservas, Ubicacion, type Prefill } from "./sections";
import { ArrowUpRight, Close, Phone } from "../icons";

const navLinks = [
  { id: "r-carta", label: "Carta" },
  { id: "r-reservas", label: "Reservas" },
  { id: "r-ubicacion", label: "Ubicación" },
  { id: "r-contacto", label: "Contacto" },
];

const localISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return localISO(d);
}

function getTodayHours() {
  const d = new Date().getDay();
  if (d === 1) return hours[0];
  if (d >= 2 && d <= 4) return hours[1];
  if (d === 5 || d === 6) return hours[2];
  return hours[3];
}

export function RestaurantDemo({
  open,
  onClose,
  onContact,
}: {
  open: boolean;
  onClose: () => void;
  /** Si se pasa, aparece el botón «Quiero una web así» en la barra superior. */
  onContact?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayHours = getTodayHours();

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [open]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    scrollRef.current?.scrollTo({ top: el.offsetTop - 68, behavior: "smooth" });
  };

  const handleBot = (a: BotAction) => {
    switch (a) {
      case "carta":
        go("r-carta");
        break;
      case "ubicacion":
        go("r-ubicacion");
        break;
      case "contacto":
        go("r-contacto");
        break;
      case "reservas":
        go("r-reservas");
        break;
      case "prefill2":
        setPrefill({ guests: 2, date: localISO(new Date()), token: Date.now() });
        go("r-reservas");
        break;
      case "prefill4":
        setPrefill({ guests: 4, date: nextSaturday(), token: Date.now() });
        go("r-reservas");
        break;
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "demo-scope fixed inset-0 z-[150] flex flex-col transition-opacity duration-400",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Demo interactiva: restaurante Marea Alta"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

      <div
        className={cn(
          "glass-card relative m-1.5 flex flex-1 flex-col overflow-hidden rounded-3xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:m-4",
          open ? "translate-y-0 scale-100" : "translate-y-6 scale-[0.98]",
        )}
      >
        {/* Barra del navegador de cristal */}
        <div className="glass flex items-center gap-3 border-x-0 border-t-0 px-4 py-3">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
          </span>
          <div className="flex min-w-0 flex-1 justify-center">
            <span className="glass flex max-w-full items-center gap-2 truncate rounded-full px-4 py-1.5 font-mono text-[0.62rem] text-zinc-400">
              <svg viewBox="0 0 24 24" className="hidden h-3 w-3 shrink-0 text-white sm:block" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <span className="truncate text-zinc-200">https://marea-alta.es</span>
              <span className="glass-btn-primary hidden shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-black sm:inline">
                demo interactiva
              </span>
            </span>
          </div>
          {onContact && (
            <button
              onClick={onContact}
              className="glass-btn-primary shrink-0 rounded-full px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-black"
            >
              <span className="hidden sm:inline">Quiero una web así</span>
              <span className="sm:hidden">Quiero una</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="glass-btn group flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-zinc-300 hover:text-white"
          >
            <span className="hidden sm:inline">Salir</span>
            <Close className="h-4 w-4" />
          </button>
        </div>

        {/* Sitio web del restaurante */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto overflow-x-hidden bg-black font-rbody text-zinc-200"
        >
          {/* Nav del restaurante de cristal */}
          <div className="glass sticky top-0 z-30 border-x-0 border-t-0 px-5 py-3.5 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <button
                onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-baseline gap-2 text-left"
              >
                <span className="font-chef text-[1.35rem] font-bold leading-none tracking-[-0.02em] text-white">
                  Marea Alta
                </span>
                <span className="hidden font-mono text-[0.55rem] uppercase tracking-[0.18em] text-zinc-500 sm:inline">
                  desde {restaurant.since}
                </span>
              </button>

              <nav className="glass hidden items-center gap-4 rounded-full px-4 py-1.5 md:flex">
                {navLinks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => go(l.id)}
                    className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <a
                  href={restaurant.phoneHref}
                  className="hidden items-center gap-2 font-mono text-[0.64rem] text-zinc-400 transition-colors hover:text-white sm:flex"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {restaurant.phone}
                </a>
                <button
                  onClick={() => go("r-reservas")}
                  className="glass-btn-primary rounded-full px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-black"
                >
                  Reservar
                </button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-zinc-400"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero */}
          <header className="relative flex min-h-[clamp(26rem,64vh,40rem)] items-end overflow-hidden">
            <img
              src={restaurant.heroImage}
              alt="Terraza del restaurante Marea Alta al atardecer"
              className="anim-float absolute inset-0 h-full w-full scale-105 object-cover grayscale-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

            <span className="glass absolute right-5 top-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-white">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  todayHours.closed ? "bg-zinc-500" : "bg-white",
                )}
              />
              {todayHours.closed ? "Cerrado hoy · mañana abrimos" : `Hoy · ${todayHours.time}`}
            </span>

            <div className="relative w-full px-5 pb-12 pt-24 sm:px-10">
              <div className="mx-auto max-w-6xl">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-zinc-400">
                  {restaurant.tagline} · {restaurant.city}
                </p>
                <h1 className="mt-4 font-chef text-[clamp(3rem,10vw,7rem)] font-bold leading-[0.85] tracking-[-0.035em] text-white">
                  Marea
                  <span className="block italic text-zinc-300">Alta</span>
                </h1>
                <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-zinc-300">
                  El producto que entra cada mañana en la lonja, brasa de encina y el mar delante de
                  tu mesa. Cocina gaditana sin disfraces.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => go("r-reservas")}
                    className="glass-btn-primary group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-bold text-black"
                  >
                    Reservar mesa
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => go("r-carta")}
                    className="glass-btn rounded-full px-6 py-3.5 text-sm font-medium text-white"
                  >
                    Ver la carta
                  </button>
                </div>

                <div className="glass mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4">
                  {[
                    { k: "Producto", v: "Lonja diaria" },
                    { k: "Brasa", v: "Encina" },
                    { k: "Terraza", v: "Vista al mar" },
                    { k: "Bodega", v: "Marco de Jerez" },
                  ].map((f) => (
                    <div key={f.k} className="bg-black/60 px-4 py-3 backdrop-blur">
                      <p className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-zinc-500">
                        {f.k}
                      </p>
                      <p className="mt-1 font-chef text-[0.95rem] font-semibold text-white">{f.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <Carta
            onReserve={(note) => {
              setPrefill({ note, token: Date.now() });
              go("r-reservas");
            }}
          />
          <Reservas prefill={prefill} />
          <Ubicacion />
          <Contacto />

          <footer className="border-t border-white/10 bg-black px-5 py-12 text-zinc-200 sm:px-10">
            <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-chef text-2xl font-bold text-white">Marea Alta</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
                  {restaurant.tagline}. {restaurant.address}, {restaurant.city}.
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-400">
                  Horario
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-zinc-400">
                  {hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-3">
                      <span>{h.day}</span>
                      <span className="font-mono text-[0.66rem]">
                        {h.closed ? "cerrado" : h.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-400">
                  Contacto
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-zinc-400">
                  <li>{restaurant.phone}</li>
                  <li>{restaurant.email}</li>
                  <li>{restaurant.instagram}</li>
                </ul>
              </div>
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-400">
                  Navegación
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {navLinks.map((l) => (
                    <li key={l.id}>
                      <button
                        onClick={() => go(l.id)}
                        className="text-zinc-400 transition-colors hover:text-white"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-600">
              <span>© {new Date().getFullYear()} Marea Alta · restaurante ficticio</span>
              <span>Diseñado y construido por Joel</span>
            </div>
          </footer>
        </div>

        <Assistant onAction={handleBot} />
      </div>
    </div>
  );
}
