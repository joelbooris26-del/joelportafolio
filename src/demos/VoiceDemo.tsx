import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { ICheck, IPhone, IPhoneOff, IReset, IVolume, IVolumeOff, IArrow, type DemoProps } from "./kit";

/* ══════════════════ Guiones ══════════════════
   Cada escenario es un árbol corto: lo que dice el agente, lo que puedes
   contestar tú y lo que hace por detrás (acciones). Texto y datos ficticios. */

type Option = { label: string; say: string; to: string };
type End = { title: string; text: string; result: string[] };
type Node = { agent: string; actions?: string[]; options?: Option[]; end?: End };
type Scenario = {
  id: string;
  tab: string;
  business: string;
  initials: string;
  number: string;
  intro: string;
  start: string;
  nodes: Record<string, Node>;
};

const scenarios: Scenario[] = [
  {
    id: "dental",
    tab: "Clínica dental",
    business: "Clínica Dental Sonrisa Sur",
    initials: "SS",
    number: "+34 956 00 12 30",
    intro: "Una paciente llama a la clínica. Elige qué quieres preguntar.",
    start: "hola",
    nodes: {
      hola: {
        agent: "Clínica Dental Sonrisa Sur, le atiende Lucía, la asistente virtual. ¿En qué puedo ayudarle?",
        actions: ["Llamada recibida · transcripción en directo"],
        options: [
          { label: "Quiero cambiar mi cita", say: "Hola, quería cambiar mi cita de mañana.", to: "mover" },
          { label: "Me duele una muela", say: "Me duele mucho una muela, ¿podéis verme hoy?", to: "urg" },
          { label: "¿Cuánto cuesta una limpieza?", say: "¿Cuánto cuesta una limpieza?", to: "precio" },
        ],
      },
      mover: {
        agent: "Claro. ¿Me dice su nombre y su teléfono para localizar la cita?",
        options: [{ label: "María Valenzuela, 600 111 222", say: "María Valenzuela, seis cero cero, uno uno uno, dos dos dos.", to: "mover2" }],
      },
      mover2: {
        agent:
          "Gracias, María. Tiene cita mañana a las 10:30 con la higienista Ana. Puedo moverla al viernes a las 11:00 o a mañana a las 16:30. ¿Qué prefiere?",
        actions: ["leer_agenda(paciente: María V.)", "buscar_huecos() → 2 opciones reales"],
        options: [
          { label: "El viernes a las 11", say: "El viernes a las once, por favor.", to: "mover3" },
          { label: "Mañana a las 16:30", say: "Mañana a las cuatro y media me viene bien.", to: "mover3b" },
        ],
      },
      mover3: {
        agent: "Hecho: su cita queda el viernes a las 11:00. Le acabo de enviar la confirmación por WhatsApp. ¿Puedo ayudarle en algo más?",
        actions: ["mover_cita(viernes 11:00)", "liberar_hueco(mañana 10:30) → lista de espera", "enviar_whatsapp(confirmación)"],
        options: [{ label: "No, muchas gracias", say: "No, muchas gracias.", to: "fin_mover" }],
      },
      mover3b: {
        agent: "Hecho: su cita queda mañana a las 16:30. Le acabo de enviar la confirmación por WhatsApp. ¿Puedo ayudarle en algo más?",
        actions: ["mover_cita(mañana 16:30)", "liberar_hueco(mañana 10:30) → lista de espera", "enviar_whatsapp(confirmación)"],
        options: [{ label: "No, muchas gracias", say: "No, muchas gracias.", to: "fin_mover" }],
      },
      fin_mover: {
        agent: "Perfecto, que tenga un buen día.",
        end: {
          title: "Cita movida sin que recepción haga nada",
          text: "La paciente cambió su cita por teléfono. El agente la localizó, ofreció huecos reales, actualizó la agenda y avisó por WhatsApp.",
          result: [
            "Agenda actualizada al momento",
            "Hueco liberado y ofrecido a la lista de espera",
            "Confirmación enviada por WhatsApp",
            "Resumen guardado en la ficha de la paciente",
          ],
        },
      },
      urg: {
        agent: "Siento que le duela. Una pregunta importante: ¿tiene hinchazón en la cara o le cuesta tragar o respirar?",
        actions: ["clasificar_urgencia()"],
        options: [
          { label: "No, solo me duele", say: "No, solo me duele la muela.", to: "urg2" },
          { label: "Sí, tengo la cara hinchada", say: "Sí, tengo la cara hinchada y me cuesta tragar.", to: "urg112" },
        ],
      },
      urg2: {
        agent: "Gracias. Le reservo un hueco de urgencia hoy a las 18:15 con el doctor de guardia. Hasta entonces, no se automedique. ¿Le viene bien?",
        actions: ["crear_cita(urgencia · hoy 18:15)", "avisar_equipo(doctor de guardia)"],
        options: [{ label: "Sí, allí estaré", say: "Sí, allí estaré, gracias.", to: "fin_urg" }],
      },
      fin_urg: {
        agent: "Queda confirmado. Le enviamos la dirección por WhatsApp. Que se mejore.",
        actions: ["enviar_whatsapp(dirección + cómo llegar)"],
        end: {
          title: "Urgencia atendida y priorizada",
          text: "Sin señales de alarma: se le dio hueco el mismo día y se avisó al doctor de guardia. El agente nunca diagnostica.",
          result: [
            "Cita de urgencia creada para hoy a las 18:15",
            "Doctor de guardia avisado en su móvil",
            "Dirección enviada por WhatsApp",
            "Ningún dato clínico guardado en la llamada",
          ],
        },
      },
      urg112: {
        agent: "Eso puede ser grave. Llame ahora mismo al 112. Yo aviso al equipo de la clínica para que lo sepan.",
        actions: ["derivar(112)", "avisar_equipo(prioridad máxima)"],
        end: {
          title: "Posible urgencia grave: derivada al 112",
          text: "El agente reconoció señales de alarma, no intentó resolver nada y derivó a emergencias avisando a la clínica.",
          result: ["Derivación inmediata al 112", "Equipo avisado con prioridad máxima", "Registro de la llamada guardado"],
        },
      },
      precio: {
        agent: "La limpieza con ultrasonidos cuesta 45 euros y dura unos 45 minutos. ¿Quiere que le reserve una?",
        actions: ["consultar_tarifas(limpieza)"],
        options: [
          { label: "Sí, el jueves por la tarde", say: "Sí, el jueves por la tarde si puede ser.", to: "precio2" },
          { label: "Solo preguntaba, gracias", say: "Solo preguntaba, gracias.", to: "fin_info" },
        ],
      },
      precio2: {
        agent: "Tengo el jueves a las 17:30. ¿A nombre de quién la pongo?",
        actions: ["buscar_huecos(jueves tarde)"],
        options: [{ label: "Pablo Torres", say: "A nombre de Pablo Torres.", to: "precio3" }],
      },
      precio3: {
        agent: "Reservada, Pablo: jueves a las 17:30. Le llega un WhatsApp con la confirmación y otro recordatorio el día antes.",
        actions: ["crear_cita(limpieza · jueves 17:30)", "programar_recordatorio(24 h antes)"],
        end: {
          title: "Paciente nuevo con cita, sin descolgar nadie",
          text: "Una llamada fuera de hora que antes se perdía acaba en cita confirmada y con recordatorio.",
          result: ["Paciente nuevo registrado", "Cita de limpieza creada", "Recordatorio programado 24 h antes", "Confirmación enviada por WhatsApp"],
        },
      },
      fin_info: {
        agent: "Sin problema. Aquí estamos cuando lo necesite.",
        end: {
          title: "Consulta de precio resuelta",
          text: "Una duda típica que consume tiempo de recepción, resuelta al instante y sin presionar.",
          result: ["Precio y duración dados al instante", "Llamada resumida en el historial", "Recepción libre para atender a quien está en la clínica"],
        },
      },
    },
  },
  {
    id: "restaurante",
    tab: "Restaurante",
    business: "La Taberna del Peñón",
    initials: "TP",
    number: "+34 956 00 45 67",
    intro: "Un cliente llama para reservar mesa. Elige qué quieres hacer.",
    start: "hola",
    nodes: {
      hola: {
        agent: "La Taberna del Peñón, buenas. Soy Sofía, la asistente. ¿Quiere reservar mesa o necesita algo más?",
        actions: ["Llamada recibida · transcripción en directo"],
        options: [
          { label: "Mesa para cuatro mañana por la noche", say: "Quería una mesa para cuatro mañana por la noche.", to: "r2" },
          { label: "¿Tenéis algo sin gluten?", say: "¿Tenéis algo sin gluten?", to: "g1" },
        ],
      },
      r2: {
        agent: "Perfecto. Mañana por la noche tengo 20:30 y 22:00 para cuatro. A las 21:00 ya solo quedan dos plazas. ¿Cuál prefiere?",
        actions: ["consultar_aforo(mañana · 4 personas)", "descartar_huecos_completos(21:00)"],
        options: [
          { label: "A las 20:30", say: "A las ocho y media.", to: "r3" },
          { label: "A las 22:00", say: "A las diez.", to: "r3" },
        ],
      },
      r3: {
        agent: "Anotado. ¿A nombre de quién, y hay alguna alergia o intolerancia en la mesa?",
        options: [{ label: "Laura, y uno es celíaco", say: "A nombre de Laura, y uno de nosotros es celíaco.", to: "r4" }],
      },
      r4: {
        agent: "Gracias, Laura. Dejo la mesa para cuatro con nota de celiaquía para que cocina prepare sin gluten. Le mando la confirmación por WhatsApp.",
        actions: ["crear_reserva(4 personas)", "añadir_nota(celiaquía → cocina)", "enviar_whatsapp(confirmación + ubicación)", "programar_recordatorio(mañana 10:00)"],
        options: [{ label: "Genial, gracias", say: "Genial, muchas gracias.", to: "fin_r" }],
      },
      fin_r: {
        agent: "A usted. Hasta mañana, Laura.",
        end: {
          title: "Mesa reservada con alergia anotada",
          text: "Reserva de grupo tomada por teléfono en un momento de servicio, comprobando el aforo real y avisando a cocina.",
          result: ["Reserva creada comprobando el aforo real", "Celiaquía avisada a cocina", "WhatsApp de confirmación enviado", "Recordatorio automático mañana a las 10:00"],
        },
      },
      g1: {
        agent:
          "Sí: las tortillitas de camarones, el tataki de atún, el arroz con carabinero y la tarta de queso son sin gluten. Cocina sigue un protocolo para evitar contaminación cruzada. ¿Le reservo mesa?",
        actions: ["consultar_carta(filtro: sin gluten)"],
        options: [
          { label: "Sí, para dos esta noche", say: "Sí, para dos esta noche.", to: "g2" },
          { label: "Todavía no, gracias", say: "Todavía no, gracias.", to: "fin_g" },
        ],
      },
      g2: {
        agent: "Esta noche tengo hueco a las 21:30. ¿A nombre de quién?",
        actions: ["consultar_aforo(hoy · 2 personas)"],
        options: [{ label: "Marcos", say: "A nombre de Marcos.", to: "g3" }],
      },
      g3: {
        agent: "Reservado, Marcos: hoy a las 21:30 para dos, con nota de menú sin gluten.",
        actions: ["crear_reserva(2 personas · hoy 21:30)", "añadir_nota(menú sin gluten → cocina)", "enviar_whatsapp(confirmación)"],
        end: {
          title: "Duda de alérgenos convertida en reserva",
          text: "Una pregunta que suele quedarse en nada acaba en mesa reservada y con cocina avisada.",
          result: ["Carta filtrada por alérgenos al instante", "Reserva para esta noche", "Cocina avisada del menú sin gluten"],
        },
      },
      fin_g: {
        agent: "Cuando quiera. ¡Buen provecho!",
        end: {
          title: "Consulta resuelta sin molestar al equipo",
          text: "La duda de alérgenos queda resuelta con información fiable de la carta, sin que nadie del equipo tenga que parar.",
          result: ["Respuesta fiable sobre alérgenos", "Llamada registrada", "Equipo sin interrupciones en pleno servicio"],
        },
      },
    },
  },
  {
    id: "inmobiliaria",
    tab: "Inmobiliaria",
    business: "Costa Sur Inmuebles",
    initials: "CS",
    number: "+34 956 00 78 90",
    intro: "Un interesado llama por un piso. El agente lo cualifica y agenda la visita.",
    start: "hola",
    nodes: {
      hola: {
        agent: "Costa Sur Inmuebles, le atiende Álex, el asistente virtual. ¿Llama por alguno de nuestros pisos?",
        actions: ["Llamada recibida · transcripción en directo"],
        options: [
          { label: "Sí, por el piso de tres habitaciones", say: "Sí, llamo por el piso de tres habitaciones del centro.", to: "i2" },
          { label: "Quiero vender mi casa", say: "Quiero vender mi casa.", to: "v1" },
        ],
      },
      i2: {
        agent: "Buena elección: está en el centro, tiene tres habitaciones y cuesta 145.000 euros. ¿Busca comprar o alquilar, y para cuándo?",
        actions: ["identificar_inmueble(ref. P-203)"],
        options: [{ label: "Comprar, en unos tres meses", say: "Comprar, en unos tres meses.", to: "i3" }],
      },
      i3: {
        agent: "Perfecto. Para orientar bien la visita: ¿va a necesitar financiar con hipoteca?",
        options: [{ label: "Sí, parte con hipoteca", say: "Sí, necesito financiar una parte.", to: "i4" }],
      },
      i4: {
        agent: "Entendido. Puedo agendarle una visita con nuestro agente Lucas el jueves a las 12:00 o el viernes a las 18:00. ¿Cuál le encaja?",
        actions: ["cualificar_lead(compra · 3 meses · con hipoteca)", "buscar_huecos(agente: Lucas)"],
        options: [{ label: "El viernes a las 18:00", say: "El viernes a las seis de la tarde.", to: "i5" }],
      },
      i5: {
        agent: "Hecho. Visita el viernes a las 18:00. Le envío la ubicación y la ficha del piso por WhatsApp, y Lucas recibe sus datos para prepararla.",
        actions: ["crear_visita(viernes 18:00 · Lucas)", "enviar_whatsapp(ficha + ubicación)", "guardar_lead(CRM · caliente)"],
        end: {
          title: "Lead cualificado y visita agendada",
          text: "Antes de que un comercial coja el teléfono, el interesado ya está cualificado y con visita en la agenda.",
          result: ["Perfil del comprador guardado (plazo e hipoteca)", "Visita creada en la agenda de Lucas", "Ficha y ubicación enviadas por WhatsApp", "Lead marcado como caliente en el CRM"],
        },
      },
      v1: {
        agent: "Encantado de ayudarle. Para orientar la valoración: ¿dónde está la vivienda y cuántos metros tiene, más o menos?",
        options: [{ label: "En el centro, unos 90 metros", say: "En el centro, unos noventa metros.", to: "v2" }],
      },
      v2: {
        agent: "Gracias. Hacemos una valoración gratuita en 24 horas con datos reales de venta de su zona. ¿Me deja un teléfono y le llama un asesor mañana por la mañana?",
        options: [{ label: "Sí, 611 222 333", say: "Sí, seis uno uno, dos dos dos, tres tres tres.", to: "v3" }],
      },
      v3: {
        agent: "Anotado. Mañana por la mañana le llama un asesor con la valoración preparada.",
        actions: ["registrar_lead(venta · centro · 90 m²)", "avisar_asesor(valoración · mañana)"],
        end: {
          title: "Propietario captado fuera de horario",
          text: "Un contacto de venta que podía perderse queda registrado, con los datos clave y una llamada comprometida.",
          result: ["Datos de la vivienda registrados", "Asesor avisado con la llamada de mañana", "Teléfono guardado en el CRM"],
        },
      },
    },
  },
];

/* ══════════════════ Piezas ══════════════════ */

type Line = { id: number; who: "ia" | "tu"; text: string };
type Phase = "idle" | "ringing" | "live" | "ended";

/** Cronómetro con estado propio: así solo se repinta él cada segundo. */
function Clock({ running }: { running: boolean }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return (
    <span className="tabular-nums">
      {String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}
    </span>
  );
}

const Bars = memo(function Bars({ active }: { active: boolean }) {
  return (
    <div className="flex h-10 items-center justify-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className={cn("h-full w-[3px] rounded-full bg-lime", active ? "bar-eq" : "opacity-30")}
          style={{
            transform: active ? undefined : "scaleY(0.12)",
            animationDelay: `${(i % 6) * 0.11}s`,
            animationDuration: `${0.8 + (i % 5) * 0.14}s`,
          }}
        />
      ))}
    </div>
  );
});

export default function VoiceDemo({ onContact }: DemoProps) {
  const [sid, setSid] = useState(scenarios[0].id);
  const sc = scenarios.find((s) => s.id === sid) ?? scenarios[0];

  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<Line[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [end, setEnd] = useState<End | null>(null);
  const [voice, setVoice] = useState(false);
  const [run, setRun] = useState(0);

  const scRef = useRef(sc);
  const voiceRef = useRef(voice);
  const timers = useRef<number[]>([]);
  const idRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  scRef.current = sc;
  voiceRef.current = voice;

  const stopAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);
  useEffect(() => stopAll, [stopAll]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /** El agente habla un nodo; al terminar muestra acciones y opciones (o el final). */
  const agentSays = useCallback(
    (nodeId: string) => {
      const node = scRef.current.nodes[nodeId];
      if (!node) return;
      setLog((l) => [...l, { id: ++idRef.current, who: "ia", text: node.agent }]);
      setSpeaking(true);

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        setSpeaking(false);
        (node.actions ?? []).forEach((a, i) => later(() => setActions((x) => [...x, a]), 250 + i * 380));
        const wait = 350 + (node.actions?.length ?? 0) * 380;
        later(() => {
          if (node.end) {
            setEnd(node.end);
            setPhase("ended");
          } else {
            setOptions(node.options ?? []);
          }
        }, wait);
      };

      const ms = 700 + node.agent.length * 26;
      if (voiceRef.current && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(node.agent);
          u.lang = "es-ES";
          u.rate = 1.05;
          u.onend = finish;
          u.onerror = finish;
          window.speechSynthesis.speak(u);
          later(finish, ms * 2 + 2500); // seguro por si el navegador no avisa del final
          return;
        } catch {
          /* sin voz: se sigue con el tiempo estimado */
        }
      }
      later(finish, ms);
    },
    [later],
  );

  const reset = useCallback(
    (toIdle = true) => {
      stopAll();
      setLog([]);
      setActions([]);
      setOptions([]);
      setSpeaking(false);
      setEnd(null);
      if (toIdle) setPhase("idle");
    },
    [stopAll],
  );

  const call = () => {
    reset(false);
    setRun((r) => r + 1);
    setPhase("ringing");
    later(() => {
      setPhase("live");
      agentSays(scRef.current.start);
    }, 1300);
  };

  const hangUp = () => {
    stopAll();
    setSpeaking(false);
    setOptions([]);
    setPhase("ended");
  };

  const choose = (o: Option) => {
    setOptions([]);
    setLog((l) => [...l, { id: ++idRef.current, who: "tu", text: o.say }]);
    later(() => agentSays(o.to), 650);
  };

  const pickScenario = (id: string) => {
    if (id === sid) return;
    reset(true);
    setSid(id);
  };

  // El transcript siempre enseña lo último
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, options]);

  const live = phase === "live";
  const canCall = phase === "idle" || phase === "ended";

  return (
    <div className="flex h-full flex-col">
      {/* Selector de escenario */}
      <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => pickScenario(s.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors",
                s.id === sid ? "border-lime bg-lime text-ink" : "border-white/15 text-soft hover:border-lime/50 hover:text-white",
              )}
            >
              {s.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[20rem_1fr]">
          {/* Móvil */}
          <section className="mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-none">
            <div className="rounded-[2rem] border border-white/12 bg-panel p-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative mt-1">
                  {live && <span className="pulse-ring absolute inset-0 rounded-full text-lime/60" />}
                  <div
                    className={cn(
                      "relative grid h-20 w-20 place-items-center rounded-full border-2 font-display text-2xl font-extrabold transition-colors",
                      live ? "border-lime bg-lime/10 text-lime" : "border-white/15 bg-white/[0.04] text-white",
                    )}
                  >
                    {sc.initials}
                  </div>
                </div>
                <p className="mt-4 font-display text-[1.1rem] font-bold leading-tight tracking-tight text-white">
                  {sc.business}
                </p>
                <p className="mt-1 font-mono text-[0.66rem] tracking-[0.1em] text-mute">{sc.number}</p>
                <p
                  className={cn(
                    "mt-3 font-mono text-[0.7rem] uppercase tracking-[0.2em]",
                    live ? "text-lime" : "text-soft",
                  )}
                  aria-live="polite"
                >
                  {phase === "idle" && "Listo para llamar"}
                  {phase === "ringing" && "Llamando…"}
                  {phase === "live" && (
                    <>
                      En llamada · <Clock key={run} running />
                    </>
                  )}
                  {phase === "ended" && "Llamada finalizada"}
                </p>
              </div>

              <div className="my-4">
                <Bars active={speaking} />
              </div>

              <div className="flex items-center justify-center gap-3">
                {canCall ? (
                  <button onClick={call} className="btn-lime px-7 py-3.5 text-sm">
                    <IPhone className="h-4.5 w-4.5" />
                    {phase === "ended" ? "Volver a llamar" : "Llamar"}
                  </button>
                ) : (
                  <button
                    onClick={hangUp}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#ff4d4d] px-7 py-3.5 text-sm font-semibold text-white transition-transform active:scale-95"
                  >
                    <IPhoneOff className="h-4.5 w-4.5" />
                    Colgar
                  </button>
                )}
              </div>

              <button
                onClick={() => setVoice((v) => !v)}
                aria-pressed={voice}
                className={cn(
                  "mx-auto mt-4 flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] transition-colors",
                  voice ? "border-lime/60 bg-lime/10 text-lime" : "border-white/15 text-mute hover:text-white",
                )}
              >
                {voice ? <IVolume className="h-3.5 w-3.5" /> : <IVolumeOff className="h-3.5 w-3.5" />}
                Voz del agente: {voice ? "activada" : "silenciada"}
              </button>
            </div>
          </section>

          {/* Conversación + lo que hace por detrás */}
          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <section className="flex min-h-[20rem] min-w-0 flex-col rounded-3xl border border-white/10 bg-white/[0.02]">
              <h3 className="shrink-0 border-b border-white/10 px-5 py-3 font-mono text-[0.62rem] font-normal uppercase tracking-[0.22em] text-mute">
                Conversación en directo
              </h3>
              <div ref={logRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 lg:max-h-[24rem]">
                {log.length === 0 && (
                  <p className="pt-6 text-center text-[0.9rem] leading-relaxed text-mute">
                    {phase === "ringing" ? "Marcando…" : sc.intro}
                    <br />
                    <span className="text-soft">Pulsa «Llamar» y habla con el agente: tú eliges qué contestar.</span>
                  </p>
                )}
                {log.map((l) => (
                  <div key={l.id} className={cn("pop flex", l.who === "tu" ? "justify-end" : "justify-start")}>
                    <p
                      className={cn(
                        "max-w-[88%] rounded-2xl px-4 py-2.5 text-[0.9rem] leading-relaxed",
                        l.who === "ia"
                          ? "rounded-tl-md border border-white/10 bg-panel-2 text-white"
                          : "rounded-tr-md border border-lime/40 bg-lime/10 text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "mb-0.5 block font-mono text-[0.54rem] uppercase tracking-[0.2em]",
                          l.who === "ia" ? "text-lime" : "text-mute",
                        )}
                      >
                        {l.who === "ia" ? "Agente de IA" : "Tú"}
                      </span>
                      {l.text}
                    </p>
                  </div>
                ))}
              </div>

              {options.length > 0 && (
                <div className="shrink-0 border-t border-white/10 p-4">
                  <p className="mb-2.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-lime">Tú respondes:</p>
                  <div className="flex flex-col gap-2">
                    {options.map((o) => (
                      <button
                        key={o.label}
                        onClick={() => choose(o)}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-left text-[0.88rem] text-white transition-colors hover:border-lime/60 hover:bg-lime/[0.06]"
                      >
                        {o.label}
                        <IArrow className="h-4 w-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5 group-hover:text-lime" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="flex min-w-0 flex-col gap-5">
              <div className="min-h-[12rem] rounded-3xl border border-white/10 bg-white/[0.02]">
                <h3 className="border-b border-white/10 px-5 py-3 font-mono text-[0.62rem] font-normal uppercase tracking-[0.22em] text-mute">
                  Lo que hace el agente por detrás
                </h3>
                <ul className="space-y-2 px-5 py-4">
                  {actions.length === 0 && (
                    <li className="text-[0.88rem] leading-relaxed text-mute">
                      Aquí irá apareciendo lo que hace solo mientras habla: consultar la agenda, mover citas, mandar
                      WhatsApp, avisar al equipo…
                    </li>
                  )}
                  {actions.map((a, i) => (
                    <li key={`${a}-${i}`} className="pop flex items-start gap-2.5 font-mono text-[0.74rem] leading-snug text-soft">
                      <ICheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
                      <span className="break-words">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {end && (
                <div className="pop rounded-3xl border border-lime/40 bg-lime/[0.05] p-5">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-lime">Resumen automático</p>
                  <h3 className="mt-2 font-display text-[1.2rem] font-bold leading-tight tracking-tight text-white">
                    {end.title}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-soft">{end.text}</p>
                  <ul className="mt-3 space-y-1.5">
                    {end.result.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-[0.86rem] text-white">
                        <ICheck className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <button onClick={call} className="btn-ghost px-4 py-2.5 text-[0.8rem]">
                      <IReset className="h-4 w-4" />
                      Probar otro camino
                    </button>
                    <button onClick={onContact} className="btn-lime px-4 py-2.5 text-[0.8rem]">
                      Quiero un agente así
                      <IArrow className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
