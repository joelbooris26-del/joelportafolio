import { services, stats } from "@/data/content";
import { Eyebrow, FlowIcon, GlobeIcon, ChatIcon, MobileIcon, Reveal, SpotCard } from "./ui";
import { useEffect, useRef, useState } from "react";

const icons = [GlobeIcon, ChatIcon, FlowIcon, MobileIcon];

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setV(to);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        const dur = 1400;
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="tabular-nums">
      {v}
    </span>
  );
}

export function Services() {
  return (
    <section id="servicios" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <Eyebrow n="05" label="Qué puedo hacer por ti" />
            <h2 className="mt-6 font-display text-[clamp(2.2rem,6.2vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.04em] text-white">
              Cuatro formas
              <br />
              de <span className="text-gradient">trabajar juntos.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4">
            <p className="text-[1rem] leading-relaxed text-soft">
              Si tienes un negocio o una idea, estas son las cosas en las que puedo ayudarte.
              Siempre empiezo escuchando y enseñando algo que se pueda probar.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {services.map((s, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={s.n} delay={i * 80}>
                <SpotCard className="group h-full p-7 sm:p-9">
                  <div className="relative flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-lime transition-all duration-500 group-hover:rotate-6 group-hover:border-lime/60 group-hover:bg-lime/10">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="font-display text-[3.4rem] font-extrabold leading-none tracking-[-0.05em] text-white/[0.07] transition-colors duration-500 group-hover:text-lime/30">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="relative mt-8 font-display text-[1.5rem] font-extrabold leading-tight tracking-[-0.03em] text-white">
                    {s.title}
                  </h3>
                  <p className="relative mt-3 text-[0.97rem] leading-relaxed text-soft">{s.text}</p>
                  <div className="relative mt-6 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </SpotCard>
              </Reveal>
            );
          })}
        </div>

        {/* Cifras */}
        <Reveal delay={100} className="mt-16">
          <div className="panel grid gap-px overflow-hidden rounded-3xl !p-0 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-ink/70 p-7 transition-colors hover:bg-lime/[0.04]">
                <p className="font-display text-[clamp(2.8rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.05em] text-lime">
                  <CountUp to={s.value} />
                  {s.suffix}
                </p>
                <p className="mt-3 max-w-[16rem] text-[0.9rem] leading-snug text-soft">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
