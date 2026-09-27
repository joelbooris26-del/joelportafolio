import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { nichesData } from "@/data/niches";
import { ArrowLeft, Chat, Check, Inbox, Mail, Send, Spark, Star, Users } from "../icons";

type Canal = "Todos" | "WhatsApp" | "Email" | "Instagram" | "Web";

export function SupportDemo() {
  const allTickets = Object.values(nichesData).map((n) => ({
    nicheId: n.id,
    nicheLabel: n.label,
    company: n.companyName,
    ...n.supportTicket,
  }));

  const [activeCanal, setActiveCanal] = useState<Canal>("Todos");
  const [selectedTicketId, setSelectedTicketId] = useState(allTickets[0].id);
  const [tickets, setTickets] = useState(
    allTickets.map((t) => ({ ...t, status: "nuevo" as "nuevo" | "analizado" | "resuelto" | "escalado" })),
  );
  const [scanning, setScanning] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [stream, setStream] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  /* En móvil la bandeja se comporta como una app real: primero la lista de
     tickets y, al tocar uno, la vista cambia a su detalle. Cada pantalla entra
     entera, sin apilar lista + respuesta una debajo de otra. */
  const [mobileView, setMobileView] = useState<"inbox" | "ticket">("inbox");

  const shellRef = useRef<HTMLDivElement>(null);
  const streamTimer = useRef<number | null>(null);
  const timers = useRef<number[]>([]);

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 1024;

  const scrollToShell = (block: ScrollLogicalPosition = "start") => {
    if (!isMobile()) return;
    window.setTimeout(() => shellRef.current?.scrollIntoView({ behavior: "smooth", block }), 70);
  };

  const filteredTickets = tickets.filter(
    (t) => activeCanal === "Todos" || t.canal === activeCanal,
  );

  const current = tickets.find((t) => t.id === selectedTicketId) || filteredTickets[0] || tickets[0];
  const isAnalyzed = current?.status !== "nuevo";

  const openTicket = (id: string) => {
    setSelectedTicketId(id);
    setMobileView("ticket");
    scrollToShell("start");
  };

  const backToInbox = () => {
    setMobileView("inbox");
    scrollToShell("start");
  };

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      if (streamTimer.current) window.clearInterval(streamTimer.current);
    },
    [],
  );

  // Animación de redacción del borrador por IA
  useEffect(() => {
    if (streamTimer.current) window.clearInterval(streamTimer.current);
    if (!current || !isAnalyzed) {
      setStream("");
      setDraft("");
      return;
    }
    setStreaming(true);
    setStream("");
    const fullText = current.draft;
    let i = 0;
    streamTimer.current = window.setInterval(() => {
      i += 5;
      if (i >= fullText.length) {
        setStream(fullText);
        setDraft(fullText);
        setStreaming(false);
        if (streamTimer.current) window.clearInterval(streamTimer.current);
      } else {
        setStream(fullText.slice(0, i));
      }
    }, 12);

    return () => {
      if (streamTimer.current) window.clearInterval(streamTimer.current);
    };
  }, [selectedTicketId, isAnalyzed, current]);

  const analyzeOne = (id: string, delay = 0) => {
    setScanning(id);
    const t = window.setTimeout(() => {
      setTickets((prev) =>
        prev.map((item) =>
          item.id === id && item.status === "nuevo" ? { ...item, status: "analizado" } : item,
        ),
      );
      setScanning(null);
    }, delay + 800);
    timers.current.push(t);
  };

  const analyzeAll = () => {
    setMobileView("inbox");
    let delay = 0;
    tickets.forEach((t) => {
      if (t.status === "nuevo") {
        analyzeOne(t.id, delay);
        delay += 450;
      }
    });
  };

  const resolveTicket = (status: "resuelto" | "escalado", msg: string) => {
    setTickets((prev) => prev.map((item) => (item.id === current.id ? { ...item, status } : item)));
    setNotice(msg);
    // Al resolver volvemos a la bandeja: se ve el nuevo estado del ticket.
    backToInbox();
    timers.current.push(window.setTimeout(() => setNotice(null), 3200));
  };

  const canalIcons: Record<string, typeof Mail> = {
    WhatsApp: Chat,
    Email: Mail,
    Instagram: Star,
    Web: Inbox,
  };

  const openCount = tickets.filter((t) => t.status === "nuevo").length;
  const solvedCount = tickets.filter((t) => t.status === "resuelto").length;

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Filtros de canal: solo en la bandeja (móvil) o siempre (escritorio) */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3",
          mobileView === "ticket" && "hidden lg:flex",
        )}
      >
        <div className="w-full sm:w-auto">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-zinc-400 sm:text-[0.62rem]">
              Filtrar canal de entrada:
            </span>
            <span className="swipe-hint text-white">→</span>
          </div>
          <div className="swipe-wrap">
            <div className="swipe-x flex gap-1 pb-1">
              {(["Todos", "WhatsApp", "Email", "Instagram", "Web"] as Canal[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCanal(c)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 font-mono text-[0.56rem] uppercase tracking-wider transition-all",
                    activeCanal === c
                      ? "bg-white font-bold text-black"
                      : "glass text-zinc-400 hover:text-white",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={analyzeAll}
          className="glass-btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[0.72rem] font-bold sm:w-auto sm:text-xs"
        >
          <Spark className="h-3.5 w-3.5" />
          <span className="sm:hidden">Procesar bandeja con IA</span>
          <span className="hidden sm:inline">Procesar toda la bandeja con IA</span>
        </button>
      </div>

      {/* Aplicación Helpdesk */}
      <div
        ref={shellRef}
        className="overflow-hidden rounded-2xl border border-white/15 bg-[#0e0e10] shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
      >
        {/* Barra superior estilo Zendesk / Intercom */}
        <div className="flex flex-wrap items-center justify-between gap-y-1.5 border-b border-white/10 bg-[#141418] px-3.5 py-2.5 sm:px-5 sm:py-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="hidden h-3 w-3 gap-1 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
            </span>
            <span className="truncate font-mono text-[0.62rem] font-bold tracking-wider text-white sm:text-xs">
              {mobileView === "ticket" ? "VISTA DE TICKET" : "INBOX UNIFICADO · ATENCIÓN CON IA"}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[0.62rem] text-zinc-400 sm:gap-3 sm:text-xs">
            <span className="whitespace-nowrap">
              <span className="hidden sm:inline">Abiertos: </span>
              {openCount}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="whitespace-nowrap">
              <span className="hidden sm:inline">Resueltos: </span>
              {solvedCount}
            </span>
          </div>
        </div>

        {/* Cuerpo: dos columnas en escritorio, una vista en móvil */}
        <div className="grid lg:grid-cols-12">
          {/* Lista de tickets */}
          <div
            className={cn(
              "border-b border-white/10 lg:col-span-5 lg:border-b-0 lg:border-r",
              mobileView === "ticket" && "hidden lg:block",
            )}
          >
            <div className="demo-scroll max-h-[min(27rem,58vh)] divide-y divide-white/5 overflow-y-auto overscroll-contain lg:max-h-[32rem]">
              {filteredTickets.map((t) => {
                const Icon = canalIcons[t.canal] || Mail;
                const isSelected = t.id === current?.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => openTicket(t.id)}
                    className={cn(
                      "relative block w-full p-3.5 text-left transition-colors sm:p-4",
                      isSelected ? "bg-white/[0.08]" : "hover:bg-white/[0.03] active:bg-white/[0.06]",
                    )}
                  >
                    {isSelected && <span className="absolute inset-y-0 left-0 w-1 bg-white" />}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                        <span className="truncate font-mono text-[0.56rem] uppercase tracking-wider text-zinc-400">
                          {t.canal} · {t.nicheLabel}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[0.56rem] text-zinc-500">{t.time}</span>
                    </div>

                    <p className="mt-1 truncate font-display text-[0.88rem] font-bold text-white sm:text-[0.92rem]">
                      {t.subject}
                    </p>

                    <p className="mt-0.5 line-clamp-2 text-[0.72rem] leading-relaxed text-zinc-400 sm:text-xs">
                      <span className="font-medium text-zinc-200">{t.from}: </span>
                      {t.body}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 font-mono text-[0.5rem] font-bold uppercase",
                          t.status === "nuevo" && "bg-white/10 text-zinc-400",
                          t.status === "analizado" && "bg-amber-400/20 text-amber-300",
                          t.status === "resuelto" && "bg-[#30d158]/20 text-[#30d158]",
                          t.status === "escalado" && "bg-purple-400/20 text-purple-300",
                        )}
                      >
                        {t.status === "nuevo" ? "Sin procesar" : t.status}
                      </span>
                      <span className="font-mono text-[0.5rem] text-zinc-500">{t.id}</span>
                      {scanning === t.id && (
                        <span className="animate-pulse font-mono text-[0.56rem] text-white">
                          IA analizando...
                        </span>
                      )}
                      <span className="ml-auto font-mono text-[0.52rem] uppercase tracking-wider text-zinc-600 lg:hidden">
                        Abrir →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detalle + copiloto de IA */}
          <div
            className={cn(
              "bg-[#111114] p-3 lg:col-span-7 sm:p-5",
              mobileView === "inbox" && "hidden lg:flex",
              "lg:flex lg:flex-col lg:justify-between",
            )}
          >
            {current ? (
              <div className="space-y-3 sm:space-y-3.5">
                {/* Volver a la bandeja (solo móvil) */}
                <button
                  onClick={backToInbox}
                  className="glass-btn inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-zinc-300 active:scale-95 lg:hidden"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Volver a la bandeja
                </button>

                <div className="border-b border-white/10 pb-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="glass min-w-0 truncate rounded-full px-2.5 py-1 font-mono text-[0.52rem] uppercase text-zinc-300 sm:px-3 sm:text-[0.55rem]">
                      {current.canal} · {current.company}
                    </span>
                    <span className="shrink-0 font-mono text-[0.62rem] text-zinc-500 sm:text-xs">
                      {current.id}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-[1rem] font-bold leading-snug text-white sm:text-lg">
                    {current.subject}
                  </h3>

                  <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-3">
                    <p className="mb-1 font-mono text-[0.6rem] text-zinc-400">
                      Mensaje de <strong className="text-white">{current.from}</strong>:
                    </p>
                    <p className="text-[0.82rem] leading-relaxed text-zinc-200 sm:text-sm">
                      {current.body}
                    </p>
                  </div>
                </div>

                {isAnalyzed ? (
                  <div className="anim-pop space-y-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-xs">
                        <span className="block font-mono text-[0.52rem] uppercase text-zinc-500">
                          Intención detectada
                        </span>
                        <span className="mt-0.5 block font-semibold text-white">{current.intent}</span>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-xs">
                        <span className="block font-mono text-[0.52rem] uppercase text-zinc-500">
                          Prioridad / Categoría
                        </span>
                        <span className="mt-0.5 block font-semibold text-white">
                          {current.priority} · {current.topic}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between font-mono text-[0.55rem] uppercase tracking-wider text-zinc-400 sm:text-[0.58rem]">
                        <span className="flex items-center gap-1.5 text-white">
                          <Spark className="h-3 w-3" />
                          Borrador de la IA
                        </span>
                        <span>{streaming ? "Escribiendo..." : "Editable"}</span>
                      </div>

                      {streaming ? (
                        <div className="min-h-[6rem] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-[0.74rem] leading-relaxed text-zinc-200 sm:min-h-[9rem] sm:text-[0.8rem]">
                          {stream}
                          <span className="animate-pulse text-white">▍</span>
                        </div>
                      ) : (
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          className="h-[7.5rem] w-full resize-none rounded-xl border border-white/15 bg-black/70 p-3 font-mono text-[0.74rem] leading-relaxed text-white outline-none focus:border-white/40 sm:h-[10rem] sm:p-3.5 sm:text-[0.8rem]"
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                      <button
                        onClick={() => resolveTicket("resuelto", "Respuesta enviada y ticket cerrado")}
                        className="glass-btn-primary flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[0.72rem] font-bold sm:px-5 sm:text-xs"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Aprobar y enviar
                      </button>

                      <button
                        onClick={() =>
                          resolveTicket("escalado", "Traspasado al equipo humano con el contexto")
                        }
                        className="glass-btn flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[0.72rem] font-medium text-white sm:text-xs"
                      >
                        <Users className="h-3.5 w-3.5" />
                        Escalar a humano
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/20 p-5 text-center sm:p-8">
                    <p className="mb-3 text-[0.82rem] leading-relaxed text-zinc-400 sm:text-sm">
                      Este ticket aún no ha sido procesado por el agente de atención.
                    </p>
                    <button
                      onClick={() => analyzeOne(current.id)}
                      className="glass-btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.72rem] font-bold sm:px-5 sm:py-2.5 sm:text-xs"
                    >
                      <Spark className="h-3.5 w-3.5" />
                      Analizar con IA y redactar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-zinc-500">
                Selecciona un ticket para ver los detalles.
              </p>
            )}

          </div>
        </div>
      </div>

      {/* Aviso: visible también al volver a la bandeja en móvil */}
      {notice && (
        <div className="anim-pop flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-3 font-mono text-[0.66rem] text-white backdrop-blur-xl sm:text-xs">
          <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
