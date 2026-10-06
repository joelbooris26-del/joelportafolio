import { useEffect, useState } from "react";
import { getAge, profile, roles } from "@/data/content";
import { GlobeCanvas } from "./GlobeCanvas";
import { ArrowDown, ArrowRight, Magnetic, ScrambleText } from "./ui";

function useMadridTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/** Texto circular que gira, con una flecha en el centro. */
function RotatingBadge() {
  return (
    <a
      href="#proyectos"
      data-hover
      aria-label="Ver proyectos"
      className="group relative grid h-32 w-32 place-items-center sm:h-40 sm:w-40"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text
          fill="currentColor"
          className="font-mono text-lime"
          fontSize="12.5"
          letterSpacing="3"
        >
          <textPath href="#badge-circle" textLength="482" lengthAdjust="spacing">
            DISPONIBLE PARA PROYECTOS ✦ WEB · IA · APPS ✦
          </textPath>
        </text>
      </svg>
      <span className="grid h-14 w-14 place-items-center rounded-full border border-lime/60 bg-lime/10 text-lime transition-all duration-300 group-hover:scale-110 group-hover:bg-lime group-hover:text-ink sm:h-16 sm:w-16">
        <ArrowDown className="h-6 w-6" />
      </span>
    </a>
  );
}

/** Líneas que van saliendo de arriba hacia abajo al entrar en la página, y ahí se quedan. */
const terminalLines: { key: string; value: string; ok?: boolean }[] = [
  { key: "portafolio.joel", value: "iniciado" },
  { key: "proyectos", value: "4 cargados" },
  { key: "demos", value: "3 listas para probar" },
  { key: "ubicación", value: "La Línea, Cádiz" },
  { key: "estado", value: "disponible", ok: true },
];
const DOTS = 22;

function HeroTerminal() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    terminalLines.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), 700 + i * 650));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="w-full max-w-[24rem] overflow-hidden rounded-2xl border border-white/10 bg-ink/70 font-mono text-[0.72rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      aria-label="Estado del portafolio"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-lime" />
        <span className="ml-2 text-[0.6rem] uppercase tracking-[0.22em] text-mute">joel.sh</span>
      </div>

      {/* Altura fija: las líneas aparecen sin que la caja salte ni mueva la portada */}
      <div className="h-[8.6rem] space-y-1.5 px-4 py-3.5">
        {terminalLines.slice(0, shown).map((l) => (
          <p key={l.key} className="line-in whitespace-nowrap text-soft">
            <span className="text-lime">&gt;</span> {l.key}{" "}
            <span className="text-white/25">{".".repeat(Math.max(2, DOTS - l.key.length))}</span>{" "}
            <span className={l.ok ? "text-lime" : "text-white"}>
              {l.value}
              {l.ok && " ✓"}
            </span>
          </p>
        ))}
        <span className="caret text-lime">▍</span>
      </div>
    </div>
  );
}

export function Hero() {
  const time = useMadridTime();
  const age = getAge();

  return (
    <section id="top" className="noise scanlines relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <div className="grid-bg fade-b absolute inset-0 opacity-70" />
        <div className="drift absolute -left-32 top-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(200,255,62,0.10),transparent_65%)] blur-3xl" />
        <GlobeCanvas className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[84rem] flex-col justify-between px-5 pb-8 pt-28 sm:px-8 sm:pt-32">
        {/* HUD superior */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.64rem] uppercase tracking-[0.22em] text-mute">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-soft backdrop-blur-xl">
            <span className="relative flex h-2 w-2 text-success">
              <span className="pulse-ring absolute inset-0 text-lime" />
              <span className="h-2 w-2 rounded-full bg-lime" />
            </span>
            Disponible
          </span>
          <span>{profile.city}</span>
          <span className="hidden sm:inline">{profile.coords}</span>
          <span className="tabular-nums text-soft">{time} CET</span>
        </div>

        {/* Titular */}
        <div className="max-w-5xl py-12">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.34em] text-lime">
            Portafolio {new Date().getFullYear()}
          </p>

          <h1 className="mt-5 font-display text-[clamp(4.8rem,20vw,16rem)] font-extrabold leading-[0.82] tracking-[-0.05em] text-white">
            {"JOEL".split("").map((ch, i) => (
              <span
                key={i}
                className="rv in inline-block"
                style={{ animation: `pop 0.9s ${0.1 + i * 0.09}s cubic-bezier(0.22,1,0.36,1) both` }}
              >
                {ch}
              </span>
            ))}
            <span className="inline-block h-[0.14em] w-[0.14em] rounded-full bg-lime align-baseline shadow-[0_0_30px_rgba(200,255,62,0.9)]" />
          </h1>

          <p className="mt-8 font-display text-[clamp(1.3rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
            Construyo{" "}
            <span className="inline-block min-w-[9ch] text-lime">
              <ScrambleText words={roles} />
            </span>
            <span className="caret ml-0.5 text-lime">▍</span>
            <br />
            <span className="text-mute">y las dejo funcionando.</span>
          </p>

          <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-soft">
            {profile.fullName}, {age} años, de {profile.city}. Autodidacta desde los 14: webs, agentes
            de IA, automatizaciones y una app propia que construyo de principio a fin.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#demos" className="btn-lime group px-7 py-4 text-sm">
                Probar las demos
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#proyectos" className="btn-ghost px-7 py-4 text-sm">
                Ver proyectos
              </a>
            </Magnetic>
          </div>
        </div>

        {/* HUD inferior */}
        <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:justify-between">
          <HeroTerminal />
          <div className="self-end">
            <RotatingBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
