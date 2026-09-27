import { bioParagraphs, getAge, howIWork, profile, timeline } from "@/data/site";
import { Reveal } from "./Reveal";
import { Bolt, Leaf } from "./icons";

export function About() {
  return (
    <section
      id="sobre-mi"
      className="noise-layer relative overflow-x-clip bg-black py-24 text-zinc-200 sm:py-32"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="anim-float pointer-events-none absolute -right-24 top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_65%)] blur-3xl" />
      <div
        className="anim-float pointer-events-none absolute -left-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)] blur-3xl"
        style={{ animationDelay: "-6s" }}
      />

      <div className="relative mx-auto max-w-[86rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <SectionEyebrow n="01" label="Sobre mí" />
            <h2 className="mt-6 font-display text-[clamp(2.4rem,6.4vw,5.2rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-white">
              Empecé por
              <br />
              curiosidad.
              <span className="swash text-zinc-400"> Sigo por oficio.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4">
            <div className="glass rounded-2xl p-5 font-mono text-[0.72rem] uppercase leading-loose tracking-[0.14em] text-zinc-400">
              {profile.alias} — {profile.fullName}
              <br />
              {profile.city}, {profile.region}
              <br />
              <span className="text-white">
                {getAge()} años · autodidacta desde los 14
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Biografía */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="space-y-6 text-[1.05rem] leading-[1.78] text-zinc-300">
                {bioParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.2rem] first-letter:font-extrabold first-letter:leading-[0.72] first-letter:text-white"
                        : undefined
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100} className="mt-10">
              <figure className="glass-card relative rounded-2xl p-7">
                <blockquote className="font-chef text-[1.4rem] italic leading-snug text-white">
                  «La tecnología no debería quitar tiempo: debería devolverlo. Eso es lo que intento
                  construir en cada proyecto.»
                </blockquote>
                <figcaption className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-500">
                  {profile.alias} · {profile.city}
                </figcaption>
              </figure>
            </Reveal>

            {/* Cómo trabajo */}
            <div className="mt-14">
              <Reveal>
                <h3 className="font-mono text-[0.66rem] uppercase tracking-[0.24em] text-zinc-500">
                  Cómo trabajo
                </h3>
              </Reveal>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {howIWork.map((w, i) => (
                  <Reveal key={w.title} delay={i * 80} className="h-full">
                    <div className="glass-btn group h-full rounded-2xl p-6 text-left">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[0.62rem] tracking-[0.18em] text-zinc-400">
                          0{i + 1}
                        </span>
                        <h4 className="font-display text-lg font-bold tracking-tight text-white">
                          {w.title}
                        </h4>
                      </div>
                      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-zinc-400">
                        {w.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Línea de tiempo */}
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-28">
              <div className="glass-card rounded-2xl p-7">
                <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-zinc-400">
                  <Bolt className="h-4 w-4 text-white" />
                  Línea de tiempo
                </div>
                <ol className="mt-7">
                  {timeline.map((t, i) => (
                    <li key={t.title} className="relative flex gap-5 pb-8 last:pb-0">
                      <div className="relative flex flex-col items-center">
                        <span
                          className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors ${
                            i === timeline.length - 1
                              ? "border-white bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                              : "border-white/30 bg-black"
                          }`}
                        />
                        {i < timeline.length - 1 && (
                          <span className="mt-1 w-px flex-1 bg-gradient-to-b from-white/20 to-white/5" />
                        )}
                      </div>
                      <div className="group -mt-0.5 pb-1">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-400">
                          {t.year}
                        </p>
                        <h4 className="mt-1.5 font-display text-[1.08rem] font-bold leading-snug tracking-tight text-white">
                          {t.title}
                        </h4>
                        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-zinc-400">{t.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-6">
                  <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <p className="text-[0.85rem] leading-relaxed text-zinc-400">
                    Todo lo que sé lo he aprendido buscando por mi cuenta. Cada proyecto nuevo
                    empieza igual: una pregunta y muchas horas hasta responderla bien.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionEyebrow({ n = "01", label = "Sobre mí" }: { n?: string; label?: string }) {
  return (
    <div className="glass inline-flex items-center gap-3 rounded-full px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-zinc-300">
      <span className="text-white font-bold">{n}</span>
      <span className="h-3 w-px bg-white/20" />
      {label}
    </div>
  );
}
