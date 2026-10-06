import { useCallback, useState } from "react";
import { Boot } from "@/components/Boot";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Bands } from "@/components/Bands";
import { Projects } from "@/components/Projects";
import { Demos, DemoHost } from "@/components/Demos";
import { Story } from "@/components/Story";
import { Lab } from "@/components/Lab";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import type { DemoId } from "@/data/content";

export default function App() {
  const [demo, setDemo] = useState<DemoId | null>(null);

  const closeDemo = useCallback(() => setDemo(null), []);

  // Cierra la demo y baja al formulario de contacto.
  const goContact = useCallback(() => {
    setDemo(null);
    window.setTimeout(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink antialiased">
      <Boot />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Bands />
        <Projects onOpenDemo={setDemo} />
        <Demos onOpen={setDemo} onContact={goContact} />
        <Story />
        <Lab />
        <Services />
        <Contact />
      </main>
      <DemoHost demo={demo} onClose={closeDemo} onContact={goContact} />
    </div>
  );
}
