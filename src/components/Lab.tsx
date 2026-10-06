import { useEffect, useRef } from "react";
import { sphereWords, stackGroups } from "@/data/content";
import { Eyebrow, Reveal, demoOpen, prefersReducedMotion } from "./ui";

type V3 = [number, number, number];

function fibonacci(n: number): V3[] {
  const pts: V3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return pts;
}

/* Velocidades angulares en radianes por milisegundo */
const IDLE_X = 0.0001;
const IDLE_Y = 0.00016;
const MAX_W = 0.012;
/** Radianes que gira la esfera por cada píxel que se arrastra. */
const DRAG_GAIN = 0.0105;

/**
 * Nube de etiquetas sobre una esfera 3D.
 * Gira sola, sigue al ratón y se puede agarrar y arrastrar (ratón o dedo) para
 * ver las herramientas que quedan por detrás.
 */
function SkillSphere() {
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduce = prefersReducedMotion();
    const idleX = reduce ? 0 : IDLE_X;
    const idleY = reduce ? 0 : IDLE_Y;
    const base = fibonacci(sphereWords.length);

    let rx = 0.3;
    let ry = 0;
    let wx = idleX;
    let wy = idleY;
    let twx = idleX;
    let twy = idleY;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(box);

    /* ── Arrastre con ratón o dedo ───────────────────────────────────── */
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      wx = 0;
      wy = 0;
      box.setPointerCapture(e.pointerId);
      box.dataset.dragging = "1";
    };
    const onDrag = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(1, e.timeStamp - lastT);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      // arrastrar a la derecha acerca lo de atrás hacia la derecha; hacia abajo, hacia abajo
      ry += dx * DRAG_GAIN;
      rx -= dy * DRAG_GAIN;
      wy = Math.max(-MAX_W, Math.min(MAX_W, (dx * DRAG_GAIN) / dt));
      wx = Math.max(-MAX_W, Math.min(MAX_W, (-dy * DRAG_GAIN) / dt));
      render();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      // si se quedó quieto antes de soltar, no hay inercia
      if (e.timeStamp - lastT > 90) {
        wx = 0;
        wy = 0;
      }
      delete box.dataset.dragging;
      if (box.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId);
    };

    /* ── Con el ratón encima (sin pulsar) la esfera sigue al cursor ──── */
    const onHover = (e: PointerEvent) => {
      if (reduce || dragging || e.pointerType !== "mouse") return;
      const r = box.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      if (Math.abs(nx) < 1.2 && Math.abs(ny) < 1.2) {
        twy = nx * 0.00036;
        twx = -ny * 0.00036;
      } else {
        twx = idleX;
        twy = idleY;
      }
    };
    const onLeave = () => {
      twx = idleX;
      twy = idleY;
    };

    const render = () => {
      const radius = box.clientWidth * 0.43;
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);

      base.forEach(([x0, y0, z0], i) => {
        // rotación Y y luego X
        const xr = x0 * cy + z0 * sy;
        const zr = -x0 * sy + z0 * cy;
        const y = y0 * cx - zr * sx;
        const z = y0 * sx + zr * cx;
        const el = els.current[i];
        if (!el) return;
        const depth = (z + 1) / 2;
        const scale = 0.62 + depth * 0.7;
        el.style.transform = `translate(-50%,-50%) translate3d(${xr * radius}px, ${y * radius}px, 0) scale(${scale})`;
        el.style.opacity = String(0.18 + depth * 0.82);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.color = depth > 0.72 ? "#c8ff3e" : "#dfe6ea";
      });
    };

    // En el móvil se repinta a 30 fotogramas por segundo (a 45 en ordenador): se ve igual de fluido
    // y el teléfono tiene que mover la mitad de elementos por segundo.
    const minMs = window.innerWidth < 760 ? 1000 / 30 : 1000 / 45;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const elapsed = now - last;
      if (elapsed < minMs - 2) return;
      const dt = Math.min(48, elapsed);
      last = now;
      if (visible && !dragging && !demoOpen()) {
        // la velocidad vuelve poco a poco al giro tranquilo (o al del cursor)
        wx += (twx - wx) * 0.06;
        wy += (twy - wy) * 0.06;
        rx += wx * dt;
        ry += wy * dt;
        render();
      }
    };

    render();
    raf = requestAnimationFrame(loop);
    box.addEventListener("pointerdown", onDown);
    box.addEventListener("pointermove", onDrag);
    box.addEventListener("pointerup", onUp);
    box.addEventListener("pointercancel", onUp);
    window.addEventListener("pointermove", onHover);
    box.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      box.removeEventListener("pointerdown", onDown);
      box.removeEventListener("pointermove", onDrag);
      box.removeEventListener("pointerup", onUp);
      box.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onHover);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[19rem] sm:max-w-[34rem]">
      <div
        ref={boxRef}
        data-hover
        className="relative aspect-square w-full select-none [touch-action:none]"
        aria-label="Esfera giratoria con las tecnologías que uso. Arrástrala para girarla."
      >
        {/* Anillos decorativos que giran */}
        <div className="animate-spin-slow pointer-events-none absolute inset-[4%] rounded-full border border-dashed border-lime/25" />
        <div className="animate-spin-rev pointer-events-none absolute inset-[14%] rounded-full border border-white/10" />
        <div
          className="pointer-events-none absolute inset-[10%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,255,62,0.10), transparent 62%)" }}
        />
        <div className="pointer-events-none absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgba(200,255,62,0.08),transparent_70%)]" />

        {sphereWords.map((w, i) => (
          <span
            key={w}
            ref={(el) => {
              els.current[i] = el;
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 whitespace-nowrap font-mono text-[0.78rem] font-semibold uppercase tracking-[0.1em] sm:text-[0.9rem]"
            style={{ willChange: "transform, opacity" }}
          >
            {w}
          </span>
        ))}
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mute">
        <span aria-hidden="true" className="text-lime">
          ↔
        </span>
        Arrástrala para girarla y ver todas
      </p>
    </div>
  );
}

export function Lab() {
  return (
    <section id="laboratorio" className="noise relative overflow-x-clip bg-panel/40 py-24 sm:py-32">
      <div className="dots-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal className="lg:col-span-5">
            <Eyebrow n="04" label="Laboratorio" />
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5.4vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white">
              Mi caja
              <br />
              de <span className="text-gradient">herramientas.</span>
            </h2>
            <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-soft">
              Lo que uso a diario para construir. Agarra la esfera con el ratón o con el dedo y
              gírala: cada palabra es algo con lo que he trabajado de verdad en los proyectos de
              arriba.
            </p>

            <div className="mt-9 space-y-5">
              {stackGroups.map((g, gi) => (
                <Reveal key={g.name} delay={gi * 80}>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-lime">{g.name}</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal delay={100}>
              <SkillSphere />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
