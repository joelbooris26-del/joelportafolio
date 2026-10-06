import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { ICheck, IReset, ISend, cap, norm, type DemoProps } from "./kit";

/* ══════════════════ Negocio (ficticio) ══════════════════ */

const SEATS = 20; // plazas por franja
const SLOTS = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];

type Item = { id: string; name: string; price: number; keys: string[]; gf: boolean };
const MENU: Item[] = [
  { id: "croq", name: "Croquetas de jamón (6 uds)", price: 8, keys: ["croqueta"], gf: false },
  { id: "tort", name: "Tortillitas de camarones", price: 9, keys: ["tortillita", "camaron"], gf: true },
  { id: "tata", name: "Tataki de atún", price: 16, keys: ["tataki", "atun"], gf: true },
  { id: "hamb", name: "Hamburguesa de retinto", price: 13.5, keys: ["hamburguesa"], gf: false },
  { id: "arro", name: "Arroz con carabinero", price: 18, keys: ["arroz"], gf: true },
  { id: "tart", name: "Tarta de queso", price: 6, keys: ["tarta"], gf: true },
];
const eur = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

/* ── Fechas ── */
const dayDate = (off: number) => {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return d;
};
const isClosed = (off: number) => dayDate(off).getDay() === 1; // los lunes se descansa
const weekday = (off: number) => dayDate(off).toLocaleDateString("es-ES", { weekday: "long" });
/** «hoy», «mañana» o «el jueves 9» */
const dayText = (off: number) => (off === 0 ? "hoy" : off === 1 ? "mañana" : `el ${weekday(off)} ${dayDate(off).getDate()}`);
/** Etiqueta corta para el panel */
const dayTag = (off: number) =>
  off === 0 ? "Hoy" : off === 1 ? "Mañana" : `${cap(weekday(off).slice(0, 3))} ${dayDate(off).getDate()}`;
const nextOpen = (from: number) => {
  let o = from;
  while (isClosed(o) && o < from + 7) o++;
  return o;
};

/* ── Datos que se guardan ── */
type Resv = { id: string; name: string; people: number; day: number; time: string; notes?: string; fresh?: boolean };
type Order = { id: string; name: string; lines: string; total: number; pickup: string; fresh?: boolean };
type Aviso = { id: string; kind: string; text: string; fresh?: boolean };

const seedResv = (): Resv[] => {
  const a = nextOpen(0);
  const b = nextOpen(a + 1);
  return [
    { id: "TP-101", name: "Familia Ruiz", people: 4, day: a, time: "14:00" },
    { id: "TP-102", name: "Marcos P.", people: 2, day: a, time: "21:00" },
    { id: "TP-103", name: "Cumpleaños de Lola", people: 8, day: b, time: "21:00" },
    { id: "TP-104", name: "Empresa Delta", people: 10, day: b, time: "21:00" },
    { id: "TP-105", name: "Ana y Pedro", people: 2, day: b, time: "21:30" },
  ];
};

const seatsLeft = (resv: Resv[], day: number, time: string) =>
  SEATS - resv.filter((r) => r.day === day && r.time === time).reduce((n, r) => n + r.people, 0);

/** Franjas con sitio para `people`, las más cercanas a `near` primero. */
function freeSlots(resv: Resv[], day: number, people: number, meal?: "cena" | "comida", near?: string) {
  const list = SLOTS.filter((s) => {
    if (meal === "cena" && s < "20:00") return false;
    if (meal === "comida" && s >= "20:00") return false;
    return seatsLeft(resv, day, s) >= people;
  });
  if (!near) return list;
  const mins = (s: string) => +s.slice(0, 2) * 60 + +s.slice(3);
  return [...list].sort((x, y) => Math.abs(mins(x) - mins(near)) - Math.abs(mins(y) - mins(near)));
}

/* ══════════════════ Comprender lo que escribe la persona ══════════════════ */

const NUMW: Record<string, number> = { un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12 };
const NUMRE = `\\d{1,2}|${Object.keys(NUMW).join("|")}`;
const numOf = (s: string) => (/^\d+$/.test(s) ? Number(s) : NUMW[s]);

function parsePeople(t: string, waiting: boolean): number | undefined {
  let m = t.match(new RegExp(`(${NUMRE})\\s*(?:personas|pax|comensales|adultos|gente)`));
  if (m) return numOf(m[1]);
  m = t.match(new RegExp(`(?:para|somos|seremos|mesa de)\\s+(${NUMRE})\\b(?!\\s*(?:y media|y cuarto|:|h\\b))`));
  if (m) return numOf(m[1]);
  if (waiting) {
    m = t.match(new RegExp(`^\\s*(${NUMRE})\\s*$`));
    if (m) return numOf(m[1]);
  }
  return undefined;
}

function parseDay(t: string): number | undefined {
  // «por la mañana» es la hora del día, no «mañana» (el día siguiente)
  const s = t.replace(/(?:por|de|en|esta)\s+la\s+manana/g, " am ").replace(/esta manana/g, " am ");
  if (/pasado manana/.test(s)) return 2;
  if (/\bmanana\b/.test(s)) return 1;
  if (/\bhoy\b|esta noche|esta tarde|\bahora\b/.test(s)) return 0;
  const names = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  for (let i = 0; i < 7; i++) if (new RegExp(`\\b${names[i]}\\b`).test(s)) return (i - new Date().getDay() + 7) % 7;
  return undefined;
}

const parseMeal = (t: string): "cena" | "comida" | undefined =>
  /cenar|\bcena\b|noche/.test(t) ? "cena" : /comer\b|comida|almuerzo|mediodia/.test(t) ? "comida" : undefined;

function parseTime(t: string): string | undefined {
  let h: number | undefined;
  let min = 0;
  let m = t.match(/\b(\d{1,2})[:.h](\d{2})\b/);
  if (m) {
    h = Number(m[1]);
    min = Number(m[2]);
  } else {
    m = t.match(new RegExp(`\\b(?:a\\s+)?las?\\s+(${NUMRE})(?:\\s*y\\s*(media|cuarto))?`));
    if (m) {
      h = numOf(m[1]);
      if (m[2] === "media") min = 30;
      else if (m[2] === "cuarto") min = 15;
    } else if (/mediodia/.test(t)) h = 14;
  }
  if (h === undefined || h > 24) return undefined;
  const pm = /de la (?:noche|tarde)|\bpm\b/.test(t);
  const am = /\bam\b|de la manana/.test(t);
  if (pm && h < 12) h += 12;
  else if (!am && !pm && h >= 1 && h <= 11) h += 12; // en un restaurante «a las 9» es la cena
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

const title = (s: string) => s.split(/\s+/).map(cap).join(" ");
const NOT_A_NAME = /^(?:no|si|nada|ninguna|ninguno|vale|ok|gracias|hola)$|celiac|vegan|vegetar|alerg|intoler|lactosa|gluten/;
const NAMECHARS = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ";
function parseName(raw: string, waiting: boolean): string | undefined {
  const ok = (s: string) => {
    const v = s.trim().replace(/\s+(?:y|para|con|que)\b.*$/i, "");
    return v.length >= 2 && !NOT_A_NAME.test(norm(v)) ? title(v) : undefined;
  };
  const m = raw.match(new RegExp(`(?:a nombre de|me llamo|mi nombre es|soy)\\s+([${NAMECHARS}]{2,30})`, "i"));
  if (m) {
    const n = ok(m[1]);
    if (n) return n;
  }
  if (waiting) {
    // «Laura», «Laura Gómez» o «Laura, y uno es celíaco»: se toma lo que va antes de la coma o de la «y»
    const head = raw.split(/,|\sy\s/i)[0].trim();
    if (new RegExp(`^[${NAMECHARS}]{2,30}$`).test(head) && head.split(/\s+/).length <= 4) return ok(head);
  }
  return undefined;
}

function parseNotes(t: string): string[] {
  const n: string[] = [];
  if (/celiac|gluten/.test(t)) n.push("celiaquía / sin gluten");
  if (/lactosa/.test(t)) n.push("sin lactosa");
  if (/vegano|vegana/.test(t)) n.push("vegano");
  else if (/vegetarian/.test(t)) n.push("vegetariano");
  if (/frutos secos|cacahuete/.test(t)) n.push("alergia a frutos secos");
  if (/trona|bebe/.test(t)) n.push("trona");
  return n;
}

function parseItems(t: string): { id: string; qty: number }[] {
  const found: { id: string; qty: number }[] = [];
  for (const it of MENU) {
    for (const k of it.keys) {
      const idx = t.indexOf(k);
      if (idx < 0) continue;
      const before = t.slice(Math.max(0, idx - 16), idx);
      const q = before.match(new RegExp(`(${NUMRE})\\s*(?:x\\s*)?(?:de\\s+)?(?:\\w+\\s+)?$`));
      found.push({ id: it.id, qty: q ? Math.max(1, numOf(q[1]) ?? 1) : 1 });
      break;
    }
  }
  return found;
}

/* ══════════════════ Motor de conversación ══════════════════ */

type Wait = null | "people" | "day" | "time" | "name" | "confirm" | "items" | "pickup" | "change";
type Slots = { people?: number; day?: number; time?: string; name?: string; notes: string[]; meal?: "cena" | "comida"; items: { id: string; qty: number }[]; pickup?: string };
type Session = { flow: null | "reserva" | "pedido"; wait: Wait; slots: Slots; lastResv?: string };
type Effect = { type: "resv"; resv: Resv } | { type: "order"; order: Order } | { type: "aviso"; aviso: Aviso } | { type: "cancel"; id: string };
type Out = { msgs: string[]; chips: string[]; session: Session; trace: string[]; parsed: Record<string, string>; effect?: Effect };

const emptySlots = (): Slots => ({ notes: [], items: [] });
const fresh = (): Session => ({ flow: null, wait: null, slots: emptySlots() });
const MAIN_CHIPS = ["Mesa para 4 mañana a las 9, uno es celíaco", "2 croquetas y 1 hamburguesa para recoger", "¿Qué hay sin gluten?", "¿Dónde estáis?", "Quiero hablar con el encargado"];

const YES = /^(?:si|vale|ok|okey|perfecto|confirma|confirmalo|confirmala|adelante|claro|de acuerdo|genial)\b|\bconfirm/;
const NO = /^(?:no|nop)\b|\bcambi|otra hora|otro dia|\bmejor\b|\bmodific/;

const rand = () => Math.floor(100 + Math.random() * 900);

function reply(raw: string, prev: Session, resv: Resv[]): Out {
  const t = norm(raw);
  const s: Session = { ...prev, slots: { ...prev.slots, notes: [...prev.slots.notes], items: [...prev.slots.items] } };
  const trace: string[] = [];
  const parsed: Record<string, string> = {};
  const o = (msgs: string[], chips: string[] = [], effect?: Effect): Out => ({ msgs, chips, session: s, trace, parsed, effect });
  const end = () => {
    s.flow = null;
    s.wait = null;
    s.slots = emptySlots();
  };

  /* 1 · Casos que siempre pasan a una persona */
  if (/encargad|persona real|hablar con (?:alguien|una persona|el responsable|un humano)|queja|reclam|mal servicio|intoxic|factura/.test(t)) {
    parsed["intención"] = "pasar a una persona";
    trace.push("detectar_intención() → derivar_a_persona", "crear_aviso(equipo) → Google Sheets", "notificar_encargado(WhatsApp)");
    end();
    return o(
      ["Entendido. Esto lo prefiero dejar en manos de una persona del equipo: ya le he pasado tu mensaje con todo el contexto y te escribe hoy mismo.", "Mientras tanto, ¿puedo ayudarte con algo más?"],
      ["Mesa para 2 hoy a las 9", "¿Qué hay sin gluten?"],
      { type: "aviso", aviso: { id: `AV-${rand()}`, kind: "Hablar con el encargado", text: raw.trim().slice(0, 90) } },
    );
  }

  /* 2 · Cancelar */
  if (/cancel|anular|anula\b/.test(t)) {
    const mine = resv.find((r) => r.id === s.lastResv);
    parsed["intención"] = "cancelar reserva";
    trace.push("buscar_reserva(cliente)");
    if (mine) {
      trace.push(`cancelar_reserva(${mine.id}) → plazas liberadas`);
      end();
      s.lastResv = undefined;
      return o([`Hecho: he cancelado la reserva ${mine.id} (${dayText(mine.day)} a las ${mine.time}). Las plazas quedan libres para otros clientes.`, "Si quieres, te busco otro día."], ["Mesa para 2 hoy a las 9"], { type: "cancel", id: mine.id });
    }
    return o(["No encuentro ninguna reserva tuya en esta demo. Haz una primero y luego pruebo a cancelarla."], ["Mesa para 4 mañana a las 9"]);
  }

  /* 3 · Confirmación pendiente */
  if (s.wait === "confirm") {
    const info = parsePeople(t, false) ?? parseDay(t) ?? parseTime(t);
    if (YES.test(t) && info === undefined && !NO.test(t)) return finalize(s, resv, o, trace, parsed, end);
    if (info === undefined) {
      if (s.flow === "pedido") {
        // en un pedido solo se puede cambiar la hora de recogida
        s.slots.pickup = undefined;
        const np = nextPrompt(s, resv, trace);
        return o([`Sin problema. ${np.msg}`], np.chips);
      }
      s.wait = "change";
      return o(["Sin problema. ¿Qué quieres cambiar: las personas, el día o la hora?"], ["La hora", "El día", "Las personas"]);
    }
  }

  /* 4 · Elegir qué cambiar */
  if (s.wait === "change") {
    if (/hora/.test(t)) {
      s.slots.time = undefined;
      s.wait = "time";
    } else if (/dia/.test(t)) {
      s.slots.day = undefined;
      s.wait = "day";
    } else if (/persona|gente|comensal/.test(t)) {
      s.slots.people = undefined;
      s.wait = "people";
    }
  }

  /* 5 · Detectar la intención si todavía no hay un flujo en marcha */
  const items = parseItems(t);
  if (!s.flow) {
    const wantsOrder = /recoger|para llevar|pedido|\bpedir\b|encargar/.test(t) || (items.length > 0 && !/mesa|reserv/.test(t));
    const wantsTable = /mesa|reserv|cenar|\bcena\b|comer\b|almorzar|\bhueco\b|\bsitio\b|somos \d/.test(t) || parsePeople(t, false) !== undefined;
    if (wantsOrder) {
      s.flow = "pedido";
      s.wait = "items";
      parsed["intención"] = "pedido para recoger";
    } else if (wantsTable) {
      s.flow = "reserva";
      parsed["intención"] = "reservar mesa";
    }
  }

  /* 6 · Preguntas sueltas (si no hay flujo, o la pregunta no aporta datos al flujo) */
  const waiting = s.wait;
  const gotData =
    parsePeople(t, waiting === "people") !== undefined ||
    parseDay(t) !== undefined ||
    parseTime(t) !== undefined ||
    items.length > 0 ||
    (waiting === "name" && parseName(raw, true) !== undefined && !/\?/.test(raw));
  const faq = answerFaq(t, parsed, trace);
  if (faq && (!s.flow || !gotData)) {
    const again = s.flow ? [nextPrompt(s, resv, trace)] : [];
    return o([...faq.msgs, ...again.map((a) => a.msg)], s.flow && again[0] ? again[0].chips : faq.chips);
  }

  /* 7 · Rellenar los datos del flujo con lo que dice la persona */
  if (s.flow === "reserva") {
    const people = parsePeople(t, waiting === "people");
    const day = parseDay(t);
    const time = parseTime(t);
    const name = parseName(raw, waiting === "name");
    const meal = parseMeal(t);
    if (people !== undefined) s.slots.people = people;
    if (day !== undefined) s.slots.day = day;
    if (time !== undefined) s.slots.time = time;
    if (name) s.slots.name = name;
    if (meal) s.slots.meal = meal;
    for (const n of parseNotes(t)) if (!s.slots.notes.includes(n)) s.slots.notes.push(n);

    const sl = s.slots;
    if (sl.people !== undefined) parsed.personas = String(sl.people);
    if (sl.day !== undefined) parsed["día"] = dayText(sl.day);
    if (sl.time) parsed.hora = sl.time;
    if (sl.name) parsed.nombre = sl.name;
    if (sl.notes.length) parsed.alergias = sl.notes.join(", ");
    trace.push(`extraer_datos() → ${Object.entries(parsed).filter(([k]) => k !== "intención").map(([k, v]) => `${k}=${v}`).join(", ") || "sin datos nuevos"}`);

    // Grupos grandes: los ve una persona
    if (sl.people !== undefined && sl.people > 10) {
      trace.push("grupo_grande(>10) → derivar_a_persona", "crear_aviso(equipo) → Google Sheets");
      end();
      return o(["Para grupos de más de 10 personas prefiero que lo vea el encargado, para prepararos un menú y una sala. Le he pasado tu petición y te escribe hoy mismo."], ["¿Qué hay sin gluten?"], {
        type: "aviso",
        aviso: { id: `AV-${rand()}`, kind: "Grupo grande", text: `Mesa para ${sl.people} personas` },
      });
    }
    if (sl.people !== undefined && sl.people < 1) {
      sl.people = undefined;
    }

    // Día cerrado
    if (sl.day !== undefined && isClosed(sl.day)) {
      const alt = nextOpen(sl.day + 1);
      trace.push(`comprobar_horario(${dayText(sl.day)}) → cerrado`);
      sl.day = undefined;
      s.wait = "day";
      return o([`Los lunes descansamos. Te puedo mirar ${dayText(alt)}, que abrimos de 13:00 a 16:00 y de 20:00 a 23:30. ¿Te va bien?`], [cap(dayText(alt)), "Otro día"]);
    }

    // Hora fuera de servicio
    if (sl.time && !SLOTS.includes(sl.time)) {
      const day = sl.day ?? nextOpen(0);
      const near = freeSlots(resv, day, sl.people ?? 1, sl.meal, sl.time).slice(0, 3).sort();
      trace.push(`comprobar_horario(${sl.time}) → fuera de servicio`);
      const bad = sl.time;
      sl.time = undefined;
      s.wait = "time";
      return o([`A las ${bad} la cocina está cerrada: servimos de 13:00 a 16:00 y de 20:00 a 23:30. Lo más cercano que tengo es ${near.join(", ")}.`], near);
    }

    // Aforo
    if (sl.day !== undefined && sl.time && sl.people !== undefined) {
      const left = seatsLeft(resv, sl.day, sl.time);
      trace.push(`consultar_aforo(${dayTag(sl.day)} ${sl.time}) → ${Math.max(0, left)} plazas libres`);
      if (left < sl.people) {
        sl.meal = sl.meal ?? (sl.time >= "20:00" ? "cena" : "comida"); // se recuerda que era una cena (o una comida)
        const alt = freeSlots(resv, sl.day, sl.people, sl.meal, sl.time).slice(0, 3).sort();
        const bad = sl.time;
        sl.time = undefined;
        s.wait = "time";
        return o(
          [`A las ${bad} ${left > 0 ? `solo quedan ${left} plazas` : "ya está completo"}. Para ${sl.people} personas ${dayText(sl.day)} tengo ${alt.join(", ")}. ¿Te encaja alguna?`],
          alt,
        );
      }
    }
  }

  if (s.flow === "pedido") {
    for (const it of items) {
      const ex = s.slots.items.find((x) => x.id === it.id);
      if (ex) ex.qty = it.qty;
      else s.slots.items.push(it);
    }
    const pick = parseTime(t);
    const name = parseName(raw, waiting === "name");
    if (pick) s.slots.pickup = pick;
    if (name) s.slots.name = name;
    if (s.slots.items.length) parsed.pedido = s.slots.items.map((x) => `${x.qty}× ${MENU.find((m) => m.id === x.id)?.name.split(" (")[0]}`).join(", ");
    if (s.slots.pickup) parsed.recogida = s.slots.pickup;
    if (s.slots.name) parsed.nombre = s.slots.name;
    trace.push(`extraer_pedido() → ${s.slots.items.length} producto(s)`);

    if (isClosed(0)) {
      trace.push("comprobar_horario(hoy) → cerrado");
      end();
      return o(["Hoy descansamos y no preparamos pedidos. Si quieres, te reservo mesa para otro día."], ["Mesa para 2 mañana a las 9"]);
    }
    if (s.slots.pickup && !SLOTS.includes(s.slots.pickup)) {
      const bad = s.slots.pickup;
      s.slots.pickup = undefined;
      s.wait = "pickup";
      return o([`A las ${bad} no hay cocina. Puedes recogerlo entre 13:00 y 16:00 o entre 20:00 y 23:30.`], ["13:30", "14:00", "20:30", "21:00"]);
    }
  }

  /* 8 · Siguiente pregunta, o cerrar */
  if (!s.flow) {
    return o(["No estoy segura de haberte entendido. Puedo reservarte mesa, tomar un pedido para recoger o resolver dudas de carta, alérgenos, horario y ubicación. ¿Qué necesitas?"], MAIN_CHIPS.slice(0, 4));
  }
  const next = nextPrompt(s, resv, trace);
  return o([next.msg], next.chips);
}

/** Decide qué falta por preguntar y lo deja en la sesión. */
function nextPrompt(s: Session, resv: Resv[], trace: string[]): { msg: string; chips: string[] } {
  const sl = s.slots;
  if (s.flow === "reserva") {
    if (sl.people === undefined) {
      s.wait = "people";
      return { msg: "Encantada de ayudarte. ¿Para cuántas personas?", chips: ["2 personas", "4 personas", "6 personas"] };
    }
    if (sl.day === undefined) {
      s.wait = "day";
      const days = [0, 1, 2].filter((d) => !isClosed(d));
      return { msg: `Para ${sl.people} personas, perfecto. ¿Qué día? Abrimos de martes a domingo.`, chips: days.map((d) => cap(dayText(d))) };
    }
    if (!sl.time) {
      s.wait = "time";
      const free = freeSlots(resv, sl.day, sl.people, sl.meal);
      if (free.length === 0) {
        const bad = sl.day;
        sl.day = undefined;
        s.wait = "day";
        return { msg: `${cap(dayText(bad))} ya no me quedan mesas para ${sl.people}. ¿Probamos otro día?`, chips: [0, 1, 2, 3].filter((d) => d !== bad && !isClosed(d)).slice(0, 3).map((d) => cap(dayText(d))) };
      }
      const pick = sl.meal ? free.slice(0, 4) : [free.find((x) => x < "16:00"), free.find((x) => x >= "20:00" && x < "21:00"), free.find((x) => x >= "21:00")].filter(Boolean) as string[];
      trace.push(`consultar_aforo(${dayTag(sl.day)}, ${sl.people} pax) → ${free.length} franjas libres`);
      return { msg: `${cap(dayText(sl.day))} para ${sl.people} tengo ${pick.join(", ")}. ¿A qué hora prefieres?`, chips: pick };
    }
    if (!sl.name) {
      s.wait = "name";
      return { msg: `Muy bien, ${dayText(sl.day)} a las ${sl.time}. ¿A nombre de quién la dejo? Si hay alguna alergia o intolerancia, dímelo.`, chips: [] };
    }
    s.wait = "confirm";
    return {
      msg: `Te confirmo: mesa para ${sl.people}, ${dayText(sl.day)} a las ${sl.time}, a nombre de ${sl.name}.${sl.notes.length ? ` Anotado: ${sl.notes.join(", ")}.` : ""} ¿La confirmo?`,
      chips: ["Sí, confírmala", "Cambiar la hora"],
    };
  }
  // pedido
  if (!sl.items.length) {
    s.wait = "items";
    return {
      msg: `Esto es lo que preparo para recoger:\n${MENU.map((m) => `• ${m.name} · ${eur(m.price)}`).join("\n")}\n¿Qué te apunto?`,
      chips: ["2 croquetas y 1 hamburguesa", "1 arroz con carabinero"],
    };
  }
  const total = sl.items.reduce((n, x) => n + x.qty * (MENU.find((m) => m.id === x.id)?.price ?? 0), 0);
  if (!sl.pickup) {
    s.wait = "pickup";
    return { msg: `Apuntado. Son ${eur(total)}. ¿A qué hora lo recoges hoy? Cocina: 13:00–16:00 y 20:00–23:30.`, chips: ["13:30", "14:00", "20:30", "21:00"] };
  }
  if (!sl.name) {
    s.wait = "name";
    return { msg: `Perfecto, hoy a las ${sl.pickup}. ¿A nombre de quién lo dejo?`, chips: [] };
  }
  s.wait = "confirm";
  return {
    msg: `Te confirmo el pedido para recoger hoy a las ${sl.pickup}, a nombre de ${sl.name}:\n${sl.items.map((x) => `• ${x.qty} × ${MENU.find((m) => m.id === x.id)?.name}`).join("\n")}\nTotal: ${eur(total)}. ¿Lo confirmo?`,
    chips: ["Sí, confírmalo", "Cambiar la hora"],
  };
}

function finalize(s: Session, resv: Resv[], o: (m: string[], c?: string[], e?: Effect) => Out, trace: string[], parsed: Record<string, string>, end: () => void): Out {
  const sl = s.slots;
  if (s.flow === "reserva" && sl.people !== undefined && sl.day !== undefined && sl.time && sl.name) {
    // Revisión final por si alguien ha ocupado las plazas mientras tanto
    if (seatsLeft(resv, sl.day, sl.time) < sl.people) {
      sl.time = undefined;
      const np = nextPrompt(s, resv, trace);
      return o(["Vaya, esas plazas acaban de ocuparse. " + np.msg], np.chips);
    }
    const r: Resv = { id: `TP-${rand()}`, name: sl.name, people: sl.people, day: sl.day, time: sl.time, notes: sl.notes.join(", ") || undefined, fresh: true };
    trace.push(`crear_reserva(${r.id}) → Google Sheets`, `programar_recordatorio(${dayText(r.day)} 10:00)`);
    if (r.notes) trace.push(`avisar_cocina(${r.notes})`);
    parsed["intención"] = "confirmar reserva";
    end();
    s.lastResv = r.id;
    return o(
      [`✅ Reservada. Mesa para ${r.people}, ${dayText(r.day)} a las ${r.time}, a nombre de ${r.name}.${r.notes ? ` Cocina ya sabe: ${r.notes}.` : ""}`, `Tu código es ${r.id}. Te escribiré por aquí un recordatorio la mañana de la reserva. ¿Te ayudo con algo más?`],
      ["2 croquetas y 1 hamburguesa para recoger", "¿Qué hay sin gluten?", "Cancelar mi reserva"],
      { type: "resv", resv: r },
    );
  }
  if (s.flow === "pedido" && sl.items.length && sl.pickup && sl.name) {
    const total = sl.items.reduce((n, x) => n + x.qty * (MENU.find((m) => m.id === x.id)?.price ?? 0), 0);
    const order: Order = {
      id: `PD-${rand()}`,
      name: sl.name,
      lines: sl.items.map((x) => `${x.qty}× ${MENU.find((m) => m.id === x.id)?.name.split(" (")[0]}`).join(", "),
      total,
      pickup: sl.pickup,
      fresh: true,
    };
    trace.push(`crear_pedido(${order.id}) → Google Sheets`, `avisar_cocina(recogida ${order.pickup})`);
    parsed["intención"] = "confirmar pedido";
    end();
    return o([`✅ Pedido ${order.id} confirmado: ${eur(total)} para recoger hoy a las ${order.pickup}.`, "Te aviso por aquí cuando esté listo. ¿Algo más?"], ["Mesa para 2 mañana a las 9", "¿Dónde estáis?"], { type: "order", order });
  }
  const np = nextPrompt(s, resv, trace);
  return o([np.msg], np.chips);
}

/** Preguntas frecuentes. Devuelve null si el mensaje no es una de ellas. */
function answerFaq(t: string, parsed: Record<string, string>, trace: string[]): { msgs: string[]; chips: string[] } | null {
  const hit = (intent: string, fn: string, msgs: string[], chips: string[] = MAIN_CHIPS.slice(0, 3)) => {
    parsed["intención"] = intent;
    trace.push(`detectar_intención() → ${intent}`, fn);
    return { msgs, chips };
  };
  if (/horario|abiert|abren|cierr|hasta que hora|a que hora (?:abr|cerr)/.test(t))
    return hit("horario", "consultar_horario()", ["Abrimos de martes a domingo: comidas de 13:00 a 16:00 y cenas de 20:00 a 23:30. Los lunes descansamos."]);
  if (/gluten|celiac|alerg|vegan|vegetarian|lactosa/.test(t) && !/mesa|reserv|somos|para \d/.test(t)) {
    const gf = MENU.filter((m) => m.gf).map((m) => m.name.split(" (")[0]);
    return hit("alérgenos", "consultar_carta(filtro: sin gluten)", [`Sin gluten tengo: ${gf.join(", ")}. Cocina sigue un protocolo para evitar la contaminación cruzada. Si vienes, dímelo al reservar y se lo aviso.`], ["Mesa para 2 hoy a las 9", "2 croquetas y 1 hamburguesa para recoger"]);
  }
  if (/carta|menu|que (?:tenei|hay|ofrece)|platos|recomiend|especialidad/.test(t))
    return hit("carta", "consultar_carta()", [`Esto es lo que más sale:\n${MENU.map((m) => `• ${m.name} · ${eur(m.price)}`).join("\n")}`], ["2 croquetas y 1 hamburguesa para recoger", "Mesa para 2 hoy a las 9"]);
  if (/donde|direccion|ubicacion|llegar|aparcar|parking/.test(t))
    return hit("ubicación", "consultar_ubicación()", ["Estamos en la Calle Real, 12, en La Línea de la Concepción. Hay parking público a 100 metros y la entrada no tiene escalones."]);
  if (/terraza|aire libre/.test(t)) return hit("terraza", "consultar_local()", ["Sí, tenemos terraza cubierta y calefactada. Si prefieres sentarte fuera, dímelo al reservar."]);
  if (/perro|mascota/.test(t)) return hit("mascotas", "consultar_local()", ["Los perros son bienvenidos en la terraza."]);
  if (/precio|cuesta|cuanto|ticket medio/.test(t))
    return hit("precios", "consultar_carta()", ["De media se come por unos 25–30 € por persona. Los precios de cada plato están en la carta; ¿te la enseño?"], ["Ver la carta", "Mesa para 2 hoy a las 9"]);
  if (/^(?:hola|buenas|buenos dias|buenas tardes|buenas noches|hey)\b/.test(t))
    return hit("saludo", "—", ["¡Hola! Soy Sofía, la asistente de La Taberna del Peñón. ¿Reservamos mesa, preparo un pedido o te resuelvo una duda?"], MAIN_CHIPS.slice(0, 3));
  if (/^(?:gracias|muchas gracias|vale gracias|genial gracias)/.test(t)) return hit("despedida", "—", ["¡A ti! Aquí estoy las 24 horas si necesitas algo más."], MAIN_CHIPS.slice(0, 3));
  return null;
}

/* ══════════════════ Interfaz ══════════════════ */

type Msg = { id: number; from: "bot" | "user"; text: string; time: string };
const clock = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const GREETING =
  "¡Hola! Soy Sofía, la asistente de La Taberna del Peñón. Puedo reservarte mesa, tomar un pedido para recoger o resolver dudas de carta y alérgenos. Escríbeme como lo harías por WhatsApp.";

export default function WhatsAppDemo({ onContact }: DemoProps) {
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ id: 1, from: "bot", text: GREETING, time: clock() }]);
  const [chips, setChips] = useState<string[]>(MAIN_CHIPS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [resv, setResv] = useState<Resv[]>(seedResv);
  const [orders, setOrders] = useState<Order[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [trace, setTrace] = useState<string[]>([]);
  const [parsed, setParsed] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"chat" | "panel">("chat");
  const [unseen, setUnseen] = useState(0);

  const session = useRef<Session>(fresh());
  const resvRef = useRef(resv);
  const timers = useRef<number[]>([]);
  const idRef = useRef(1);
  const boxRef = useRef<HTMLDivElement>(null);
  resvRef.current = resv;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, chips, tab]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const send = useCallback((raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput("");
    setChips([]);
    setMsgs((m) => [...m, { id: ++idRef.current, from: "user", text, time: clock() }]);

    const out = reply(text, session.current, resvRef.current);
    session.current = out.session;
    setTyping(true);

    out.msgs.forEach((m, i) => {
      later(
        () => {
          setMsgs((x) => [...x, { id: ++idRef.current, from: "bot", text: m, time: clock() }]);
          if (i === 0) {
            setTrace(out.trace);
            setParsed(out.parsed);
            const e = out.effect;
            if (e?.type === "resv") setResv((r) => [...r.map((x) => ({ ...x, fresh: false })), e.resv]);
            if (e?.type === "order") setOrders((r) => [...r.map((x) => ({ ...x, fresh: false })), e.order]);
            if (e?.type === "aviso") setAvisos((r) => [...r.map((x) => ({ ...x, fresh: false })), e.aviso]);
            if (e?.type === "cancel") setResv((r) => r.filter((x) => x.id !== e.id));
            if (e) setUnseen((n) => n + 1);
          }
          if (i === out.msgs.length - 1) {
            setTyping(false);
            setChips(out.chips);
          } else {
            setTyping(true);
          }
        },
        700 + i * 900,
      );
    });
  }, []);

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    session.current = fresh();
    setMsgs([{ id: ++idRef.current, from: "bot", text: GREETING, time: clock() }]);
    setChips(MAIN_CHIPS);
    setResv(seedResv());
    setOrders([]);
    setAvisos([]);
    setTrace([]);
    setParsed({});
    setTyping(false);
    setUnseen(0);
  };

  const sorted = [...resv].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  const days = Array.from(new Set(sorted.map((r) => r.day)));

  return (
    <div className="flex h-full flex-col">
      {/* En móvil: pestañas Chat / Panel */}
      <div className="flex shrink-0 gap-2 border-b border-white/10 px-4 py-3 lg:hidden">
        {(["chat", "panel"] as const).map((k) => (
          <button
            key={k}
            onClick={() => {
              setTab(k);
              if (k === "panel") setUnseen(0);
            }}
            className={cn(
              "relative flex-1 rounded-full border px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors",
              tab === k ? "border-lime bg-lime text-ink" : "border-white/15 text-soft",
            )}
          >
            {k === "chat" ? "Chat del cliente" : "Panel del restaurante"}
            {k === "panel" && unseen > 0 && tab !== "panel" && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-lime text-[0.6rem] font-bold text-ink">{unseen}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[24rem_1fr]">
        {/* ── Chat ── */}
        <section className={cn("min-h-0 flex-col border-white/10 lg:flex lg:border-r", tab === "chat" ? "flex" : "hidden")}>
          <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-panel-2 px-4 py-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-lime/50 bg-lime/10 font-display text-sm font-extrabold text-lime">TP</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[0.95rem] font-semibold leading-tight text-white">La Taberna del Peñón</p>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-lime">{typing ? "escribiendo…" : "asistente · en línea"}</p>
            </div>
            <button onClick={restart} aria-label="Reiniciar la demo" title="Reiniciar la demo" className="btn-ghost h-9 w-9 !p-0">
              <IReset className="h-4 w-4" />
            </button>
          </div>

          <div ref={boxRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#0a0f12] px-3.5 py-4">
            {msgs.map((m) => (
              <div key={m.id} className={cn("pop flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <p
                  className={cn(
                    "max-w-[86%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-[0.88rem] leading-relaxed",
                    m.from === "bot" ? "rounded-tl-md border border-white/10 bg-panel-2 text-white" : "rounded-tr-md border border-lime/40 bg-lime/10 text-white",
                  )}
                >
                  {m.text}
                  <span className="mt-1 block text-right font-mono text-[0.54rem] text-mute">
                    {m.time}
                    {m.from === "user" && <span className="ml-1 text-lime">✓✓</span>}
                  </span>
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex">
                <p className="flex gap-1 rounded-2xl rounded-tl-md border border-white/10 bg-panel-2 px-4 py-3" aria-label="Escribiendo">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-mute" style={{ animationDelay: `${i * 130}ms` }} />
                  ))}
                </p>
              </div>
            )}
          </div>

          {chips.length > 0 && (
            <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-white/10 px-3 py-2.5 [scrollbar-width:none]">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="shrink-0 rounded-full border border-lime/40 px-3.5 py-1.5 text-[0.76rem] text-lime transition-colors hover:bg-lime hover:text-ink"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex shrink-0 items-center gap-2 border-t border-white/10 bg-panel-2 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe como un cliente…"
              aria-label="Mensaje"
              className="min-w-0 flex-1 rounded-full border border-white/12 bg-ink px-4 py-2.5 text-[0.9rem] text-white outline-none placeholder:text-mute focus:border-lime/60"
            />
            <button type="submit" aria-label="Enviar" className="btn-lime h-10 w-10 shrink-0 !p-0">
              <ISend className="h-4 w-4" />
            </button>
          </form>
        </section>

        {/* ── Panel del negocio ── */}
        <section className={cn("min-h-0 overflow-y-auto lg:block", tab === "panel" ? "block" : "hidden")}>
          <div className="grid gap-4 p-4 sm:p-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-lime/25 bg-lime/[0.03] p-5 xl:col-span-2">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-lime">Lo que entiende la IA</p>
              {Object.keys(parsed).length === 0 && trace.length === 0 ? (
                <p className="mt-2 text-[0.88rem] leading-relaxed text-mute">
                  Escribe una frase libre —prueba «mesa para 4 mañana a las 9, uno es celíaco»— y aquí verás qué datos extrae y qué herramientas usa.
                </p>
              ) : (
                <>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(parsed).map(([k, v]) => (
                      <span key={k} className="chip !normal-case">
                        <span className="text-mute">{k}</span> <span className="text-white">{v}</span>
                      </span>
                    ))}
                  </div>
                  <ul className="mt-3 space-y-1 font-mono text-[0.7rem] leading-snug text-soft">
                    {trace.map((l, i) => (
                      <li key={i} className="flex gap-2">
                        <ICheck className="mt-0.5 h-3 w-3 shrink-0 text-lime" />
                        <span className="break-words">{l}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 xl:col-span-2">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-mute">Reservas · se actualizan solas</p>
              <div className="mt-3 space-y-3">
                {days.map((d) => (
                  <div key={d}>
                    <p className="mb-1.5 font-display text-[0.9rem] font-semibold text-white">{dayTag(d)}</p>
                    <ul className="space-y-1.5">
                      {sorted
                        .filter((r) => r.day === d)
                        .map((r) => (
                          <li
                            key={r.id}
                            className={cn(
                              "flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-xl border px-3.5 py-2 text-[0.84rem]",
                              r.fresh ? "pop border-lime/60 bg-lime/[0.07]" : "border-white/8 bg-white/[0.02]",
                            )}
                          >
                            <span className="font-mono text-lime">{r.time}</span>
                            <span className="text-white">{r.name}</span>
                            <span className="text-mute">{r.people} pax</span>
                            {r.notes && <span className="text-amber">{r.notes}</span>}
                            {r.fresh && <span className="ml-auto font-mono text-[0.56rem] uppercase tracking-[0.16em] text-lime">nueva</span>}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-mute">Pedidos para recoger</p>
              <ul className="mt-3 space-y-1.5">
                {orders.length === 0 && <li className="text-[0.84rem] text-mute">Sin pedidos todavía. Prueba «2 croquetas y 1 hamburguesa para recoger».</li>}
                {orders.map((r) => (
                  <li key={r.id} className={cn("rounded-xl border px-3.5 py-2 text-[0.84rem]", r.fresh ? "pop border-lime/60 bg-lime/[0.07]" : "border-white/8 bg-white/[0.02]")}>
                    <span className="font-mono text-lime">{r.pickup}</span> <span className="text-white">{r.name}</span> <span className="text-mute">· {eur(r.total)}</span>
                    <span className="block text-soft">{r.lines}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-mute">Avisos para el equipo</p>
              <ul className="mt-3 space-y-1.5">
                {avisos.length === 0 && <li className="text-[0.84rem] text-mute">Sin avisos. Prueba «quiero hablar con el encargado» o una mesa para 12.</li>}
                {avisos.map((r) => (
                  <li key={r.id} className={cn("rounded-xl border px-3.5 py-2 text-[0.84rem]", r.fresh ? "pop border-amber/60 bg-amber/[0.07]" : "border-white/8 bg-white/[0.02]")}>
                    <span className="font-mono text-amber">{r.kind}</span>
                    <span className="block text-soft">{r.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.02] p-5 xl:col-span-2">
              <p className="max-w-md text-[0.9rem] leading-relaxed text-soft">Esto mismo, en el WhatsApp de tu negocio y conectado a tu agenda.</p>
              <button onClick={onContact} className="btn-lime px-5 py-3 text-[0.82rem]">
                Quiero una recepcionista así
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
