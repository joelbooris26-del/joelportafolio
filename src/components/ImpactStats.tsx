import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { Bolt, Chart, Check, Clock, Star, Users } from "./icons";

/* ── Contador que sube al entrar en pantalla ─────────────────────────────── */
function useCountUp(target: number, decimals = 0) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setValue(target);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const duration = 1500;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(target * eased);
            if (p < 1) requestAnimationFrame(step);
            else setValue(target);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return { ref, display: value.toFixed(decimals) };
}

function StatNumber({
  prefix = "",
  target,
  decimals = 0,
  suffix = "",
}: {
  prefix?: string;
  target: number;
  decimals?: number;
  suffix?: string;
}) {
  const { ref, display } = useCountUp(target, decimals);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const stats = [
  {
    icon: Clock,
    prefix: "",
    target: 24,
    suffix: "/7",
    decimals: 0,
    label: "Atención sin descanso",
    note: "Respondes a tus clientes también de noche y en festivos.",
  },
  {
    icon: Bolt,
    prefix: "<",
    target: 2,
    suffix: " s",
    decimals: 0,
    label: "Respuesta al instante",
    note: "El cliente no espera: cada mensaje se contesta al momento.",
  },
  {
    icon: Users,
    prefix: "+",
    target: 30,
    suffix: " %",
    decimals: 0,
    label: "Más reservas y citas",
    note: "Recuperas las que se perdían fuera de tu horario de atención.",
  },
  {
    icon: Chart,
    prefix: "−",
    target: 70,
    suffix: " %",
    decimals: 0,
    label: "Menos tareas repetidas",
    note: "La IA se ocupa de lo mecánico; tú, de lo que importa.",
  },
];

const promises = [
  "Recuperas las llamadas y mensajes que hoy se pierden",
  "Dejas de repetir la misma respuesta veinte veces al día",
  "Tu web trabaja para venderte mientras tú atiendes tu negocio",
  "Tu marca transmite seriedad desde el primer clic",
];

export function ImpactStats() {
  return (
    <section className="noise-layer relative overflow-hidden border-y border-white/10 bg-zinc-950 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-35" />
        <div className="anim-float absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[86rem] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-300">
            <Star className="h-3.5 w-3.5 text-white" />
            Lo que gana tu negocio
          </span>
          <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
            No vendo webs ni bots.
            <br />
            <span className="swash text-zinc-300">Vendo tiempo y clientes.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[1rem] leading-relaxed text-zinc-400">
            Toda esta tecnología tiene un único objetivo: que tu negocio atienda mejor, venda más y
            te quite trabajo de encima. Estos son los resultados que persigo en cada proyecto.
          </p>
        </Reveal>

        {/* Cifras animadas */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="group h-full bg-black/60 p-7 backdrop-blur-xl transition-colors duration-400 hover:bg-white/[0.05]">
                <s.icon className="h-6 w-6 text-white transition-transform duration-400 group-hover:-translate-y-0.5" />
                <p className="mt-5 font-display text-[clamp(2.6rem,5vw,3.4rem)] font-extrabold leading-none tracking-tight text-white">
                  <StatNumber
                    prefix={s.prefix}
                    target={s.target}
                    decimals={s.decimals}
                    suffix={s.suffix}
                  />
                </p>
                <p className="mt-3 font-display text-[1.05rem] font-bold tracking-tight text-white">
                  {s.label}
                </p>
                <p className="mt-1.5 text-[0.86rem] leading-relaxed text-zinc-400">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Promesas concretas */}
        <Reveal delay={120} className="mt-8">
          <div className="glass-card grid gap-x-8 gap-y-4 rounded-2xl p-6 sm:grid-cols-2 sm:p-8">
            {promises.map((p) => (
              <div key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-black">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <p className="text-[0.95rem] leading-snug text-zinc-200">{p}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160} className="mt-6 text-center">
          <p className="font-mono text-[0.56rem] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
            * Estimaciones basadas en el impacto habitual de estas soluciones. Tu resultado depende
            de tu negocio, y por eso cada proyecto se diseña a medida.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
