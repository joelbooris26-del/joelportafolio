import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { nichesData, type NicheId, type NicheRule } from "@/data/niches";
import { ArrowRight, Send } from "../icons";

type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
  chips?: string[];
  status?: "sent" | "delivered" | "read";
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const currentTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export function ChatbotDemo() {
  const [selectedNiche, setSelectedNiche] = useState<NicheId>("salud");
  const niche = nichesData[selectedNiche];

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lastIntent, setLastIntent] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // Inicializar conversación al cambiar de nicho
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    setTyping(false);
    setLastIntent(null);
    setMsgs([
      {
        id: 1,
        from: "bot",
        text: niche.chatbot.welcome,
        time: currentTime(),
        chips: niche.chatbot.chips,
        status: "read",
      },
    ]);
  }, [selectedNiche, niche]);

  // Desplaza solo el contenedor de mensajes, nunca la página completa.
  useEffect(() => {
    const box = endRef.current?.parentElement;
    if (box) box.scrollTop = box.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const userMsgId = Date.now();
    const time = currentTime();

    setMsgs((p) => [
      ...p,
      { id: userMsgId, from: "user", text, time, status: "sent" },
    ]);
    setInput("");

    // Actualizar doble check
    later(() => {
      setMsgs((p) =>
        p.map((m) => (m.id === userMsgId ? { ...m, status: "delivered" } : m)),
      );
    }, 400);

    later(() => {
      setMsgs((p) =>
        p.map((m) => (m.id === userMsgId ? { ...m, status: "read" } : m)),
      );
    }, 700);

    const t = norm(text);
    let found: NicheRule | null = null;
    let best = 0;
    for (const r of niche.chatbot.rules) {
      for (const k of r.keys) {
        if (t.includes(norm(k)) && k.length > best) {
          best = k.length;
          found = r;
        }
      }
    }

    setLastIntent(found ? found.intent : "Consulta general");
    setTyping(true);

    later(() => {
      setTyping(false);
      setMsgs((p) => [
        ...p,
        {
          id: userMsgId + 1,
          from: "bot",
          text: found ? found.reply : niche.chatbot.fallback,
          time: currentTime(),
          chips: found?.chips ?? niche.chatbot.chips.slice(0, 3),
          status: "read",
        },
      ]);
    }, 1300 + Math.random() * 500);

    if (found?.follow) {
      later(() => {
        setMsgs((p) => [
          ...p,
          {
            id: userMsgId + 2,
            from: "bot",
            text: found!.follow!,
            time: currentTime(),
            status: "read",
          },
        ]);
      }, 2600);
    }
  };

  const resetChat = () => {
    timers.current.forEach(clearTimeout);
    setTyping(false);
    setLastIntent(null);
    setMsgs([
      {
        id: Date.now(),
        from: "bot",
        text: niche.chatbot.welcome,
        time: currentTime(),
        chips: niche.chatbot.chips,
        status: "read",
      },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Selector de nichos */}
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-400">
            Selecciona un nicho de negocio:
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
                      ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
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

      {/* Dispositivo WhatsApp Business (Diseño idéntico a la app oficial en Dark Mode) */}
      <div className="mx-auto w-full max-w-[22rem] overflow-hidden rounded-[1.5rem] border border-[#2a2f32] bg-[#0b141a] shadow-[0_30px_90px_rgba(0,0,0,0.95)] ring-1 ring-white/10 sm:max-w-xl sm:rounded-[2.2rem]">
        {/* Barra superior de estado del teléfono (oculta en móvil para ganar altura) */}
        <div className="hidden items-center justify-between bg-[#1f2c34] px-6 py-2 text-[0.68rem] font-medium text-zinc-300 sm:flex">
          <span>{currentTime()}</span>
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 21l3.52-.61C9.37 20.71 10.65 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
            </svg>
            <span className="font-mono text-[0.6rem]">5G</span>
            <div className="h-2 w-4 rounded-sm border border-zinc-300 p-0.5">
              <div className="h-full w-full bg-zinc-300" />
            </div>
          </div>
        </div>

        {/* Cabecera oficial de WhatsApp Business */}
        <div className="flex items-center justify-between border-b border-[#2a3942] bg-[#1f2c34] px-2.5 py-2 text-white sm:px-3.5 sm:py-2.5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={resetChat}
              title="Reiniciar chat"
              className="text-zinc-400 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Avatar con foto / iniciales */}
            <div className="relative">
              <div
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full font-display text-[0.8rem] font-bold text-white shadow-md sm:h-10 sm:w-10 sm:text-sm",
                  niche.avatarBg,
                )}
              >
                {niche.avatarText}
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1f2c34] bg-[#25d366]" />
            </div>

            {/* Nombre y estado */}
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate font-sans text-[0.92rem] font-semibold leading-tight text-white">
                  {niche.companyName}
                </p>
                {niche.verified && (
                  <svg className="h-3.5 w-3.5 shrink-0 text-[#25d366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <p className="truncate font-sans text-[0.68rem] text-[#8696a0]">
                {typing ? (
                  <span className="text-[#25d366] font-medium animate-pulse">escribiendo...</span>
                ) : (
                  niche.roleSubtitle
                )}
              </p>
            </div>
          </div>

          {/* Iconos de cabecera: videollamada, llamada, menú */}
          <div className="flex items-center gap-3 text-[#aebac1]">
            <button className="hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            </button>
            <button className="hover:text-white">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.044 15.044 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 3.99c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-.99-1.11z" />
              </svg>
            </button>
            <button onClick={resetChat} title="Opciones" className="hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Zona de mensajes con textura de fondo oficial de WhatsApp */}
        <div
          ref={scrollRef}
          className="demo-scroll relative flex h-[21rem] flex-col overflow-y-auto px-3 py-3.5 sm:h-[26rem] sm:px-3.5"
          style={{
            backgroundColor: "#0b141a",
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        >
          {/* Badge de cifrado oficial de WhatsApp */}
          <div className="mx-auto mb-3 max-w-[85%] rounded-lg bg-[#182229] px-3 py-1.5 text-center text-[0.62rem] text-[#ffd279] shadow-sm">
            🔒 Los mensajes están cifrados de extremo a extremo. Este chat cuenta con asistente automatizado 24/7.
          </div>

          <div className="space-y-2.5">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "anim-pop flex flex-col",
                  m.from === "user" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "relative max-w-[86%] rounded-2xl px-3.5 py-2 text-[0.85rem] leading-relaxed shadow-md",
                    m.from === "bot"
                      ? "rounded-tl-none bg-[#202c33] text-[#e9edef]"
                      : "rounded-tr-none bg-[#005c4b] text-[#e9edef]",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[0.62rem] text-[#8696a0]">
                    <span>{m.time}</span>
                    {m.from === "user" && (
                      <span className={cn(m.status === "read" ? "text-[#53bdeb]" : "text-[#8696a0]")}>
                        {m.status === "sent" ? "✓" : "✓✓"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botones de sugerencia rápida interactivos estilo WhatsApp */}
                {m.chips && m.chips.length > 0 && (
                  <div className="mt-2 flex max-w-full flex-wrap gap-1.5">
                    {m.chips.map((c) => (
                      <button
                        key={c}
                        onClick={() => send(c)}
                        className="flex items-center gap-1.5 rounded-full border border-[#00a884]/40 bg-[#111b21] px-3 py-1.5 font-sans text-[0.72rem] font-medium text-[#00a884] shadow-sm transition-all hover:bg-[#00a884] hover:text-black active:scale-95"
                      >
                        {c}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de escritura animado */}
            {typing && (
              <div className="flex items-center gap-2">
                <div className="rounded-2xl rounded-tl-none bg-[#202c33] px-4 py-2.5 shadow-md">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696a0]" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696a0]" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696a0]" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Barra inferior de entrada oficial de WhatsApp */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-1.5 bg-[#202c33] px-2.5 py-2 sm:gap-2 sm:px-3 sm:py-2.5"
        >
          {/* Emojis & Clip */}
          <div className="flex items-center gap-2 text-[#8696a0]">
            <button type="button" className="hover:text-[#aebac1]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button type="button" className="hover:text-[#aebac1]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>

          {/* Campo de texto */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mensaje..."
            className="min-w-0 flex-1 rounded-lg bg-[#2a3942] px-3.5 py-2 font-sans text-[0.88rem] text-white placeholder-[#8696a0] outline-none focus:ring-1 focus:ring-[#00a884]"
          />

          {/* Botón de enviar / micrófono */}
          {input.trim() ? (
            <button
              type="submit"
              aria-label="Enviar mensaje"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00a884] text-black shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          ) : (
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00a884] text-black shadow-md"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Barra de estado con intención detectada */}
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-zinc-400">
        <span className="flex items-center gap-2 text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-[#25d366]" />
          IA activa ({niche.companyName})
        </span>
        <span>
          Intención: <strong className="text-white">{lastIntent || "Esperando entrada..."}</strong>
        </span>
      </div>
    </div>
  );
}
