import { useState } from "react";
import { cn } from "@/utils/cn";
import { demos, type DemoId } from "@/data/content";
import { DemoModal } from "./DemoModal";
import { ProjectArt } from "./ProjectArt";
import { ArrowRight, Check, Eyebrow, Reveal, SpotCard } from "./ui";
import { CallDemo } from "./demos/CallDemo";
import { ChatbotDemo } from "./demos/ChatbotDemo";
import { BookingDemo } from "./demos/BookingDemo";
import { SupportDemo } from "./demos/SupportDemo";
import { RestaurantDemo } from "./restaurant/RestaurantDemo";

/* ── Sección: elegir una demo ───────────────────────────────────────────── */
export function Demos({ onOpen, onContact }: { onOpen: (id: DemoId) => void; onContact: () => void }) {
  return (
    <section id="demos" className="noise relative overflow-x-clip bg-panel/40 py-24 sm:py-32">
      <div className="dots-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="drift pointer-events-none absolute -left-24 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(200,255,62,0.09),transparent_65%)] blur-3xl" />

      <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <Eyebrow n="02" label="Demos" />
            <h2 className="mt-6 font-display text-[clamp(2.2rem,6.2vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.04em] text-white">
              No te lo cuento.
              <br />
              <span className="text-gradient">Pruébalo.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4">
            <p className="text-[1rem] leading-relaxed text-soft">
              Elige una demo, entra y juega con ella como lo haría un cliente tuyo. Es una
              simulación con datos ficticios y nada de lo que escribas sale de tu navegador.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {demos.map((d, i) => (
            <Reveal key={d.id} delay={i * 90}>
              <SpotCard className="group flex h-full flex-col p-6 sm:p-7">
                <div
                  className="relative h-36 overflow-hidden rounded-2xl border border-white/[0.07] bg-ink/70"
                  style={{ boxShadow: `inset 0 0 60px ${d.accent}14` }}
                >
                  <div className="grid-bg absolute inset-0 opacity-50" />
                  <div className="relative h-full p-3 transition-transform duration-700 group-hover:scale-105">
                    <ProjectArt art={d.art} accent={d.accent} />
                  </div>
                </div>

                <p className="relative mt-6 font-mono text-[0.62rem] uppercase tracking-[0.22em]" style={{ color: d.accent }}>
                  Demo {String(i + 1).padStart(2, "0")} · funcional
                </p>
                <h3 className="relative mt-2 font-display text-[1.5rem] font-extrabold leading-tight tracking-[-0.03em] text-white">
                  {d.title}
                </h3>
                <p className="relative mt-2 text-[0.95rem] leading-relaxed text-soft">{d.tagline}</p>

                <ul className="relative mt-5 space-y-2.5">
                  {d.tries.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-[0.88rem] leading-snug text-mute">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="text-soft">{t}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto pt-7">
                  <button
                    onClick={() => onOpen(d.id)}
                    className="btn-lime group/btn w-full justify-center px-6 py-4 text-sm"
                  >
                    {d.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </SpotCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-10">
          <div className="panel flex flex-col items-start justify-between gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-display text-[1.2rem] font-bold tracking-tight text-white sm:text-[1.4rem]">
                ¿Te imaginas esto funcionando en tu negocio?
              </p>
              <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-soft">
                Lo adapto a tu sector, tus servicios y tu forma de atender. Cuéntame tu caso y te
                respondo en menos de 24 horas.
              </p>
            </div>
            <button onClick={onContact} className="btn-lime group shrink-0 px-7 py-4 text-sm">
              Hablemos
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Recepcionista de WhatsApp: chat + agenda + bandeja ─────────────────── */
type WaTab = "chat" | "agenda" | "bandeja";

const waTabs: { id: WaTab; label: string; hint: string }[] = [
  { id: "chat", label: "Chat de WhatsApp", hint: "Escribe como un cliente" },
  { id: "agenda", label: "Agenda de reservas", hint: "Los huecos reales" },
  { id: "bandeja", label: "Bandeja de mensajes", hint: "Cómo los clasifica la IA" },
];

function WhatsAppSuite() {
  const [tab, setTab] = useState<WaTab>("chat");
  return (
    <div>
      <div className="swipe-wrap rounded-full">
        <div className="swipe-x flex gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5">
          {waTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-left transition-all",
                tab === t.id ? "bg-lime text-ink" : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <span className="block font-display text-[0.9rem] font-bold tracking-tight">{t.label}</span>
              <span className={cn("block font-mono text-[0.54rem] uppercase tracking-[0.14em]", tab === t.id ? "text-ink/60" : "text-zinc-500")}>
                {t.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div key={tab} className="pop mt-6">
        {tab === "chat" && <ChatbotDemo initialNiche="restaurante" />}
        {tab === "agenda" && <BookingDemo initialNiche="restaurante" />}
        {tab === "bandeja" && <SupportDemo />}
      </div>
    </div>
  );
}

/* ── Contenedor de todas las demos ──────────────────────────────────────── */
export function DemoHost({
  demo,
  onClose,
  onContact,
}: {
  demo: DemoId | null;
  onClose: () => void;
  onContact: () => void;
}) {
  const info = (id: DemoId) => demos.find((d) => d.id === id)!;

  return (
    <>
      <DemoModal
        open={demo === "llamadas"}
        onClose={onClose}
        onContact={onContact}
        title={info("llamadas").title}
        accent={info("llamadas").accent}
      >
        <CallDemo initialNiche="salud" />
      </DemoModal>

      <DemoModal
        open={demo === "whatsapp"}
        onClose={onClose}
        onContact={onContact}
        title={info("whatsapp").title}
        accent={info("whatsapp").accent}
      >
        <WhatsAppSuite />
      </DemoModal>

      {/* La web de ejemplo es una página completa con su propia ventana */}
      <RestaurantDemo open={demo === "web"} onClose={onClose} onContact={onContact} />
    </>
  );
}
