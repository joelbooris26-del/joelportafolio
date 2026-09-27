import { useState } from "react";
import { cn } from "@/utils/cn";
import { sectors, type Sector } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./About";
import {
  ArrowRight,
  Bag,
  Bed,
  Book,
  Car,
  Chat,
  Chef,
  Code,
  Cpu,
  Docs,
  Dumbbell,
  Heart,
  Key,
  Scissors,
  Spark,
  Wrench,
} from "./icons";

const icons = {
  chef: Chef,
  heart: Heart,
  scissors: Scissors,
  bag: Bag,
  key: Key,
  tool: Wrench,
  dumbbell: Dumbbell,
  docs: Docs,
  bed: Bed,
  book: Book,
  car: Car,
  spark: Spark,
} as const;

export function Sectors({ onOpenDemo }: { onOpenDemo: () => void }) {
  const [active, setActive] = useState(0);
  const s: Sector = sectors[active];
  const Icon = icons[s.icon];

  return (
    <section
      id="sectores"
      className="noise-layer relative overflow-x-clip bg-black py-24 text-zinc-200 sm:py-32"
    >
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" />
      <div className="anim-float pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_65%)] blur-3xl" />
      <div
        className="anim-float pointer-events-none absolute -right-32 bottom-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)] blur-3xl"
        style={{ animationDelay: "-6s" }}
      />

      <div className="relative mx-auto max-w-[86rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionEyebrow n="05" label="Sectores" />
            <h2 className="mt-6 font-display text-[clamp(2.3rem,6vw,4.8rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-white">
              Me adapto a
              <br />
              <span className="swash text-zinc-400">cualquier negocio.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="text-[1.02rem] leading-relaxed text-zinc-400">
              No vendo paquetes cerrados ni soluciones de catálogo. Un restaurante no necesita lo
              mismo que una clínica, y una tienda no trabaja como un taller. Por eso empiezo siempre
              por lo mismo: entender cómo funciona tu negocio, dónde pierdes tiempo y qué te haría
              crecer. Después construyo exactamente eso —y solo eso.
            </p>
            <p className="mt-4 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.16em] text-zinc-300">
              Toca un sector y te cuento qué le construiría
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Lista de sectores */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              {sectors.map((sec, i) => {
                const Si = icons[sec.icon];
                const on = i === active;
                return (
                  <Reveal key={sec.name} delay={i * 35}>
                    <button
                      onClick={() => setActive(i)}
                      className={cn(
                        "glass-btn group flex h-full w-full items-center gap-3 rounded-xl p-3.5 text-left",
                        on && "glass-pill-active",
                      )}
                    >
                      <Si
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors duration-300",
                          on ? "text-white" : "text-zinc-500 group-hover:text-white",
                        )}
                      />
                      <span
                        className={cn(
                          "font-display text-[0.9rem] font-bold leading-tight tracking-tight transition-colors",
                          on ? "text-white" : "text-zinc-300 group-hover:text-white",
                        )}
                      >
                        {sec.name}
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-500">
              <span className="text-white">+12 sectores</span>
              <span>mismo método</span>
              <span>diseño a medida</span>
              <span className="text-zinc-400">trabajo en remoto y en Cádiz</span>
            </div>
          </div>

          {/* Detalle */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <div
                key={s.name}
                className="glass-card anim-pop overflow-hidden rounded-2xl"
              >
                <div className="flex items-start gap-5 border-b border-white/10 bg-white/[0.02] p-6 sm:p-8">
                  <span className="glass grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="font-mono text-[0.56rem] uppercase tracking-[0.22em] text-zinc-500">
                      Sector {String(active + 1).padStart(2, "0")} / {sectors.length}
                    </p>
                    <h3 className="mt-1.5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold leading-none tracking-[-0.04em] text-white">
                      {s.name}
                    </h3>
                    <p className="mt-3 font-chef text-[1.05rem] italic leading-snug text-zinc-300">
                      {s.pitch}
                    </p>
                  </div>
                </div>

                <div className="glass grid gap-px sm:grid-cols-2">
                  <div className="bg-black/40 p-6">
                    <p className="flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-white">
                      <Code className="h-3.5 w-3.5" /> En la web
                    </p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-300">{s.web}</p>
                  </div>
                  <div className="bg-black/40 p-6">
                    <p className="flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-white">
                      <Cpu className="h-3.5 w-3.5" /> Con IA
                    </p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-300">{s.ia}</p>
                  </div>
                </div>

                <div className="border-t border-white/10 p-6 sm:p-8">
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.22em] text-zinc-500">
                    Lo primero que resolvería
                  </p>
                  <ol className="mt-4 space-y-3">
                    {s.ideas.map((idea, i) => (
                      <li key={idea} className="group flex items-start gap-4">
                        <span className="mt-0.5 font-mono text-[0.66rem] text-zinc-500 transition-colors duration-300 group-hover:text-white">
                          0{i + 1}
                        </span>
                        <span className="text-[0.98rem] leading-relaxed text-zinc-300 transition-colors group-hover:text-white">
                          {idea}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                    <a
                      href="#contacto"
                      className="glass-btn-primary group inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold"
                    >
                      <Chat className="h-4 w-4" />
                      Cuéntame tu sector
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <button
                      onClick={onOpenDemo}
                      className="glass-btn inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
                    >
                      Ver un ejemplo funcionando
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquesina de sectores */}
      <div className="marquee-shell glass relative mt-16 border-x-0 border-y border-white/10 py-4">
        <div className="mask-fade-x flex overflow-hidden">
          <div className="marquee-track anim-marquee-slow">
            {[1, 2].map((copy) => (
              <div key={copy} className="marquee-group marquee-group-wide" aria-hidden={copy === 1 ? undefined : true}>
                {sectors.map((sec) => (
                  <span
                    key={`${copy}-${sec.name}`}
                    className="flex shrink-0 items-center gap-10 font-display text-[1.6rem] font-extrabold uppercase tracking-[-0.02em] text-zinc-600 transition-colors duration-300 hover:text-white sm:text-[2.2rem]"
                  >
                    {sec.name}
                    <span className="text-white/20">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
