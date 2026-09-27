import { useLayoutEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Hero, Ticker } from "@/components/Hero";
import { About } from "@/components/About";
import { WebDev } from "@/components/WebDev";
import { Automations } from "@/components/Automations";
import { ImpactStats } from "@/components/ImpactStats";
import { Apps } from "@/components/Apps";
import { Sectors } from "@/components/Sectors";
import { WhyMe } from "@/components/WhyMe";
import { Contact } from "@/components/Contact";
import { DemoDock } from "@/components/DemoDock";
import { RestaurantDemo } from "@/components/restaurant/RestaurantDemo";
import type { AutomationId } from "@/data/site";

export default function App() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [autoTab, setAutoTab] = useState<AutomationId>("chatbot");
  const openDemo = () => setDemoOpen(true);

  // Refuerzo: garantizar que la entrada a la página sea por el principio.
  useLayoutEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const pickAutomation = (id: AutomationId) => {
    setAutoTab(id);
    document.getElementById("automatizacion")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen bg-black antialiased">
      <Nav />

      <main>
        <Hero />
        <Ticker />
        <About />
        <WebDev onOpenDemo={openDemo} />
        <Automations active={autoTab} onSelect={setAutoTab} />
        <ImpactStats />
        <Apps />
        <Sectors onOpenDemo={openDemo} />
        <WhyMe />
        <Contact />
      </main>

      <DemoDock openDemo={openDemo} pickAutomation={pickAutomation} hidden={demoOpen} />
      <RestaurantDemo open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
