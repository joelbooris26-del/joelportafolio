import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./About";
import { Mobile } from "./icons";

/** Anuncio breve: el detalle de la app se compartirá cuando esté lista. */
export function Apps() {
  return (
    <section
      id="apps"
      className="noise-layer relative overflow-x-clip bg-zinc-950 py-24 text-zinc-200 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-45" />
        <div className="anim-float absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[86rem] px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <SectionEyebrow n="04" label="Apps móviles" />
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,6.8vw,5.4rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-white">
              Estoy creando una
              <br />
              <span className="swash text-zinc-300">app móvil.</span>
            </h2>
            <p className="mt-7 max-w-xl text-[1.08rem] leading-relaxed text-zinc-400">
              Es el siguiente proyecto en el que estoy trabajando. Próximamente compartiré más
              información, avances y todo lo que podrá hacer.
            </p>
            <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-500">
              En desarrollo · más información próximamente
            </p>
          </Reveal>

          <Reveal delay={120} className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative">
              <div className="anim-float absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_65%)] blur-2xl" />
              <div className="relative rounded-[2.5rem] border border-white/15 bg-black p-3 shadow-[0_40px_90px_-35px_rgba(0,0,0,1)]">
                <div className="relative grid h-[22rem] w-[11rem] place-items-center overflow-hidden rounded-[1.9rem] border border-white/10 bg-zinc-950">
                  <div className="bg-grid absolute inset-0 opacity-25" />
                  <span className="absolute top-3 h-4 w-20 rounded-full bg-black ring-1 ring-white/10" />
                  <div className="relative text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                      <Mobile className="h-7 w-7" />
                    </span>
                    <p className="mt-5 font-display text-xl font-bold tracking-tight text-white">
                      Próximamente
                    </p>
                    <p className="mt-2 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-zinc-500">
                      app en desarrollo
                    </p>
                  </div>
                  <span className="absolute bottom-5 h-1 w-20 rounded-full bg-white/30" />
                </div>
              </div>
              <span className="glass absolute -left-8 top-16 hidden rotate-[-7deg] rounded-lg px-3 py-1.5 font-mono text-[0.54rem] uppercase tracking-[0.16em] text-zinc-300 lg:block">
                en proceso
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}