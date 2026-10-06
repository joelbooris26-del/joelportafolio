import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Si se acaba de pulsar el botón de pausa/animaciones, se vuelve al punto donde se estaba.
try {
  const y = Number(window.sessionStorage.getItem("jm:scroll"));
  if (y > 0 && !window.location.hash) {
    window.sessionStorage.removeItem("jm:scroll");
    [60, 250, 700].forEach((ms) => window.setTimeout(() => window.scrollTo(0, y), ms));
  }
} catch {
  /* sin almacenamiento */
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
