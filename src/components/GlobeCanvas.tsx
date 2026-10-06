import { useEffect, useRef } from "react";
import { demoOpen, prefersReducedMotion } from "./ui";

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

/** Inclina un punto: primero en Z y luego en X (la inclinación fija de cada anillo). */
function tilt(p: V3, rx: number, rz: number): V3 {
  const c = Math.cos(rz);
  const s = Math.sin(rz);
  const x = p[0] * c - p[1] * s;
  const y = p[0] * s + p[1] * c;
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  return [x, y * cx - p[2] * sx, y * sx + p[2] * cx];
}

type Ring = { radius: number; tiltX: number; tiltZ: number; speed: number; sats: number };
const RINGS: Ring[] = [
  { radius: 1.38, tiltX: 1.15, tiltZ: 0.35, speed: 0.00042, sats: 2 },
  { radius: 1.62, tiltX: 0.55, tiltZ: -0.7, speed: -0.00028, sats: 3 },
  { radius: 1.2, tiltX: 1.45, tiltZ: -0.25, speed: 0.0006, sats: 1 },
];

/* Estilos de color precalculados: no se construyen cadenas de texto en cada fotograma */
const LEVELS = 12;
const FRONT = Array.from({ length: LEVELS }, (_, i) => `rgba(200,255,62,${((i + 1) / LEVELS).toFixed(2)})`);
const BACK = Array.from({ length: LEVELS }, (_, i) => `rgba(150,175,195,${(((i + 1) / LEVELS) * 0.6).toFixed(2)})`);
const MERI = Array.from({ length: 8 }, (_, i) => `rgba(200,255,62,${(0.05 + (i / 7) * 0.2).toFixed(2)})`);

/** Resplandor ya dibujado, para estamparlo donde haga falta (mucho más barato que `shadowBlur`). */
function glowSprite(r: number, g: number, b: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  if (x) {
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(${r},${g},${b},1)`);
    gr.addColorStop(0.28, `rgba(${r},${g},${b},0.5)`);
    gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
  }
  return c;
}

// Máximo de fotogramas por segundo: ~45 en ordenador y ~30 en el móvil. Se ve igual de fluido y
// el teléfono hace la mitad de trabajo.
const FRAME_MS = typeof window !== "undefined" && window.innerWidth < 760 ? 1000 / 30 : 1000 / 45;

/**
 * Esfera 3D de puntos que gira, con meridianos, anillos y satélites.
 * Reacciona al ratón. Se detiene cuando no se ve, cuando hay una demo abierta
 * o cuando el visitante pausa las animaciones.
 */
export function GlobeCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const small = window.innerWidth < 760;
    const pts = fibonacciSphere(small ? 300 : 700);
    const markers = Array.from({ length: 12 }, (_, i) => pts[Math.floor((i + 0.5) * (pts.length / 12))]);
    const meridians: V3[][] = [0, 1, 2].map((m) => {
      const lon = (m * Math.PI) / 3;
      return Array.from({ length: 61 }, (_, i) => {
        const t = (i / 60) * Math.PI * 2;
        return [Math.cos(t) * Math.cos(lon), Math.sin(t), Math.cos(t) * Math.sin(lon)] as V3;
      });
    });
    // Los anillos ya vienen inclinados: cada fotograma solo se les aplica el giro general
    const ringPts = RINGS.map((ring) =>
      Array.from({ length: 97 }, (_, i) => {
        const t = (i / 96) * Math.PI * 2;
        return tilt([Math.cos(t) * ring.radius, 0, Math.sin(t) * ring.radius], ring.tiltX, ring.tiltZ);
      }),
    );
    const stars = Array.from({ length: small ? 36 : 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.5 + 0.1,
    }));
    const lime = glowSprite(200, 255, 62);
    const cyan = glowSprite(94, 242, 255);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let lastDraw = 0;
    let rotY = 0.6;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    // Capas que no cambian entre fotogramas: se dibujan una vez, al cambiar de tamaño
    let layer: HTMLCanvasElement | null = null;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      // en el móvil se dibuja a resolución normal (no a la de pantalla retina): 2-3 veces menos píxeles
      dpr = small ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      layer = document.createElement("canvas");
      layer.width = canvas.width;
      layer.height = canvas.height;
      const l = layer.getContext("2d");
      if (l) {
        l.setTransform(dpr, 0, 0, dpr, 0, 0);
        for (const s of stars) {
          l.fillStyle = `rgba(255,255,255,${s.a})`;
          l.fillRect(s.x * w, s.y * h, s.s, s.s);
        }
        const wide = w >= 900;
        const cx = wide ? w * 0.7 : w * 0.5;
        const cy = wide ? h * 0.5 : h * 0.42;
        const R = Math.min(w, h) * (wide ? 0.36 : 0.34);
        const g = l.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.9);
        g.addColorStop(0, "rgba(200,255,62,0.10)");
        g.addColorStop(0.55, "rgba(94,242,255,0.035)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        l.fillStyle = g;
        l.fillRect(0, 0, w, h);
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(60, now - last);
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      rotY += dt * 0.0004 + mouse.x * dt * 0.00018;
      const rotX = 0.38 + mouse.y * 0.3;
      const cY = Math.cos(rotY);
      const sY = Math.sin(rotY);
      const cR = Math.cos(rotY * 0.6); // los anillos giran un poco más despacio que la esfera
      const sR = Math.sin(rotY * 0.6);
      const cX = Math.cos(rotX);
      const sX = Math.sin(rotX);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (layer) ctx.drawImage(layer, 0, 0, w, h);

      const wide = w >= 900;
      const cx = wide ? w * 0.7 : w * 0.5;
      const cy = wide ? h * 0.5 : h * 0.42;
      const R = Math.min(w, h) * (wide ? 0.36 : 0.34);
      const cam = 3.2;
      const k0 = small ? 0.85 : 1;

      /* Puntos de la esfera */
      let style = "";
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x = p[0] * cY + p[2] * sY;
        const z1 = -p[0] * sY + p[2] * cY;
        const y = p[1] * cX - z1 * sX;
        const z = p[1] * sX + z1 * cX;
        const k = cam / (cam - z);
        const d = (z + 1) * 0.5; // 0 detrás · 1 delante
        const a = 0.16 + 0.84 * Math.pow(d, 1.15);
        const level = Math.min(LEVELS - 1, (a * LEVELS) | 0);
        const st = z > 0 ? FRONT[level] : BACK[level];
        if (st !== style) {
          ctx.fillStyle = st;
          style = st;
        }
        const size = (1 + d * 2.1) * k0;
        ctx.fillRect(cx + x * R * k - size / 2, cy + y * R * k - size / 2, size, size);
      }

      /* Meridianos: solo la mitad de delante, para que se note que giran */
      ctx.lineWidth = 1;
      for (const line of meridians) {
        let px0 = 0;
        let py0 = 0;
        let pz0 = -1;
        for (let i = 0; i < line.length; i++) {
          const p = line[i];
          const x = p[0] * cY + p[2] * sY;
          const z1 = -p[0] * sY + p[2] * cY;
          const y = p[1] * cX - z1 * sX;
          const z = p[1] * sX + z1 * cX;
          const k = cam / (cam - z);
          const px = cx + x * R * k;
          const py = cy + y * R * k;
          if (i > 0 && z > 0 && pz0 > 0) {
            ctx.strokeStyle = MERI[Math.min(7, (z * 8) | 0)];
            ctx.beginPath();
            ctx.moveTo(px0, py0);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
          px0 = px;
          py0 = py;
          pz0 = z;
        }
      }

      /* Puntos brillantes que giran con la esfera */
      for (let i = 0; i < markers.length; i++) {
        const p = markers[i];
        const x = p[0] * cY + p[2] * sY;
        const z1 = -p[0] * sY + p[2] * cY;
        const y = p[1] * cX - z1 * sX;
        const z = p[1] * sX + z1 * cX;
        if (z < -0.15) continue;
        const k = cam / (cam - z);
        const d = (z + 1) * 0.5;
        const r = (2 + d * 2.6) * (1 + 0.25 * Math.sin(now / 380 + i * 1.7));
        ctx.globalAlpha = 0.4 + d * 0.6;
        ctx.drawImage(lime, cx + x * R * k - r * 2.6, cy + y * R * k - r * 2.6, r * 5.2, r * 5.2);
      }
      ctx.globalAlpha = 1;

      /* Anillos con satélites */
      ctx.strokeStyle = "rgba(200,255,62,0.3)";
      for (let n = 0; n < RINGS.length; n++) {
        const ring = RINGS[n];
        const line = ringPts[n];
        ctx.beginPath();
        for (let i = 0; i < line.length; i++) {
          const p = line[i];
          const x = p[0] * cR + p[2] * sR;
          const z1 = -p[0] * sR + p[2] * cR;
          const y = p[1] * cX - z1 * sX;
          const z = p[1] * sX + z1 * cX;
          const k = cam / (cam - z);
          if (i === 0) ctx.moveTo(cx + x * R * k, cy + y * R * k);
          else ctx.lineTo(cx + x * R * k, cy + y * R * k);
        }
        ctx.stroke();

        for (let s = 0; s < ring.sats; s++) {
          const t = now * ring.speed + (s / ring.sats) * Math.PI * 2;
          const p = tilt([Math.cos(t) * ring.radius, 0, Math.sin(t) * ring.radius], ring.tiltX, ring.tiltZ);
          const x = p[0] * cR + p[2] * sR;
          const z1 = -p[0] * sR + p[2] * cR;
          const y = p[1] * cX - z1 * sX;
          const z = p[1] * sX + z1 * cX;
          const k = cam / (cam - z);
          const d = (z + 1) * 0.5;
          const r = 2 + d * 3;
          ctx.globalAlpha = 0.5 + d * 0.5;
          ctx.drawImage(cyan, cx + x * R * k - r * 2.8, cy + y * R * k - r * 2.8, r * 5.6, r * 5.6);
        }
        ctx.globalAlpha = 1;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || demoOpen()) {
        last = now; // al volver, sin saltos
        return;
      }
      if (now - lastDraw < FRAME_MS - 2) return;
      lastDraw = now;
      draw(now);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    const paused = prefersReducedMotion(); // el visitante pidió las animaciones quietas
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (paused) draw(performance.now());
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    if (paused) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
