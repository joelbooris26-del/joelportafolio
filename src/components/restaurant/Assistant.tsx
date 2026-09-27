import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { botChips, botFallback, botRules } from "@/data/restaurant";
import { ArrowRight, Chat, Close, Send } from "../icons";

export type BotAction = "carta" | "reservas" | "ubicacion" | "contacto" | "prefill2" | "prefill4";

type Msg = { id: number; from: "bot" | "user"; text: string; chips?: string[] };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function match(text: string) {
  const t = norm(text);
  let best: { reply: string; chips?: string[]; score: number } | null = null;
  for (const rule of botRules) {
    for (const key of rule.keys) {
      if (t.includes(norm(key))) {
        const score = key.length;
        if (!best || score > best.score) best = { reply: rule.reply, chips: rule.chips, score };
      }
    }
  }
  return best;
}

const actionFor = (text: string): BotAction | null => {
  const t = norm(text);
  if (t.includes("abrir reservas") || t.includes("reservar para 4"))
    return t.includes("4") ? "prefill4" : "reservas";
  if (t.includes("reservar para 2")) return "prefill2";
  if (t.includes("ver la carta")) return "carta";
  if (t.includes("ubicacion")) return "ubicacion";
  if (t.includes("contacto")) return "contacto";
  return null;
};

export function Assistant({ onAction }: { onAction: (a: BotAction) => void }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(1);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      from: "bot",
      text: "Hola, soy Sofía, la asistente de Marea Alta. Puedo ayudarte con la carta, las reservas, los horarios, los alérgenos o cómo llegar. ¿Qué necesitas?",
      chips: botChips.slice(0, 4),
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // Desplaza solo el panel del chat, nunca la página completa.
  useEffect(() => {
    const box = endRef.current?.parentElement;
    if (box) box.scrollTop = box.scrollHeight;
  }, [msgs, typing, open]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const push = (m: Omit<Msg, "id">, delay = 0) => {
    const t = window.setTimeout(() => {
      setMsgs((prev) => [...prev, { ...m, id: Date.now() + Math.random() }]);
    }, delay);
    timers.current.push(t);
  };

  const handleUserText = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    push({ from: "user", text });
    setInput("");
    setTyping(true);

    const action = actionFor(text);
    const found = match(text);
    const reply = found?.reply ?? botFallback;
    const chips = found?.chips ?? botChips.slice(0, 3);

    push({ from: "bot", text: reply, chips }, 900 + Math.random() * 700);
    window.setTimeout(() => setTyping(false), 800 + Math.random() * 700);

    if (action) {
      push({ from: "bot", text: "Te llevo allí ahora mismo." }, 2100);
      window.setTimeout(() => {
        onAction(action);
        setOpen(false);
      }, 2500);
    }
  };

  return (
    <>
      {/* Botón flotante de cristal */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setUnread(0);
        }}
        aria-label="Abrir el asistente de Marea Alta"
        className={cn(
          "glass-btn group fixed bottom-6 right-6 z-40 grid h-16 w-16 place-items-center rounded-full text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] hover:bg-white hover:text-black",
          open && "pointer-events-none scale-90 opacity-0",
        )}
      >
        <span className="ring-pulse absolute inset-0 rounded-full text-white/40" />
        <Chat className="relative h-7 w-7" />
        {unread > 0 && (
          <span className="glass-btn-primary absolute -right-0.5 -top-0.5 grid h-6 w-6 place-items-center rounded-full font-mono text-[0.6rem] font-bold text-black">
            {unread}
          </span>
        )}
        <span className="glass pointer-events-none absolute right-[4.6rem] whitespace-nowrap rounded-xl px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          ¿Hablamos?
        </span>
      </button>

      {/* Panel de cristal */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-[min(34rem,calc(100%-3rem))] w-[min(24rem,calc(100%-3rem))] flex-col overflow-hidden rounded-3xl border border-white/12 bg-[#0d0d0f] shadow-[0_40px_90px_rgba(0,0,0,0.9)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-6 scale-95 opacity-0",
        )}
      >
        <header className="flex items-center gap-3 border-b border-white/10 bg-[#141416] p-4 text-white">
          <span className="glass-btn-primary relative grid h-10 w-10 shrink-0 place-items-center rounded-full font-chef text-lg font-bold text-black">
            S
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-black bg-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-chef text-[1.05rem] font-semibold leading-tight text-white">
              Sofía
            </p>
            <p className="flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Asistente de Marea Alta · en línea
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar el asistente"
            className="glass-btn grid h-8 w-8 place-items-center rounded-full text-zinc-300 hover:text-white"
          >
            <Close className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-[#0d0d0f] p-4">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={cn("anim-pop flex flex-col", m.from === "user" ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.86rem] leading-relaxed",
                  m.from === "bot"
                    ? "glass rounded-bl-sm text-zinc-200"
                    : "glass-btn-primary rounded-br-sm text-black font-medium",
                )}
              >
                {m.text}
              </div>
              {m.chips && m.chips.length > 0 && (
                <div className="mt-2 flex max-w-full flex-wrap justify-start gap-1.5">
                  {m.chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleUserText(c)}
                      className="glass-btn inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-zinc-300 hover:text-white"
                    >
                      {c}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex items-end gap-2">
              <div className="glass flex gap-1 rounded-2xl rounded-bl-sm p-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-zinc-500">
                escribiendo
              </span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserText(input);
          }}
          className="flex items-center gap-2 border-t border-white/10 bg-[#141416] p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta…"
            className="glass-input min-w-0 flex-1 rounded-full px-4 py-2.5 text-[0.85rem] text-white placeholder:text-zinc-500 outline-none"
          />
          <button
            type="submit"
            aria-label="Enviar mensaje"
            className="glass-btn-primary grid h-10 w-10 shrink-0 place-items-center rounded-full text-black"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
