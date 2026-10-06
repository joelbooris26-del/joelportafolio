import { useEffect, useRef } from "react";
import { demoOpen } from "./ui";

type V3 = [number, number, number];

/** Puntos repartidos de forma uniforme sobre una esfera (espiral de Fibonacci). */
function fibonacciSphere(n: number): V3[] {
  const pts: V3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return pts;
}

type Ring = { radius: number; tiltX: number; tiltZ: number; speed: number; sats: number };

const RINGS: Ring[] = [
  { radius: 1.38, tiltX: 1.15, tiltZ: 0.35, speed: 0.00042, sats: 2 },
  { radius: 1.62, tiltX: 0.55, tiltZ: -0.7, speed: -0.00028, sats: 3 },
  { radius: 1.2, tiltX: 1.45, tiltZ: -0.25, speed: 0.0006, sats: 1 },
];

/**
 * Esfera 3D de puntos que gira, con anillos y satélites orbitando.
 * Reacciona al ratón. Se pausa cuando no se ve.
 */
export function GlobeCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Esta esfera es decorativa y gira despacio: se anima siempre, aunque el sistema
    // tenga «reducir movimiento», porque sin giro pierde todo su sentido.
    const small = window.innerWidth < 760;
    const pts = fibonacciSphere(small ? 440 : 800);

    // Puntos brillantes fijos sobre la esfera (giran con ella: marcan bien el movimiento)
    const markers = Array.from({ length: 12 }, (_, i) => pts[Math.floor((i + 0.5) * (pts.length / 12))]);

    // Tres meridianos (círculos máximos) que también giran con la esfera
    const meridians: V3[][] = [0, 1, 2].map((m) => {
      const lon = (m * Math.PI) / 3;
      return Array.from({ length: 73 }, (_, i) => {
        const t = (i / 72) * Math.PI * 2;
        return [Math.cos(t) * Math.cos(lon), Math.sin(t), Math.cos(t) * Math.sin(lon)] as V3;
      });
    });
    const stars = Array.from({ length: small ? 40 : 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.5 + 0.1,
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let rotY = 0.6;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    const rot = (p: V3, ry: number, rx: number, rz = 0): V3 => {
      let [x, y, z] = p;
      // Z
      if (rz) {
        const c = Math.cos(rz);
        const s = Math.sin(rz);
        [x, y] = [x * c - y * s, x * s + y * c];
      }
      // Y
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      [x, z] = [x * cy + z * sy, -x * sy + z * cy];
      // X
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      [y, z] = [y * cx - z * sx, y * sx + z * cx];
      return [x, y, z];
    };

    const draw = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      rotY += dt * 0.0004 + mouse.x * dt * 0.00018;
      const rotX = 0.38 + mouse.y * 0.3;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // estrellas de fondo
      for (const s of stars) {
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fillRect(s.x * w, s.y * h, s.s, s.s);
      }

      const wide = w >= 900;
      const cx = wide ? w * 0.7 : w * 0.5;
      const cy = wide ? h * 0.5 : h * 0.42;
      const R = Math.min(w, h) * (wide ? 0.36 : 0.34);
      const cam = 3.2;

      // halo
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.9);
      g.addColorStop(0, "rgba(200,255,62,0.10)");
      g.addColorStop(0.55, "rgba(94,242,255,0.035)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // puntos de la esfera
      for (const p of pts) {
        const [x, y, z] = rot(p, rotY, rotX);
        const k = cam / (cam - z);
        const px = cx + x * R * k;
        const py = cy + y * R * k;
        const d = (z + 1) / 2; // 0 detrás · 1 delante
        const a = 0.16 + 0.84 * Math.pow(d, 1.15);
        const size = (1 + d * 2.1) * (w < 760 ? 0.85 : 1);
        if (z > 0) ctx.fillStyle = `rgba(200,255,62,${a})`;
        else ctx.fillStyle = `rgba(150,175,195,${a * 0.6})`;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }

      // meridianos: solo se ve la mitad de delante, para que se note que giran
      ctx.lineWidth = 1;
      for (const line of meridians) {
        let prev: [number, number, number] | null = null;
        for (const p of line) {
          const [x, y, z] = rot(p, rotY, rotX);
          const k = cam / (cam - z);
          const px = cx + x * R * k;
          const py = cy + y * R * k;
          if (prev && z > 0 && prev[2] > 0) {
            ctx.strokeStyle = `rgba(200,255,62,${0.05 + 0.2 * z})`;
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
          prev = [px, py, z];
        }
      }

      // puntos brillantes que giran con la esfera
      markers.forEach((p, i) => {
        const [x, y, z] = rot(p, rotY, rotX);
        if (z < -0.15) return;
        const k = cam / (cam - z);
        const d = (z + 1) / 2;
        const pulse = 1 + 0.25 * Math.sin(now / 380 + i * 1.7);
        ctx.beginPath();
        ctx.arc(cx + x * R * k, cy + y * R * k, (2 + d * 2.6) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,255,62,${0.35 + d * 0.65})`;
        ctx.shadowColor = "rgba(200,255,62,0.95)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // anillos con satélites
      for (const ring of RINGS) {
        const steps = 120;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2;
          const base: V3 = [Math.cos(t) * ring.radius, 0, Math.sin(t) * ring.radius];
          const [x, y, z] = rot(rot(base, 0, ring.tiltX, ring.tiltZ), rotY * 0.6, rotX);
          const k = cam / (cam - z);
          const px = cx + x * R * k;
          const py = cy + y * R * k;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "rgba(200,255,62,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        for (let s = 0; s < ring.sats; s++) {
          const t = now * ring.speed + (s / ring.sats) * Math.PI * 2;
          const base: V3 = [Math.cos(t) * ring.radius, 0, Math.sin(t) * ring.radius];
          const [x, y, z] = rot(rot(base, 0, ring.tiltX, ring.tiltZ), rotY * 0.6, rotX);
          const k = cam / (cam - z);
          const px = cx + x * R * k;
          const py = cy + y * R * k;
          const d = (z + 1) / 2;
          ctx.beginPath();
          ctx.arc(px, py, 2 + d * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(94,242,255,${0.45 + d * 0.55})`;
          ctx.shadowColor = "rgba(94,242,255,0.9)";
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    const loop = (now: number) => {
      if (visible && !demoOpen()) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
