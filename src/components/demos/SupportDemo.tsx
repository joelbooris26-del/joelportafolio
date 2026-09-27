import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { nichesData } from "@/data/niches";
import { Chat, Check, Inbox, Mail, Send, Spark, Star, Users } from "../icons";

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
  const [tickets, setTickets] = useState(allTickets.map((t) => ({ ...t, status: "nuevo" as "nuevo" | "analizado" | "resuelto" | "escalado" })));
  const [scanning, setScanning] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [stream, setStream] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const streamTimer = useRef<number | null>(null);
  const timers = useRef<number[]>([]);

  const filteredTickets = tickets.filter(
    (t) => activeCanal === "Todos" || t.canal === activeCanal,
  );

  const current = tickets.find((t) => t.id === selectedTicketId) || filteredTickets[0] || tickets[0];
  const isAnalyzed = current?.status !== "nuevo";

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    if (streamTimer.current) window.clearInterval(streamTimer.current);
  }, []);

  // Animación de redacción de borrador por IA
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
        prev.map((item) => (item.id === id && item.status === "nuevo" ? { ...item, status: "analizado" } : item)),
      );
      setScanning(null);
    }, delay + 800);
    timers.current.push(t);
  };

  const analyzeAll = () => {
    let delay = 0;
    tickets.forEach((t) => {
      if (t.status === "nuevo") {
        analyzeOne(t.id, delay);
        delay += 500;
      }
    });
  };

  const resolveTicket = (status: "resuelto" | "escalado", msg: string) => {
    setTickets((prev) =>
      prev.map((item) => (item.id === current.id ? { ...item, status } : item)),
    );
    setNotice(msg);
    timers.current.push(window.setTimeout(() => setNotice(null), 3000));
  };

  const canalIcons: Record<string, typeof Mail> = {
    WhatsApp: Chat,
    Email: Mail,
    Instagram: Star,
    Web: Inbox,
  };

  return (
    <div className="space-y-4">
      {/* Cabecera oficial Helpdesk */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-400">
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
                      ? "bg-white text-black font-bold"
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
          className="glass-btn-primary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
        >
          <Spark className="h-3.5 w-3.5" />
          Procesar toda la bandeja con IA
        </button>
      </div>

      {/* Aplicación Helpdesk Dark Theme */}
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0e0e10] shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
        {/* Barra de menú superior estilo Zendesk / Intercom */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#141418] px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
            </span>
            <span className="font-mono text-xs font-bold text-white tracking-wider">
              INBOX UNIFICADO · ATENCIÓN CON IA
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span>Tickets abiertos: {tickets.filter((t) => t.status === "nuevo").length}</span>
            <span>·</span>
            <span>Resueltos hoy: {tickets.filter((t) => t.status === "resuelto").length}</span>
          </div>
        </div>

        {/* Cuerpo: Lista de tickets + Detalle + Copiloto IA */}
        <div className="grid lg:grid-cols-12">
          {/* Lista de tickets */}
          <div className="border-b border-white/10 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div className="max-h-[32rem] overflow-y-auto divide-y divide-white/5">
              {filteredTickets.map((t) => {
                const Icon = canalIcons[t.canal] || Mail;
                const isSelected = t.id === current?.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={cn(
                      "w-full p-4 text-left transition-colors relative block",
                      isSelected ? "bg-white/[0.08]" : "hover:bg-white/[0.03]",
                    )}
                  >
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 w-1 bg-white" />
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-zinc-400">
                          {t.canal} · {t.nicheLabel}
                        </span>
                      </div>
                      <span className="font-mono text-[0.58rem] text-zinc-500">{t.time}</span>
                    </div>

                    <p className="mt-1 font-display text-[0.92rem] font-bold text-white truncate">
                      {t.subject}
                    </p>

                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                      <span className="text-zinc-200 font-medium">{t.from}: </span>
                      {t.body}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 font-mono text-[0.5rem] uppercase font-bold",
                          t.status === "nuevo" && "bg-white/10 text-zinc-400",
                          t.status === "analizado" && "bg-amber-400/20 text-amber-300",
                          t.status === "resuelto" && "bg-[#30d158]/20 text-[#30d158]",
                          t.status === "escalado" && "bg-purple-400/20 text-purple-300",
                        )}
                      >
                        {t.status === "nuevo" ? "Sin procesar" : t.status}
                      </span>

                      <span className="font-mono text-[0.52rem] text-zinc-500">
                        {t.id}
                      </span>

                      {scanning === t.id && (
                        <span className="text-[0.6rem] font-mono text-white animate-pulse">
                          IA analizando...
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel de detalle y redacción con IA */}
          <div className="flex flex-col justify-between p-5 lg:col-span-7 bg-[#111114]">
            {current ? (
              <div className="space-y-4">
                {/* Cabecera del ticket actual */}
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="glass rounded-full px-3 py-1 font-mono text-[0.55rem] uppercase text-zinc-300">
                      {current.canal} · {current.company}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">{current.id}</span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {current.subject}
                  </h3>

                  <div className="mt-2 rounded-xl bg-black/40 p-3.5 border border-white/10">
                    <p className="font-mono text-[0.65rem] text-zinc-400 mb-1">
                      Mensaje de <strong className="text-white">{current.from}</strong>:
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-200">{current.body}</p>
                  </div>
                </div>

                {/* Copiloto de IA */}
                {isAnalyzed ? (
                  <div className="anim-pop space-y-3">
                    {/* Tarjetas de análisis rápido */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                        <span className="font-mono text-[0.55rem] uppercase text-zinc-500 block">
                          Intención detectada
                        </span>
                        <span className="font-semibold text-white mt-0.5 block">{current.intent}</span>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                        <span className="font-mono text-[0.55rem] uppercase text-zinc-500 block">
                          Prioridad / Categoría
                        </span>
                        <span className="font-semibold text-white mt-0.5 block">{current.priority} · {current.topic}</span>
                      </div>
                    </div>

                    {/* Editor de respuesta redactada con IA */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-wider text-zinc-400 mb-1">
                        <span className="flex items-center gap-1.5 text-white">
                          <Spark className="h-3 w-3" />
                          Borrador generado por IA (personalizado al negocio):
                        </span>
                        <span>{streaming ? "Escribiendo..." : "Listo para enviar"}</span>
                      </div>

                      {streaming ? (
                        <div className="min-h-[9rem] rounded-xl border border-white/10 bg-black/60 p-3.5 font-mono text-[0.8rem] leading-relaxed text-zinc-200 whitespace-pre-wrap">
                          {stream}
                          <span className="animate-pulse text-white">▍</span>
                        </div>
                      ) : (
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          rows={6}
                          className="w-full rounded-xl border border-white/15 bg-black/70 p-3.5 font-mono text-[0.8rem] leading-relaxed text-white outline-none focus:border-white/40"
                        />
                      )}
                    </div>

                    {/* Acciones de resolución */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => resolveTicket("resuelto", "Respuesta enviada y ticket cerrado")}
                        className="glass-btn-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Aprobar y Enviar Respuesta
                      </button>

                      <button
                        onClick={() => resolveTicket("escalado", "Traspasado al equipo humano con contexto")}
                        className="glass-btn flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-white"
                      >
                        <Users className="h-3.5 w-3.5" />
                        Escalar a Humano
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/20 p-8 text-center">
                    <p className="text-sm text-zinc-400 mb-3">
                      Este ticket aún no ha sido procesado por el agente de atención.
                    </p>
                    <button
                      onClick={() => analyzeOne(current.id)}
                      className="glass-btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold"
                    >
                      <Spark className="h-3.5 w-3.5" />
                      Analizar con IA y Redactar Respuesta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-zinc-500">
                Selecciona un ticket para ver los detalles.
              </p>
            )}

            {/* Aviso de confirmación */}
            {notice && (
              <div className="anim-pop mt-3 flex items-center gap-2 rounded-xl bg-white/10 p-3 font-mono text-xs text-white">
                <Check className="h-4 w-4" strokeWidth={2.5} />
                <span>{notice}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
