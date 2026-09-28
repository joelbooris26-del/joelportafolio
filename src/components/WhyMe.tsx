import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./About";
import { ArrowRight, Check, Search, Spark } from "./icons";

const commitments = [
  {
    n: "01",
    title: "Me implico de verdad",
    text: "Antes de crear, escucho y entiendo cómo funciona tu negocio. El proyecto no empieza con una plantilla, sino con tus objetivos, tus clientes y los problemas que necesitas resolver.",
  },
  {
    n: "02",
    title: "Investigo antes de decidir",
    text: "Estudio tu sector, analizo referentes y comparo ideas de otros mercados para encontrar oportunidades que hagan tu proyecto más claro, útil y competitivo.",
  },
  {
    n: "03",
    title: "Trabajo más allá de lo mínimo",
    text: "No me conformo con que algo simplemente funcione. Pruebo alternativas, reviso cada detalle e invierto las horas necesarias para elevar el resultado antes de entregarlo.",
  },
  {
    n: "04",
    title: "Cuido tu inversión",
    text: "Busco ofrecer una relación honesta entre calidad, dedicación y precio. Cada función debe tener un propósito y aportar valor real; no añado costes ni complejidad que tu negocio no necesita.",
  },
];

export function WhyMe() {
  return (
    <section
      id="por-que-yo"
      className="noise-layer relative overflow-x-clip border-t border-white/10 bg-black py-24 text-zinc-200 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-35" />
        <div className="anim-float absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_65%)] blur-3xl" />
        <div
          className="anim-float absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)] blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      <div className="relative mx-auto max-w-[86rem] px-5 sm:px-8">
        <div className="grid gap-12 sm:gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Mensaje principal */}
          <div className="min-w-0 lg:col-span-6">
            <Reveal>
              <SectionEyebrow n="06" label="Mi compromiso" />
              <h2 className="mt-6 font-display text-[clamp(2.35rem,10vw,5.1rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-white">
                ¿Y por qué
                <br />
                <span className="swash text-zinc-300">elegirme a mí?</span>
              </h2>

              <p className="mt-6 max-w-xl text-[1rem] leading-[1.7] text-zinc-300 sm:mt-7 sm:text-[1.08rem]">
                Porque no me limito a entregar una web o una automatización que simplemente
                funciona. Me implico en entender tu empresa, estudiar tu mercado y construir una
                solución pensada para ayudarte a atraer, atender y convertir mejor a tus clientes.
              </p>
              <p className="mt-4 max-w-xl text-[0.96rem] leading-[1.7] text-zinc-400 sm:mt-5 sm:text-[1rem]">
                Cuando llegamos a un acuerdo, asumo el proyecto como una responsabilidad real. Busco
                ideas, pruebo alternativas y dedico tiempo a pulir cada parte hasta conseguir un
                resultado del que los dos podamos sentirnos orgullosos.
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-9">
              <figure className="glass-card max-w-xl rounded-2xl p-6 sm:p-7">
                <Spark className="h-5 w-5 text-white" />
                <blockquote className="mt-4 font-chef text-[1.3rem] italic leading-snug text-white">
                  «Mi objetivo no es hacer más por aparentar. Es dedicar más atención, más criterio y
                  más esfuerzo para que nunca te arrepientas de haber confiado en mí.»
                </blockquote>
                <figcaption className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-zinc-500">
                  Una colaboración, no una entrega rápida
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={160} className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 sm:mt-7 sm:gap-x-6 sm:gap-y-3">
              {["Comunicación clara", "Decisiones justificadas", "Sin plantillas", "Sin trabajo genérico"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-zinc-400"
                  >
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.6} />
                    {item}
                  </span>
                ),
              )}
            </Reveal>
          </div>

          {/* Compromisos concretos */}
          <div className="min-w-0 lg:col-span-6">
            <Reveal delay={80}>
              <div className="flex items-center gap-2 border-b border-white/10 pb-3.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-500 sm:pb-4 sm:text-[0.62rem]">
                <Search className="h-4 w-4 shrink-0 text-white" />
                <span>Lo que puedes esperar de mi trabajo</span>
              </div>
            </Reveal>

            <ol>
              {commitments.map((item, i) => (
                <li key={item.n} className="border-b border-white/10">
                  <Reveal
                    delay={120 + i * 70}
                    className="group relative flex gap-3.5 py-5 transition-colors duration-400 hover:bg-white/[0.025] sm:gap-5 sm:py-6"
                  >
                    <span className="glass grid h-9 w-9 shrink-0 place-items-center rounded-xl font-mono text-[0.6rem] font-bold text-zinc-300 transition-all duration-300 group-hover:bg-accent group-hover:text-white sm:mt-0.5 sm:h-10 sm:w-10 sm:text-[0.62rem]">
                      {item.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[1.1rem] font-bold leading-snug tracking-tight text-white sm:text-[1.25rem]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-zinc-400 sm:mt-2 sm:text-[0.94rem]">
                        {item.text}
                      </p>
                    </div>
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-white to-transparent transition-all duration-500 group-hover:w-full" />
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={180} className="mt-7 sm:mt-8">
              <div className="flex flex-col gap-4 rounded-2xl border border-white/12 bg-white/[0.035] p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6">
                <div className="min-w-0">
                  <p className="font-display text-[1.05rem] font-bold leading-snug tracking-tight text-white sm:text-[1.15rem]">
                    No quiero ser una opción más.
                  </p>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-zinc-400 sm:max-w-md sm:text-[0.88rem]">
                    Quiero que el resultado demuestre por qué confiar en alguien implicado marca la
                    diferencia.
                  </p>
                </div>
                <a
                  href="#contacto"
                  className="glass-btn-primary group inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-full px-5 py-3 text-[0.85rem] font-bold sm:w-auto sm:text-sm"
                >
                  Cuéntame tu proyecto
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}