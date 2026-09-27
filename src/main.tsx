import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

/* ── Entrar siempre por el principio de la página ──────────────────────────
   El navegador restaura la posición de scroll de la visita anterior en el
   evento `load`, es decir, DESPUÉS de que este archivo se ejecute. Por eso
   hay que volver a subir en varios momentos del ciclo de vida, no solo al
   principio. Se respeta el ancla (#contacto, #web…) si el enlace la trae. */

const hasAnchor = () =>
  typeof window !== "undefined" && window.location.hash.length > 1;

const goTop = () => {
  if (hasAnchor()) return;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

if (typeof window !== "undefined") {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  goTop();

  // El navegador suele mover el scroll justo al terminar de cargar.
  window.addEventListener("load", goTop);

  // Cubre la navegación "atrás/adelante" desde la caché del navegador.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) goTop();
  });

  // Últimos refuerzos por si alguna fuente (fuentes, imágenes, iframes)
  // desplaza la página después de cargar.
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(goTop);
      window.setTimeout(goTop, 60);
      window.setTimeout(goTop, 220);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
