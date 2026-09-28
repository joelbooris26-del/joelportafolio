import { useEffect, useState } from "react";
import { getAge, nextBirthday, profile, ticker } from "@/data/site";
import { Reveal, TypeWriter } from "./Reveal";
import { ArrowDown, ArrowRight, Chat, Code, Cpu } from "./icons";

const consoleLines = [
  "> iniciando agente_de_voz · empresa de ejemplo",
  "> llamada entrante  +34 6•• ••• 41",
  "> intención detectada: confirmar cita",
  "> cita confirmada → jueves 12:30",
  "> sms + email enviados  ✓",
];

function useMadridClock() {
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

export function Hero() {
  const time = useMadridClock();
  const age = getAge();
  const bday = nextBirthday();

  return (
    <section id="top" className="noise-layer relative overflow-hidden pt-28 sm:pt-32">
      {/* Fondo por capas: negro con reflejos sutiles blancos */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="bg-grid mask-fade-b absolute inset-0 opacity-60" />
        <div className="anim-float absolute -top-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(59,123,246,0.22),transparent_65%)] blur-3xl" />
        <div
          className="anim-float absolute -right-32 top-32 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(101,152,255,0.14),transparent_65%)] blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      <div className="relative mx-auto max-w-[86rem] px-5 pb-16 sm:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Columna principal */}
          <div className="lg:col-span-7">
            <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-zinc-400">
              <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-zinc-300">
                <span className="relative flex h-2 w-2 text-white">
                  <span className="ring-pulse absolute inset-0" />
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                {profile.city} · {profile.region}
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="text-zinc-400">{time} CET</span>
              <span className="h-3 w-px bg-white/15" />
              <span className="text-zinc-500">Portafolio {new Date().getFullYear()}</span>
            </Reveal>

            <Reveal delay={90} className="mt-7">
              <h1 className="font-display text-[clamp(4.5rem,15vw,12rem)] font-extrabold leading-[0.82] tracking-[-0.05em] text-white">
                Joel
                <span className="ml-1 inline-block h-[0.12em] w-[0.12em] translate-y-[-0.55em] rounded-full bg-white align-middle" />
              </h1>
              <p className="mt-4 max-w-xl font-mono text-[0.72rem] uppercase leading-relaxed tracking-[0.3em] text-zinc-400 sm:text-[0.82rem]">
                {profile.fullName}
              </p>
            </Reveal>

            <Reveal delay={180} className="mt-9 max-w-2xl">
              <h2 className="font-display text-[clamp(1.55rem,3.4vw,2.6rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-zinc-100">
                Construyo webs a medida y agentes de IA que{" "}
                <span className="swash text-white">atienden, llaman y reservan</span> por ti.
                <span className="mt-2 block text-zinc-400">Y mucho más...</span>
              </h2>
              <p className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-zinc-400">
                {profile.sub}
              </p>
            </Reveal>

            <Reveal delay={260} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#web"
                className="glass-btn-primary group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm"
              >
                Ver los proyectos
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>

            <Reveal delay={340} className="mt-10 flex flex-wrap items-center gap-3">
              {[
                { icon: Code, label: "Web a medida" },
                { icon: Cpu, label: "Agentes de IA" },
                { icon: Chat, label: "Atención 24/7" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-zinc-300"
                >
                  <Icon className="h-3.5 w-3.5 text-white" />
                  {label}
                </span>
              ))}
            </Reveal>
          </div>

          {/* Columna lateral: tarjeta de cristal + consola */}
          <div className="lg:col-span-5">
            <Reveal delay={200} className="relative">
              <div className="anim-float glass absolute -left-6 -top-8 hidden rotate-[-6deg] rounded-xl px-3.5 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white shadow-xl xl:block">
                ✦ nada de plantillas
              </div>
              <div
                className="anim-float glass absolute -right-4 bottom-24 hidden rotate-[6deg] rounded-xl px-3.5 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white shadow-xl xl:block"
                style={{ animationDelay: "-3s" }}
              >
                ✦ demos que se prueban
              </div>

              <div className="glass-card relative overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-400">
                    ficha_rápida.json
                  </span>
                  <span className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/40" />
                    <span className="h-2 w-2 rounded-full bg-white/70" />
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4 px-6 py-6">
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-500">
                      Edad
                    </p>
                    <p className="mt-1 font-display text-6xl font-extrabold leading-none tracking-tight text-white">
                      {age}
                      <span className="ml-2 align-top font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
                        años
                      </span>
                    </p>
                  </div>
                  <p className="max-w-[10rem] text-right font-mono text-[0.58rem] leading-relaxed text-zinc-400">
                    se suma un año sola
                    <br />
                    cada 22 de julio
                    <br />
                    <span className="text-white">
                      {bday.days === 0
                        ? "¡hoy es mi cumpleaños!"
                        : `cumple ${bday.turns} el 22/07/${bday.year}`}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-px border-y border-white/10 bg-white/5">
                  {[
                    { k: "Ubicación", v: `${profile.region}, ES` },
                    { k: "Experiencia", v: "4 años" },
                    { k: "Enfoque", v: "Web + IA" },
                    { k: "Disponibilidad", v: "Abierta" },
                  ].map((f) => (
                    <div key={f.k} className="bg-black/60 px-5 py-3.5 backdrop-blur-md">
                      <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-zinc-500">
                        {f.k}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">{f.v}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-black/90 px-5 py-5 font-mono text-[0.68rem] leading-relaxed text-zinc-300">
                  <TypeWriter lines={consoleLines} speed={22} linePause={520} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-500">
          <ArrowDown className="h-4 w-4 animate-bounce text-white" />
          desliza para ver lo que sé hacer
        </div>
      </div>
    </section>
  );
}

export function Ticker() {
  const group = (copy: number) => (
    <div className="marquee-group" aria-hidden={copy === 1 ? undefined : true}>
      {ticker.map((t) => (
        <span
          key={`${copy}-${t}`}
          className="flex shrink-0 items-center gap-8 font-display text-[0.92rem] font-bold uppercase tracking-[0.08em] text-zinc-300"
        >
          {t}
          <span className="text-white/30">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee-shell glass relative border-y border-white/10 py-3.5">
      <div className="mask-fade-x flex overflow-hidden">
        <div className="marquee-track anim-marquee">
          {group(1)}
          {group(2)}
        </div>
      </div>
    </div>
  );
}
