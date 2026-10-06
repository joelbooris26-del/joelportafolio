import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { bioParagraphs, getAge, principles, profile, timeline } from "@/data/content";
import { Eyebrow, Reveal } from "./ui";

export function Story() {
  const listRef = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);

  // El progreso de la línea sigue al scroll, pero SOLO mientras la línea de tiempo está en pantalla:
  // el resto del tiempo no hay ningún trabajo ligado al scroll en esta sección.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let raf = 0;
    let listening = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight * 0.58;
      const v = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      // pasos de 1 %: evita repintar la sección en cada píxel que se mueve el scroll
      setP((prev) => (Math.abs(prev - v) >= 0.01 || v === 0 || v === 1 ? v : prev));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const attach = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    };
    const detach = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? attach() : detach()), { rootMargin: "160px 0px" });
    io.observe(el);
    return () => {
      io.disconnect();
      detach();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="historia" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="grid-bg fade-b pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8">
        <Reveal>
          <Eyebrow n="03" label="Mi historia" />
          <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,6.2vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.04em] text-white">
            Empecé por <span className="text-gradient">curiosidad.</span>
            <br />
            Sigo por oficio.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Biografía */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="space-y-5 text-[1.04rem] leading-[1.75] text-soft">
                {bioParagraphs.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100} className="mt-8">
              <div className="panel grid grid-cols-2 gap-px overflow-hidden rounded-2xl !p-0">
                {[
                  { k: "Edad", v: `${getAge()} años` },
                  { k: "Desde", v: "Los 14, autodidacta" },
                  { k: "Lugar", v: `${profile.city}` },
                  { k: "Provincia", v: `${profile.region}, ${profile.country}` },
                ].map((f) => (
                  <div key={f.k} className="bg-ink/60 p-4">
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-mute">{f.k}</p>
                    <p className="mt-1 text-[0.95rem] font-medium text-white">{f.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={160} className="mt-8">
              <div className="space-y-3">
                {principles.map((x) => (
                  <div key={x.k} className="flex items-start gap-4 border-b border-white/[0.07] pb-4 last:border-0">
                    <span className="font-mono text-[0.7rem] text-lime">{x.k}</span>
                    <div>
                      <p className="font-display text-[1rem] font-semibold tracking-tight text-white">{x.t}</p>
                      <p className="mt-1 text-[0.9rem] leading-relaxed text-mute">{x.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Línea de tiempo */}
          <div className="lg:col-span-6">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.26em] text-mute">Línea de tiempo</p>
            <ol ref={listRef} className="relative mt-8 pl-10 sm:pl-14">
              <span className="absolute bottom-2 left-[0.9rem] top-2 w-px bg-white/10 sm:left-[1.4rem]" />
              <span
                className="absolute left-[0.9rem] top-2 w-px origin-top bg-lime shadow-[0_0_12px_rgba(200,255,62,0.9)] sm:left-[1.4rem]"
                style={{ height: `calc((100% - 1rem) * ${p})` }}
              />
              {timeline.map((t, i) => {
                const on = p >= (i + 0.35) / timeline.length;
                const last = i === timeline.length - 1;
                return (
                  <li key={t.title} className="relative pb-12 last:pb-0">
                    <span
                      className={cn(
                        "absolute -left-10 top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 transition-all duration-500 sm:-left-14 sm:h-6 sm:w-6",
                        on
                          ? "border-lime bg-lime shadow-[0_0_20px_rgba(200,255,62,0.9)]"
                          : "border-white/20 bg-ink",
                      )}
                    >
                      {on && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
                    </span>
                    <div
                      className={cn(
                        "transition-all duration-500",
                        on ? "translate-x-0 opacity-100" : "translate-x-2 opacity-45",
                      )}
                    >
                      <p className={cn("font-mono text-[0.66rem] uppercase tracking-[0.24em]", on ? "text-lime" : "text-mute")}>
                        {t.when}
                      </p>
                      <h3 className="mt-2 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-white sm:text-[1.5rem]">
                        {t.title}
                      </h3>
                      <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-soft">{t.text}</p>
                      {last && (
                        <span className="chip mt-4 !border-lime/40 !text-lime">en camino</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
