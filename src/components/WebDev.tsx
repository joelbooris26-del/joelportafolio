import { demoChecklist, webCapabilities, webStack } from "@/data/site";
import { restaurant as rest } from "@/data/restaurant";
import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./About";
import { ArrowRight, Check, Code } from "./icons";

export function WebDev({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <section id="web" className="noise-layer relative overflow-x-clip bg-black py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="bg-dots absolute inset-0 opacity-20" />
        <div className="anim-float absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_65%)] blur-3xl" />
        <div
          className="anim-float absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)] blur-3xl"
          style={{ animationDelay: "-5s" }}
        />
      </div>

      <div className="relative mx-auto max-w-[86rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <SectionEyebrow n="02" label="Desarrollo web a medida" />
            <h2 className="mt-6 font-display text-[clamp(2.3rem,6vw,4.8rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-white">
              Webs que no parecen
              <br />
              de plantilla,{" "}
              <span className="swash text-zinc-300">porque no lo son</span>.
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4">
            <p className="text-[1.02rem] leading-relaxed text-zinc-400">
              Cada negocio habla de una forma distinta, vende de otra y atiende a su manera. Por eso
              construyo cada página desde cero: estructura, diseño, textos y funciones pensadas para
              ese proyecto concreto. Nada de temas comprados ni de soluciones que se le caen encima a
              quien las usa.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Capacidades */}
          <div className="lg:col-span-5">
            <Reveal>
              <h3 className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-zinc-500">
                Lo que incluye cada proyecto
              </h3>
            </Reveal>
            <ul className="mt-6 border-t border-white/10">
              {webCapabilities.map((c, i) => (
                <li key={c.n} className="border-b border-white/10">
                  <Reveal
                    delay={i * 70}
                    className="group relative py-6 transition-colors duration-400 hover:bg-white/[0.02]"
                  >
                    <div className="flex items-start gap-5">
                      <span className="mt-1 font-mono text-[0.68rem] tracking-[0.16em] text-zinc-400 transition-transform duration-400 group-hover:-translate-y-0.5">
                        {c.n}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-display text-[1.3rem] font-bold tracking-tight text-white transition-colors group-hover:text-zinc-300">
                          {c.title}
                        </h4>
                        <p className="mt-2 max-w-md text-[0.94rem] leading-relaxed text-zinc-400">
                          {c.text}
                        </p>
                      </div>
                      <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-zinc-500 opacity-0 transition-all duration-400 group-hover:translate-x-1 group-hover:text-white group-hover:opacity-100" />
                    </div>
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-white to-transparent transition-all duration-500 group-hover:w-full" />
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal delay={120} className="mt-8">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-zinc-500">
                Stack habitual
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {webStack.map((s) => (
                  <span
                    key={s}
                    className="glass rounded-xl px-3 py-1.5 font-mono text-[0.64rem] text-zinc-300 transition-all duration-300 hover:border-white/30 hover:text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Vista previa de la demo */}
          <div className="lg:col-span-7">
            <Reveal delay={80} className="lg:sticky lg:top-24">
              <button onClick={onOpenDemo} className="group block w-full text-left">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-3xl bg-white/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="glass-card relative overflow-hidden rounded-2xl p-2.5 transition-transform duration-500 group-hover:-translate-y-1.5">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <span className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
                      </span>
                      <span className="glass flex-1 truncate rounded-lg px-3 py-1 font-mono text-[0.6rem] text-zinc-400">
                        https://{rest.name.toLowerCase().replace(/\s+/g, "-")}.es
                      </span>
                      <span className="glass hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-zinc-300 sm:inline-flex">
                        <Code className="h-3 w-3 text-white" /> demo real
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-xl bg-zinc-950">
                      <img
                        src={rest.heroImage}
                        alt="Terraza del restaurante de la demo"
                        loading="lazy"
                        className="h-[clamp(15rem,30vw,25rem)] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-7">
                        <div>
                          <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-zinc-400">
                            Ejemplo completo · restaurante ficticio
                          </p>
                          <p className="mt-2 font-chef text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-none text-white">
                            {rest.name}
                          </p>
                          <p className="mt-2 text-sm text-zinc-300">
                            {rest.tagline} · {rest.city}
                          </p>
                        </div>
                        <span className="glass-btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition-all duration-300 group-hover:gap-3.5">
                          Abrir y probar
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              <div className="glass mt-7 rounded-2xl p-6">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-zinc-400">
                  Lo que puedes probar dentro
                </p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {demoChecklist.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-[0.9rem] text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" strokeWidth={2.4} />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-white/10 pt-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
                  Todo funciona de verdad: formularios validados, carta con filtros, horarios y un
                  asistente que responde. No se envía ningún dato fuera de tu navegador.
                </p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-zinc-400">
                  El restaurante es solo un ejemplo para que veas el nivel de acabado. El mismo
                  método sirve para cualquier negocio: lo que cambia es lo que tú necesitas.{" "}
                  <a
                    href="#sectores"
                    className="link-underline font-medium text-white transition-colors hover:text-zinc-300"
                  >
                    Ver los sectores con los que trabajo →
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
