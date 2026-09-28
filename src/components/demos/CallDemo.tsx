import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { nichesData, type NicheId } from "@/data/niches";
import { Check, Phone, PhoneOff, Spark } from "../icons";

type Status = "idle" | "dialing" | "live" | "ended";

export function CallDemo() {
  const [selectedNiche, setSelectedNiche] = useState<NicheId>("salud");
  const niche = nichesData[selectedNiche];

  const [status, setStatus] = useState<Status>("idle");
  const [lines, setLines] = useState<{ who: "agente" | "cliente"; text: string; id: number }[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const timers = useRef<number[]>([]);
  const tick = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (tick.current) window.clearInterval(tick.current);
    tick.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => clearAll, []);

  // Al cambiar de nicho, reiniciar la llamada
  useEffect(() => {
    clearAll();
    setStatus("idle");
    setLines([]);
    setSeconds(0);
  }, [selectedNiche]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  // Síntesis de voz opcional (Web Speech API)
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-ES";
      u.rate = 1.05;
      window.speechSynthesis.speak(u);
    } catch {
      /* Silently ignore */
    }
  };

  const startCall = () => {
    clearAll();
    setLines([]);
    setSeconds(0);
    setStatus("dialing");

    // Sonido de marcación o transición
    timers.current.push(
      window.setTimeout(() => {
        setStatus("live");
        tick.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
      }, 2000),
    );

    let acc = 2400;
    niche.call.script.forEach((line, i) => {
      const speakDuration = Math.max(2200, 700 + line.text.length * 45);
      timers.current.push(
        window.setTimeout(() => {
          setLines((prev) => [...prev, { ...line, id: i }]);
          if (line.who === "agente") {
            speakText(line.text);
          }
        }, acc),
      );
      acc += speakDuration;
    });

    timers.current.push(
      window.setTimeout(() => {
        setStatus("ended");
        if (tick.current) window.clearInterval(tick.current);
        tick.current = null;
      }, acc + 1000),
    );
  };

  const hangUp = () => {
    clearAll();
    setStatus("ended");
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      {/* Selector de nicho para la llamada */}
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-400">
            Escenario de llamada según sector:
          </span>
          <span className="swipe-hint text-white">→</span>
        </div>
        <div className="swipe-wrap">
          <div className="swipe-x flex gap-1.5 pb-1">
            {(Object.keys(nichesData) as NicheId[]).map((nid) => {
              const item = nichesData[nid];
              const on = nid === selectedNiche;
              return (
                <button
                  key={nid}
                  onClick={() => setSelectedNiche(nid)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] transition-all",
                    on
                      ? "bg-accent text-white font-bold shadow-[0_0_18px_rgba(59,123,246,0.5)]"
                      : "glass text-zinc-400 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interfaz de Smartphone en Modo Llamada (iOS / Android Dark Theme) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Móvil / Teléfono */}
        <div className="mx-auto w-full max-w-[19rem] lg:col-span-6 sm:max-w-sm">
          <div className="relative overflow-hidden rounded-[1.6rem] border-2 border-[#222] bg-[#000000] p-3.5 shadow-[0_30px_90px_rgba(0,0,0,0.95)] ring-1 ring-white/15 sm:rounded-[2.5rem] sm:border-4 sm:p-6">
            {/* Altavoz frontal / notch superior del móvil */}
            <div className="mx-auto mb-4 hidden h-4 w-28 items-center justify-center rounded-full bg-[#151515] sm:mb-6 sm:flex">
              <div className="h-1.5 w-10 rounded-full bg-[#333]" />
            </div>

            {/* Pantalla principal de la llamada */}
            <div className="flex flex-col items-center text-center">
              {/* Avatar grande del contacto / empresa */}
              <div className="relative my-2">
                {status === "live" && (
                  <div className="absolute inset-0 rounded-full bg-white/15 animate-ping" />
                )}
                <div
                  className={cn(
                    "relative grid h-20 w-20 place-items-center rounded-full text-2xl font-bold font-display text-white shadow-2xl transition-all duration-500 sm:h-24 sm:w-24 sm:text-3xl",
                    status === "live"
                      ? "ring-4 ring-white/40 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                      : "bg-[#1c1c1e]",
                    niche.avatarBg,
                  )}
                >
                  {niche.avatarText}
                </div>
              </div>

              {/* Nombre y datos del llamante */}
              <p className="mt-3 font-display text-xl font-bold tracking-tight text-white">
                {niche.companyName}
              </p>
              <p className="font-mono text-[0.68rem] text-zinc-400 mt-0.5">
                {niche.call.callerNumber} · Agente de Voz IA
              </p>

              {/* Estado / Temporizador */}
              <p className="mt-2 font-mono text-xs tracking-widest text-zinc-300">
                {status === "idle" && "Listo para llamar"}
                {status === "dialing" && "Llamando..."}
                {status === "live" && <span className="text-[#30d158] font-bold">EN LLAMADA · {mmss}</span>}
                {status === "ended" && "Llamada finalizada"}
              </p>

              {/* Ecualizador de ondas en llamada activa */}
              <div className="my-4 flex h-9 items-center justify-center gap-0.5 sm:gap-1">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-1 rounded-full transition-all duration-300",
                      status === "live" ? "eq-bar bg-white" : "bg-[#2c2c2e]",
                    )}
                    style={{
                      height: status === "live" ? `${14 + ((i * 43) % 22)}px` : "4px",
                      animationDelay: `${(i % 6) * 0.12}s`,
                    }}
                  />
                ))}
              </div>

              {/* Teclado de funciones estilo iOS (Silenciar, Teclado, Altavoz, etc.) */}
              <div className="my-2 grid grid-cols-3 gap-1 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-full p-2.5 transition-colors sm:p-3",
                    isMuted ? "bg-white text-black" : "bg-[#1c1c1e] text-white hover:bg-[#2c2c2e]",
                  )}
                >
                  <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-[0.5rem] font-medium sm:text-[0.55rem]">Silenciar</span>
                </button>

                <button
                  type="button"
                  className="flex flex-col items-center gap-1 rounded-full bg-[#1c1c1e] p-3 text-white hover:bg-[#2c2c2e]"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span className="text-[0.55rem] font-medium">Teclado</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSpeaker(!isSpeaker)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-full p-3 transition-colors",
                    isSpeaker ? "bg-white text-black" : "bg-[#1c1c1e] text-white hover:bg-[#2c2c2e]",
                  )}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span className="text-[0.55rem] font-medium">Altavoz</span>
                </button>
              </div>

              {/* Botón principal de llamada / colgar */}
              <div className="mt-5 flex items-center justify-center gap-6">
                {status === "idle" || status === "ended" ? (
                  <button
                    onClick={startCall}
                    className="flex items-center gap-2 rounded-full bg-[#30d158] px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_30px_rgba(48,209,88,0.4)] transition-all hover:scale-105 active:scale-95"
                  >
                    <Phone className="h-5 w-5" />
                    {status === "ended" ? "Volver a llamar" : "Iniciar llamada"}
                  </button>
                ) : (
                  <button
                    onClick={hangUp}
                    className="flex items-center gap-2 rounded-full bg-[#ff453a] px-5 py-3 text-[0.82rem] font-bold text-white shadow-[0_0_30px_rgba(255,69,58,0.4)] transition-all hover:scale-105 active:scale-95 sm:px-8 sm:py-3.5 sm:text-sm"
                  >
                    <PhoneOff className="h-5 w-5" />
                    Colgar
                  </button>
                )}
              </div>

              {/* Toggle de voz con audio real */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-[0.58rem] uppercase tracking-wider transition-all",
                    soundEnabled
                      ? "bg-white text-black font-bold"
                      : "border border-white/20 text-zinc-400 hover:text-white",
                  )}
                >
                  🔊 Voz real por altavoz: {soundEnabled ? "ACTIVADA" : "SILENCIADA"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral: Transcripción oficial y Resumen automático con IA */}
        <div className="flex flex-col justify-between space-y-4 lg:col-span-6">
          {/* Ficha de la llamada */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-500">
                  Escenario
                </span>
                <p className="font-display text-base font-bold text-white">
                  {niche.call.scenarioTitle}
                </p>
              </div>
              <span className="glass rounded-full px-3 py-1 font-mono text-[0.52rem] uppercase tracking-[0.12em] text-zinc-300">
                {niche.call.targetContext}
              </span>
            </div>

            {/* Subtítulos / Transcripción en vivo */}
            <div className="mt-3">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-400 mb-2">
                Transcripción en tiempo real:
              </p>
              <div ref={scrollRef} className="demo-scroll h-44 space-y-2 overflow-y-auto pr-1">
                {lines.length === 0 && (
                  <p className="pt-10 text-center font-mono text-[0.65rem] text-zinc-500">
                    Pulsa «Iniciar llamada» para escuchar y ver la conversación.
                  </p>
                )}
                {lines.map((l) => (
                  <div
                    key={l.id}
                    className={cn(
                      "anim-pop flex items-start gap-2 text-[0.82rem] leading-relaxed",
                      l.who === "agente" ? "text-white" : "text-zinc-400",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.5rem] uppercase font-bold",
                        l.who === "agente" ? "bg-white text-black" : "bg-white/10 text-zinc-300",
                      )}
                    >
                      {l.who === "agente" ? "IA" : niche.call.targetPerson.split(" ")[0]}
                    </span>
                    <p className="flex-1">{l.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen generado automáticamente al finalizar */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white">
              <Spark className="h-4 w-4" />
              Resumen automático post-llamada (CRM & Calendario)
            </div>

            {status === "ended" ? (
              <div className="anim-pop mt-3 space-y-3">
                <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{niche.call.summary.title}</span>
                    <span className="text-[#30d158] font-mono text-[0.6rem]">{niche.call.summary.sentiment}</span>
                  </div>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-zinc-300">
                    {niche.call.summary.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-zinc-500">
                    Acciones disparadas en segundo plano:
                  </p>
                  {niche.call.summary.actions.map((act) => (
                    <div key={act} className="flex items-center gap-2 text-[0.75rem] text-zinc-200">
                      <Check className="h-3.5 w-3.5 text-white shrink-0" strokeWidth={2.5} />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[0.78rem] leading-relaxed text-zinc-500">
                Al colgar, la IA transcribe el 100% de la llamada, extrae los puntos clave, actualiza el
                CRM y manda las confirmaciones sin intervención humana.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
