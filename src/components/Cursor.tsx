import { useEffect, useRef } from "react";

/**
 * Cursor propio: un punto y un anillo a su alrededor. Solo con ratón.
 *
 * Fluido y ligero:
 *  - El punto va pegado al ratón; el anillo lo persigue con un retardo mínimo (~40 ms).
 *  - El bucle de animación solo corre mientras el ratón se mueve y se detiene al quedarse
 *    quieto, así no gasta CPU cuando no hace falta.
 *  - Todo el movimiento es `transform` (se hace en la GPU); el cambio de tamaño usa `scale`.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let tx = -100; // objetivo (donde está el ratón)
    let ty = -100;
    let rx = -100; // posición del anillo
    let ry = -100;
    let raf = 0;
    let last = 0;
    let started = false;

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      // Persecución independiente de los fps: el anillo recorre ~63 % de la distancia cada 40 ms
      const k = 1 - Math.exp(-dt / 40);
      rx += (tx - rx) * k;
      ry += (ty - ry) * k;
      const quiet = Math.abs(tx - rx) < 0.1 && Math.abs(ty - ry) < 0.1;
      if (quiet) {
        rx = tx;
        ry = ty;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      place(r, rx, ry);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      place(d, tx, ty);
      if (!started) {
        // primer movimiento: el anillo aparece ya en su sitio, sin cruzar la pantalla
        started = true;
        rx = tx;
        ry = ty;
        place(r, rx, ry);
        d.classList.remove("cursor-hidden");
        r.classList.remove("cursor-hidden");
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      r.classList.toggle("is-hover", !!t?.closest("a, button, input, textarea, select, [data-hover]"));
    };
    const onDown = () => r.classList.add("is-down");
    const onUp = () => r.classList.remove("is-down");
    const hide = () => {
      d.classList.add("cursor-hidden");
      r.classList.add("cursor-hidden");
      started = false; // al volver a entrar, reaparece directamente bajo el ratón
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("mouseleave", hide);

    return () => {
      root.classList.remove("has-cursor");
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring cursor-hidden" aria-hidden="true" />
      <div ref={dot} className="cursor-dot cursor-hidden" aria-hidden="true" />
    </>
  );
}
