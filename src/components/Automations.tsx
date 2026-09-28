import { cn } from "@/utils/cn";
import { automations, type AutomationId } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./About";
import { ChatbotDemo } from "./demos/ChatbotDemo";
import { CallDemo } from "./demos/CallDemo";
import { SupportDemo } from "./demos/SupportDemo";
import { BookingDemo } from "./demos/BookingDemo";
import { Bolt, Chat, Cpu, Inbox, Calendar } from "./icons";

const iconFor: Record<AutomationId, typeof Chat> = {
  chatbot: Chat,
  voz: Cpu,
  soporte: Inbox,
  citas: Calendar,
};

export function Automations({
  active,
  onSelect,
}: {
  active: AutomationId;
  onSelect: (id: AutomationId) => void;
}) {
  const current = automations.find((a) => a.id === active)!;
  const Icon = iconFor[active];

  return (
    <section
      id="automatizacion"
      className="noise-layer relative overflow-x-clip bg-black py-24 text-zinc-200 sm:py-32"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="anim-float pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_65%)] blur-3xl" />
      <div
        className="anim-float pointer-events-none absolute -right-32 top-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)] blur-3xl"
        style={{ animationDelay: "-5s" }}
      />

      <div className="relative mx-auto max-w-[86rem] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionEyebrow n="03" label="Automatización con IA" />
            <h2 className="mt-6 font-display text-[clamp(2.3rem,6vw,4.8rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-white">
              Agentes que trabajan
              <br />
              <span className="swash text-zinc-400">mientras tú no estás.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="text-[1.02rem] leading-relaxed text-zinc-400">
              Chatbots, agentes de llamadas, atención al cliente y reservas. Cuatro sistemas que
              construyo para negocios reales y que aquí puedes probar tú mismo: cada uno está
              explicado por partes y tiene al lado un ejemplo vivo, con conversaciones y llamadas
              simuladas. Los datos son genéricos y ficticios: la idea es que veas cómo funciona, no
              a quién se lo hice.
            </p>
          </Reveal>
        </div>

        {/* Selector con botones de cristal */}
        <Reveal delay={80} className="mt-12">
          <div className="mb-2 flex items-center gap-1.5 lg:hidden">
            <span className="swipe-hint text-white">→</span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-zinc-500">
              Desliza para ver todas las opciones
            </span>
          </div>
          <div className="swipe-wrap rounded-full">
          <div className="glass swipe-x flex gap-2 rounded-full p-1.5">
            {automations.map((a) => {
              const Ai = iconFor[a.id];
              const on = a.id === active;
              return (
                <button
                  key={a.id}
                  onClick={() => onSelect(a.id)}
                  className={cn(
                    "group flex shrink-0 items-center gap-3 rounded-full px-5 py-3 transition-all duration-300",
                    on
                      ? "glass-pill-active"
                      : "text-zinc-400 hover:bg-white/[0.05] hover:text-white",
                  )}
                >
                  <Ai className={cn("h-4 w-4", on ? "text-white" : "text-zinc-400 group-hover:text-white")} />
                  <span className="font-display text-[0.92rem] font-bold tracking-tight">
                    {a.title}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[0.56rem] tracking-[0.16em]",
                      on ? "text-zinc-300" : "text-zinc-600",
                    )}
                  >
                    {a.n}
                  </span>
                </button>
              );
            })}
          </div>
          </div>
        </Reveal>

        {/* Explicación + demo */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div key={current.id} className="anim-pop lg:sticky lg:top-28">
              <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-zinc-300">
                <Icon className="h-3.5 w-3.5 text-white" />
                {current.tagline}
              </span>
              <h3 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1] tracking-[-0.04em] text-white">
                {current.title}
              </h3>
              <p className="mt-4 text-[1rem] leading-relaxed text-zinc-400">{current.text}</p>

              <p className="mt-9 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-zinc-400">
                <Bolt className="h-3.5 w-3.5 text-white" />
                Cómo funciona, parte por parte
              </p>

              <ol className="mt-5">
                {current.parts.map((p, i) => (
                  <li key={p.title} className="group relative flex gap-4 pb-6 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <span className="glass grid h-8 w-8 shrink-0 place-items-center rounded-xl font-mono text-[0.62rem] font-bold text-white transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                        {i + 1}
                      </span>
                      {i < current.parts.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-gradient-to-b from-white/20 to-white/5" />
                      )}
                    </div>
                    <div className="-mt-0.5">
                      <h4 className="font-display text-[1.05rem] font-bold tracking-tight text-white transition-colors group-hover:text-zinc-300">
                        {p.title}
                      </h4>
                      <p className="mt-1 text-[0.9rem] leading-relaxed text-zinc-400">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="glass mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl">
                {/* Métricas clave de esta automatización */}
                {current.metrics.map((m) => (
                  <div key={m.label} className="bg-black/40 p-4">
                    <p className="font-display text-xl font-extrabold tracking-tight text-white">
                      {m.value}
                    </p>
                    <p className="mt-1 font-mono text-[0.52rem] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* La demo va antes que la explicación en móvil: se puede probar al instante */}
          <div className="order-first mx-auto w-full max-w-[26rem] min-w-0 lg:order-none lg:col-span-7 lg:mx-0 lg:max-w-none">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-400">
                  Ejemplo interactivo · pruébalo tú
                </p>
                <p className="hidden items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-300 sm:flex">
                  {current.demoLabel}
                </p>
              </div>
              <div key={`demo-${current.id}`} className="anim-pop w-full min-w-0">
                {current.id === "chatbot" && <ChatbotDemo />}
                {current.id === "voz" && <CallDemo />}
                {current.id === "soporte" && <SupportDemo />}
                {current.id === "citas" && <BookingDemo />}
              </div>
              <p className="mt-3 font-mono text-[0.56rem] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
                simulación con datos genéricos y ficticios · así se ve y se siente el sistema real
                funcionando
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
