import { useEffect, type ReactNode } from "react";
import { ArrowRight, Close } from "./ui";

/**
 * Ventana a pantalla completa para probar una demo sin salir del portafolio.
 * El contenido va dentro de `.demo-scope`, que conserva el aspecto original de las demos.
 */
export function DemoModal({
  open,
  onClose,
  onContact,
  title,
  accent,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onContact: () => void;
  title: string;
  accent: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Demo: ${title}`}
    >
      <div className="absolute inset-0 bg-ink/90 backdrop-blur-xl" onClick={onClose} />

      <div
        className="pop relative flex h-full w-full max-w-6xl flex-col overflow-hidden bg-ink sm:h-auto sm:max-h-full sm:rounded-[2rem] sm:border"
        style={{ borderColor: `${accent}55` }}
      >
        <div
          className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4"
          style={{ background: `linear-gradient(90deg, ${accent}14, transparent 60%)` }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="chip shrink-0" style={{ borderColor: `${accent}66`, color: accent }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="pulse-ring absolute inset-0" />
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
              </span>
              Demo
            </span>
            <p className="truncate font-display text-[0.95rem] font-semibold tracking-tight text-white sm:text-[1.1rem]">
              {title}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={onContact} className="btn-lime group px-4 py-2 text-[0.78rem]">
              <span className="hidden sm:inline">Quiero esto en mi negocio</span>
              <span className="sm:hidden">Lo quiero</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onClose}
              aria-label="Cerrar la demo"
              className="btn-ghost grid h-10 w-10 place-items-center !p-0"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="demo-scope flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 sm:px-8 sm:py-8">
          {children}
          <p className="mt-8 text-center font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.16em] text-zinc-500">
            Simulación con datos ficticios · nada de lo que escribas sale de tu navegador
          </p>
        </div>
      </div>
    </div>
  );
}
