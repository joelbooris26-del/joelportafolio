import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/utils/cn";
import { projects, type DemoId } from "@/data/content";
import { ProjectArt } from "./ProjectArt";
import { ArrowLeft, ArrowRight, Check, Eyebrow, Reveal, demoOpen, prefersReducedMotion } from "./ui";

const N = projects.length;
const STEP = 360 / N;
/** Con pocos proyectos el anillo necesita más radio para que las tarjetas no se pisen. */
const RADIUS_FACTOR = 1.45 + Math.max(0, 6 - N) * 0.17;

/** Ángulo equivalente a `target` más cercano a `current` (cualquier vuelta). */
const nearest = (current: number, target: number) =>
  target + Math.round((current - target) / 360) * 360;

export function Projects({ onOpenDemo }: { onOpenDemo: (id: DemoId) => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const angle = useRef(0);
  const velocity = useRef(0);
  const target = useRef<number | null>(null);
  const dragging = useRef(false);
  const moved = useRef(0);
  const lastX = useRef(0);
  const hover = useRef(false);
  const idleUntil = useRef(0);
  const activeRef = useRef(0);
  const dims = useRef({ w: 320, h: 430, r: 340 });

  const [active, setActive] = useState(0);
  const [dim, setDim] = useState(dims.current);
  const project = projects[active];

  /* ── Medidas responsivas ─────────────────────────────────────────────── */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const cw = el.clientWidth;
      const w = cw < 520 ? Math.min(268, cw * 0.72) : cw < 900 ? 300 : 330;
      const h = Math.round(w * 1.32);
      const r = Math.round((w / 2 / Math.tan(Math.PI / N)) * RADIUS_FACTOR);
      dims.current = { w, h, r };
      setDim({ w, h, r });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Bucle de animación del anillo ───────────────────────────────────── */
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    if (stageRef.current) io.observe(stageRef.current);

    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;

      if (visible && !demoOpen()) {
        if (!dragging.current) {
          if (Math.abs(velocity.current) > 0.01) {
            // inercia tras soltar
            angle.current += velocity.current * dt;
            velocity.current *= Math.pow(0.0035, dt / 1000);
            if (Math.abs(velocity.current) < 0.02) {
              velocity.current = 0;
              target.current = Math.round(angle.current / STEP) * STEP;
            }
          } else if (target.current !== null) {
            // ir hacia el objetivo con suavidad
            const k = 1 - Math.exp(-dt / 130);
            angle.current += (target.current - angle.current) * k;
            if (Math.abs(target.current - angle.current) < 0.05) {
              angle.current = target.current;
              target.current = null;
            }
          } else if (!reduce && !hover.current && now > idleUntil.current) {
            // giro automático lento
            angle.current -= dt * 0.0042;
          }
        }

        const { r } = dims.current;
        if (ringRef.current) {
          ringRef.current.style.transform = `translateZ(${-r}px) rotateY(${angle.current}deg)`;
        }
        for (let i = 0; i < N; i++) {
          const el = cardRefs.current[i];
          if (!el) continue;
          const theta = ((i * STEP + angle.current) * Math.PI) / 180;
          const front = (Math.cos(theta) + 1) / 2; // 1 delante · 0 detrás
          const f = Math.pow(front, 2.2);
          el.style.opacity = String(0.14 + 0.86 * f);
          el.style.pointerEvents = front > 0.55 ? "auto" : "none";
        }

        const idx = ((Math.round(-angle.current / STEP) % N) + N) % N;
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  /* ── Navegación ──────────────────────────────────────────────────────── */
  const goTo = useCallback((i: number) => {
    velocity.current = 0;
    target.current = nearest(angle.current, -i * STEP);
    idleUntil.current = performance.now() + 9000;
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => goTo((((activeRef.current + dir) % N) + N) % N),
    [goTo],
  );

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  /* ── Arrastre ────────────────────────────────────────────────────────── */
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    moved.current = 0;
    lastX.current = e.clientX;
    velocity.current = 0;
    target.current = null;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    moved.current += Math.abs(dx);
    angle.current += dx * 0.36;
    velocity.current = dx * 0.36 / 16; // grados por ms (aprox.)
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    idleUntil.current = performance.now() + 9000;
    if (moved.current < 6) {
      // fue un clic: ¿sobre qué tarjeta?
      const card = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest(
        "[data-card]",
      ) as HTMLElement | null;
      velocity.current = 0;
      if (card) goTo(Number(card.dataset.card));
      else target.current = Math.round(angle.current / STEP) * STEP;
    } else if (Math.abs(velocity.current) < 0.03) {
      velocity.current = 0;
      target.current = Math.round(angle.current / STEP) * STEP;
    }
  };

  const accentStyle = { ["--accent" as string]: project.accent } as CSSProperties;

  return (
    <section id="proyectos" className="relative overflow-x-clip py-24 sm:py-32" style={accentStyle}>
      <div className="dots-bg pointer-events-none absolute inset-0 opacity-25" />
      <div
        className="drift pointer-events-none absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full transition-colors duration-700"
        style={{ background: `radial-gradient(circle, ${project.accent}22, transparent 65%)` }}
      />

      <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <Eyebrow n="01" label="Proyectos" />
            <h2 className="mt-6 font-display text-[clamp(2.2rem,6.2vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.04em] text-white">
              Lo que he
              <br />
              <span className="text-gradient">construido.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4">
            <p className="text-[1rem] leading-relaxed text-soft">
              {N} proyectos en un anillo que gira. Arrastra, usa las flechas o toca una tarjeta
              para traerla al frente y leer el detalle. Los que tienen demo, puedes probarlos.
            </p>
          </Reveal>
        </div>

        {/* Escena 3D */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="group"
          aria-label="Carrusel de proyectos. Usa las flechas izquierda y derecha."
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onMouseEnter={() => (hover.current = true)}
          onMouseLeave={() => (hover.current = false)}
          data-hover
          className="relative mt-14 select-none outline-none [touch-action:pan-y] focus-visible:ring-1 focus-visible:ring-lime/60"
          style={{ height: dim.h + 70, perspective: "1700px", perspectiveOrigin: "50% 42%" }}
        >
          <div
            ref={ringRef}
            className="preserve-3d absolute left-1/2 top-1/2"
            style={{ width: 0, height: 0 }}
          >
            {projects.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                data-card={i}
                className="absolute"
                style={{
                  width: dim.w,
                  height: dim.h,
                  left: -dim.w / 2,
                  top: -dim.h / 2,
                  transform: `rotateY(${i * STEP}deg) translateZ(${dim.r}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <article
                  className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border bg-panel p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
                  style={{ borderColor: `${p.accent}55` }}
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full"
                    style={{ background: `radial-gradient(circle, ${p.accent}30, transparent 70%)` }}
                  />
                  <div className="relative flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mute">
                    <span style={{ color: p.accent }}>
                      {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border px-2.5 py-1" style={{ borderColor: `${p.accent}66`, color: p.accent }}>
                      {p.status}
                    </span>
                  </div>

                  <div className="relative mt-4 h-[38%] overflow-hidden rounded-2xl border border-white/[0.07] bg-ink/60">
                    <div className="grid-bg absolute inset-0 opacity-50" />
                    <div className="relative h-full p-3">
                      <ProjectArt art={p.art} accent={p.accent} />
                    </div>
                  </div>

                  <h3 className="relative mt-5 font-display text-[1.35rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
                    {p.title}
                  </h3>
                  <p className="relative mt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mute">
                    {p.kind}
                  </p>
                  <p className="relative mt-3 line-clamp-3 text-[0.85rem] leading-relaxed text-soft">
                    {p.tagline}
                  </p>

                  <div className="relative mt-auto flex flex-wrap gap-1.5 pt-3">
                    {p.stack.slice(0, 3).map((s) => (
                      <span key={s} className="chip !px-2.5 !py-1 !text-[0.58rem]">
                        {s}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Controles */}
        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Proyecto anterior"
            className="btn-ghost grid h-12 w-12 place-items-center !p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                aria-label={`Ver ${p.title}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === active ? "w-9" : "w-3 bg-white/20 hover:bg-white/40",
                )}
                style={i === active ? { background: project.accent } : undefined}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Proyecto siguiente"
            className="btn-ghost grid h-12 w-12 place-items-center !p-0"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Detalle del proyecto activo */}
        <div
          key={project.id}
          className="pop panel mt-14 grid gap-10 rounded-[2rem] p-6 sm:p-10 lg:grid-cols-12"
          style={{ borderColor: `${project.accent}40` }}
          onMouseEnter={() => (hover.current = true)}
          onMouseLeave={() => (hover.current = false)}
        >
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip" style={{ borderColor: `${project.accent}66`, color: project.accent }}>
                {project.status}
              </span>
              <span className="chip">{project.kind}</span>
            </div>
            <h3 className="mt-5 font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-[1] tracking-[-0.04em] text-white">
              {project.title}
            </h3>
            <p className="mt-4 font-display text-[1.05rem] font-semibold leading-snug tracking-[-0.01em]" style={{ color: project.accent }}>
              {project.tagline}
            </p>
            <p className="mt-4 text-[1rem] leading-relaxed text-soft">{project.description}</p>

            {project.demo && (
              <button
                onClick={() => onOpenDemo(project.demo!)}
                className="btn-lime group mt-7 px-6 py-3.5 text-sm"
              >
                Probar la demo
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}

            <p className="mt-7 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-mute">Stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-mute">
              Lo más interesante
            </p>
            <ul className="mt-4 space-y-4">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3.5">
                  <span
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full"
                    style={{ background: `${project.accent}22`, color: project.accent }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[0.97rem] leading-relaxed text-soft">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
