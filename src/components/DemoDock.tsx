import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import type { AutomationId } from "@/data/site";
import { Calendar, Chat, Cpu, Inbox } from "./icons";

const items: { id: AutomationId; label: string; icon: typeof Chat }[] = [
  { id: "chatbot", label: "Chatbot", icon: Chat },
  { id: "voz", label: "Llamada IA", icon: Cpu },
  { id: "soporte", label: "Soporte", icon: Inbox },
  { id: "citas", label: "Citas", icon: Calendar },
];

export function DemoDock({
  openDemo,
  pickAutomation,
  hidden,
}: {
  openDemo: () => void;
  pickAutomation: (id: AutomationId) => void;
  hidden: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 450);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = show && !hidden;

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:left-6 sm:translate-x-0",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0",
      )}
    >
      <div className="glass flex items-center gap-1 rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <button
          onClick={openDemo}
          className="glass-btn-primary group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.78rem] font-bold text-black"
        >
          <span className="hidden sm:inline">Demo restaurante</span>
          <span className="sm:hidden">Demo</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black" />
          </span>
        </button>

        <span className="mx-1 hidden h-6 w-px bg-white/10 lg:block" />
        <span className="mx-1 hidden font-mono text-[0.52rem] uppercase leading-tight tracking-[0.16em] text-zinc-500 lg:block">
          prueba
          <br />
          las IA
        </span>

        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => pickAutomation(id)}
            title={`Probar: ${label}`}
            className="glass-btn group relative grid h-10 w-10 place-items-center rounded-full text-zinc-300 hover:text-white sm:w-auto sm:px-3"
          >
            <Icon className="h-4 w-4" />
            <span className="ml-2 hidden font-mono text-[0.58rem] uppercase tracking-[0.1em] sm:inline">
              {label}
            </span>
            <span className="glass pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 font-mono text-[0.52rem] uppercase tracking-[0.12em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
