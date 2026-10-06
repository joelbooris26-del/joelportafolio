import { useEffect, useRef, type ReactNode } from "react";
import { IArrow, IClose } from "./kit";

/**
 * Ventana a pantalla completa para probar una demo sin salir del portafolio.
 * Ligera a propósito: fondo sólido (sin desenfoque), y mientras está abierta el
 * resto de la página queda pausado (clase `demo-open` en <html>).
 */
export function DemoShell({
  title,
  accent,
  onClose,
  onContact,
  children,
}: {
  title: string;
  accent: string;
  onClose: () => void;
  onContact: () => void;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    html.classList.add("demo-open");
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.classList.remove("demo-open");
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[150] flex justify-center bg-ink sm:items-center sm:bg-ink/95 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Demo: ${title}`}
    >
      <div
        className="pop flex h-full w-full max-w-6xl flex-col overflow-hidden bg-ink sm:h-[min(54rem,calc(100dvh-2rem))] sm:rounded-[1.75rem] sm:border"
        style={{ borderColor: `${accent}55` }}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="chip shrink-0" style={{ borderColor: `${accent}66`, color: accent }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
              Demo
            </span>
            <p className="truncate font-display text-[0.95rem] font-semibold tracking-tight text-white sm:text-[1.05rem]">
              {title}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={onContact} className="btn-lime px-4 py-2 text-[0.78rem]">
              <span className="hidden sm:inline">Quiero esto en mi negocio</span>
              <span className="sm:hidden">Lo quiero</span>
              <IArrow className="h-3.5 w-3.5" />
            </button>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Cerrar la demo"
              className="btn-ghost h-10 w-10 !p-0"
            >
              <IClose className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1">{children}</div>

        <p className="shrink-0 border-t border-white/10 px-4 py-2 text-center font-mono text-[0.56rem] uppercase tracking-[0.16em] text-mute">
          Simulación con datos ficticios · nada de lo que escribas sale de tu navegador
        </p>
      </div>
    </div>
  );
}

/** Pantalla mientras se descarga el código de la demo (solo la primera vez). */
export function DemoLoading() {
  return (
    <div className="fixed inset-0 z-[150] grid place-items-center bg-ink/95" role="status" aria-live="polite">
      <div className="text-center">
        <span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-lime" />
        <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.22em] text-mute">Cargando demo…</p>
      </div>
    </div>
  );
}
