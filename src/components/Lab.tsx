import { useEffect, useRef } from "react";
import { sphereWords, stackGroups } from "@/data/content";
import { Eyebrow, Reveal, prefersReducedMotion } from "./ui";

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

/** Nube de etiquetas sobre una esfera 3D que gira y sigue al cursor. */
function SkillSphere() {
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduce = prefersReducedMotion();
    const base = fibonacci(sphereWords.length);
    let rx = 0.3;
    let ry = 0;
    let vx = 0.0016;
    let vy = 0.0026;
    let tvx = vx;
    let tvy = vy;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(box);

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      if (Math.abs(nx) < 1.2 && Math.abs(ny) < 1.2) {
        tvy = nx * 0.006;
        tvx = -ny * 0.006;
      } else {
        tvx = 0.0016;
        tvy = 0.0026;
      }
    };
    const onLeave = () => {
      tvx = 0.0016;
      tvy = 0.0026;
    };

    const render = (dt: number) => {
      const radius = box.clientWidth * 0.43;
      vx += (tvx - vx) * 0.06;
      vy += (tvy - vy) * 0.06;
      rx += vx * dt * 0.06;
      ry += vy * dt * 0.06;
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);

      base.forEach(([x0, y0, z0], i) => {
        // rotación Y y luego X
        let x = x0 * cy + z0 * sy;
        let z = -x0 * sy + z0 * cy;
        const y = y0 * cx - z * sx;
        z = y0 * sx + z * cx;
        const el = els.current[i];
        if (!el) return;
        const depth = (z + 1) / 2;
        const scale = 0.62 + depth * 0.7;
        x *= radius;
        el.style.transform = `translate(-50%,-50%) translate3d(${x}px, ${y * radius}px, 0) scale(${scale})`;
        el.style.opacity = String(0.18 + depth * 0.82);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.color = depth > 0.72 ? "#c8ff3e" : "#dfe6ea";
      });
    };

    const loop = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      if (visible) render(dt);
      raf = requestAnimationFrame(loop);
    };

    render(16);
    if (!reduce) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove);
      box.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative mx-auto aspect-square w-full max-w-[34rem]"
      aria-label="Esfera giratoria con las tecnologías que uso"
    >
      {/* Anillos decorativos que giran */}
      <div className="animate-spin-slow absolute inset-[4%] rounded-full border border-dashed border-lime/25" />
      <div className="animate-spin-rev absolute inset-[14%] rounded-full border border-white/10" />
      <div
        className="absolute inset-[10%] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,255,62,0.10), transparent 62%)" }}
      />
      <div className="absolute inset-[30%] rounded-full bg-lime/[0.05] blur-2xl" />

      {sphereWords.map((w, i) => (
        <span
          key={w}
          ref={(el) => {
            els.current[i] = el;
          }}
          className="absolute left-1/2 top-1/2 whitespace-nowrap font-mono text-[0.78rem] font-semibold uppercase tracking-[0.1em] sm:text-[0.9rem]"
          style={{ willChange: "transform, opacity" }}
        >
          {w}
        </span>
      ))}
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
              Lo que uso a diario para construir. Mueve el cursor sobre la esfera y gírala: cada
              palabra es algo con lo que he trabajado de verdad en los proyectos de arriba.
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
