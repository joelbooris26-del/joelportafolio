/**
 * Todo el contenido del portafolio vive aquí: textos, proyectos, historia y stack.
 * Cambia lo que quieras en este archivo y la página se actualiza sola.
 */

/* ── Edad automática ─────────────────────────────────────────────────────────
   Se deduce una vez de la edad declarada (18), se guarda en el navegador y suma
   un año sola cada 22 de julio.                                              */
const AGE_DECLARED = 18;
const STORAGE_KEY = "jm:anio-nacimiento";
/** Si prefieres fijar tu año de nacimiento a mano, escríbelo aquí (p. ej. 2007). */
const FORCED_BIRTH_YEAR: number | null = null;

function resolveBirthYear(): number {
  if (FORCED_BIRTH_YEAR) return FORCED_BIRTH_YEAR;
  const now = new Date();
  const y = now.getFullYear();
  const yaCumplio = now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() >= 22);
  const deducido = yaCumplio ? y - AGE_DECLARED : y - AGE_DECLARED - 1;
  try {
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (guardado && /^\d{4}$/.test(guardado)) return Number(guardado);
    window.localStorage.setItem(STORAGE_KEY, String(deducido));
  } catch {
    /* navegador privado: se vuelve a deducir en cada visita */
  }
  return deducido;
}

const BIRTH_YEAR = resolveBirthYear();

export function getAge(now = new Date()): number {
  const birth = new Date(BIRTH_YEAR, 6, 22);
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export const profile = {
  alias: "Joel",
  fullName: "Joaquin Merizalde Fernandez",
  city: "La Línea de la Concepción",
  region: "Cádiz",
  country: "España",
  email: "joeljmerizaldefernandez@gmail.com",
  coords: "36.17° N · 5.35° O",
};

/** Palabras que rotan en la portada. */
export const roles = [
  "webs a medida",
  "agentes de IA",
  "chatbots y voz",
  "automatizaciones",
  "webs con IA integrada",
];

export const bioParagraphs = [
  "Soy de La Línea de la Concepción, en Cádiz, donde el mar y el Peñón se ven desde cualquier azotea. Crecí rodeado de videojuegos, ordenadores y consolas: en mi casa la tecnología nunca fue un lujo, fue un lenguaje. Y mientras otros jugaban, yo me preguntaba cómo estaba hecho todo aquello por dentro.",
  "Con 14 años empecé a responder esa pregunta por mi cuenta. Sin cursos, sin atajos: documentación, foros y muchas noches de prueba y error hasta levantar mi primera página web. Desde entonces no he dejado de construir —y de romper— cosas.",
  "Luego llegaron las automatizaciones y la inteligencia artificial, y entendí que ahí estaba el siguiente salto. Hoy mezclo todo: webs que trabajan solas, agentes que atienden por WhatsApp y por teléfono, y una app propia que estoy construyendo de principio a fin.",
];

export const principles = [
  { k: "01", t: "Construir para entender", d: "Aprendo haciendo: cada proyecto empieza con una pregunta y termina con algo que se puede probar." },
  { k: "02", t: "A medida o nada", d: "Nada de plantillas: estructura, diseño y funciones pensadas para cada proyecto." },
  { k: "03", t: "Que se pueda tocar", d: "Prefiero enseñar una demo funcionando que prometer una idea en una presentación." },
];

/* ── Proyectos ───────────────────────────────────────────────────────────── */
export type ArtId = "steps" | "voice" | "chat" | "web";

/** Demos que se pueden probar dentro del portafolio. */
export type DemoId = "llamadas" | "whatsapp" | "web";

export type Project = {
  id: string;
  title: string;
  kind: string;
  status: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  art: ArtId;
  accent: string;
  /** Si tiene demo, el detalle del proyecto muestra el botón «Probar la demo». */
  demo?: DemoId;
};

export const projects: Project[] = [
  {
    id: "one-more-step",
    title: "One More Step",
    kind: "App · iOS · Android · Web",
    status: "En desarrollo",
    tagline: "Júntate con personas que están avanzando y tú también avanzarás.",
    description:
      "App de objetivos, progreso y comunidad. Un solo código de cliente para iOS, Android y Web, y un backend propio. Objetivos y tareas, rachas, comunidades, perfiles personalizados con avatares y banners animados, tienda de Lúminas y suscripción Ascend.",
    highlights: [
      "Un único código para iOS, Android y Web con Expo y React Native",
      "Backend propio en Node.js, Fastify y PostgreSQL, con tests de integración contra una base de datos real",
      "Comunidades con envío, revisión, roles y permisos; verificación de cuentas e insignias",
      "Salas de voz, Ascend y anuncios recompensados ya implementados: esperan las cuentas de servicios externos para activarse de verdad",
    ],
    stack: ["Expo", "React Native", "TypeScript", "Fastify", "PostgreSQL", "Zod", "LiveKit"],
    art: "steps",
    accent: "#c8ff3e",
  },
  {
    id: "agente-llamadas",
    title: "Agente de llamadas",
    kind: "Voz + chat · clínica dental",
    status: "Demo + workflows",
    tagline: "Una recepcionista virtual que atiende, llama y recuerda las citas.",
    description:
      "Recepcionista virtual para clínica dental con chat y voz: gestiona la agenda de citas y llama a los pacientes para recordarlas. Incluye una demo para enseñar a clientes, montada como un móvil con chat, llamada manos libres y agenda.",
    highlights: [
      "Demo con dictado por voz, lectura en voz alta y llamada manos libres",
      "Llamadas telefónicas reales con Vapi: lanzar, registrar resultados y reintentar hasta 3 veces",
      "Recordatorio diario de las citas de mañana y actualización automática de la agenda",
      "Ante una urgencia avisa al equipo y, si hay riesgo, deriva al 112: no diagnostica",
    ],
    stack: ["n8n", "Vapi", "OpenAI", "Google Sheets", "JavaScript"],
    art: "voice",
    accent: "#ffb347",
    demo: "llamadas",
  },
  {
    id: "recepcionista-whatsapp",
    title: "Recepcionista de WhatsApp",
    kind: "Automatización · restaurantes",
    status: "Demo + workflows",
    tagline: "Atiende el WhatsApp de un restaurante las 24 horas.",
    description:
      "Asistente que reserva mesa comprobando el aforo real, cambia y cancela reservas, toma pedidos para recoger y responde dudas de carta y alérgenos. Los casos delicados —grupos grandes, quejas, eventos— los pasa a una persona.",
    highlights: [
      "Agente con Claude y memoria por cliente, sobre WhatsApp (Meta Cloud API) o Telegram",
      "Reservas, pedidos y avisos sobre Google Sheets, con la misma lógica de aforo en demo y producción",
      "Recordatorio automático cada mañana a quien tiene reserva ese día",
      "Demo con cuatro pestañas: chat, reservas, pedidos y avisos para el equipo",
    ],
    stack: ["n8n", "WhatsApp Cloud API", "Claude", "Google Sheets", "Telegram"],
    art: "chat",
    accent: "#a78bfa",
    demo: "whatsapp",
  },
  {
    id: "webs-a-medida",
    title: "Webs a medida",
    kind: "Diseño y desarrollo web",
    status: "Desde los 14",
    tagline: "Sin plantillas, con un asistente de IA dentro cuando hace falta.",
    description:
      "Diseño y desarrollo de webs desde cero: estructura, tipografía, color y funciones propias. La demo es una web que puedes personalizar en vivo: cambias de sector, color, tipografía, estilo y tema claro u oscuro, y funcionan el filtro de la carta, la reserva con validación y un asistente.",
    highlights: [
      "React, TypeScript y Tailwind, con rendimiento y SEO local en mente",
      "Demos reales en lugar de maquetas: formularios que validan, filtros que filtran",
      "Un asistente de IA integrado que responde y lleva al cliente a reservar",
      "Esta misma página es el ejemplo más reciente",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Figma"],
    art: "web",
    accent: "#6aa7ff",
    demo: "web",
  },
];

/* ── Demos que se pueden probar ──────────────────────────────────────────── */
export type Demo = {
  id: DemoId;
  title: string;
  tagline: string;
  tries: string[];
  art: ArtId;
  accent: string;
  cta: string;
};

export const demos: Demo[] = [
  {
    id: "llamadas",
    title: "Agente de llamadas",
    tagline: "Llama a una recepcionista con IA y decide tú qué le contestas.",
    tries: [
      "Elige un sector: clínica, restaurante o inmobiliaria",
      "Pulsa «Llamar» y responde con un toque: la conversación cambia según lo que digas",
      "Mira, al lado, lo que hace el agente por detrás: agenda, WhatsApp, avisos",
      "Activa la voz para oírla de verdad",
    ],
    art: "voice",
    accent: "#ffb347",
    cta: "Probar la llamada",
  },
  {
    id: "whatsapp",
    title: "Recepcionista de WhatsApp",
    tagline: "Escribe como un cliente, con tus palabras, y mira qué entiende y qué hace.",
    tries: [
      "Prueba «mesa para 4 mañana a las 9, uno es celíaco»: entiende la frase entera",
      "Pide un hueco en una hora llena y mira cómo te ofrece alternativas",
      "Haz un pedido para recoger o pide hablar con el encargado",
      "Al lado, ve la reserva que se crea y los datos que ha extraído",
    ],
    art: "chat",
    accent: "#a78bfa",
    cta: "Abrir el chat",
  },
  {
    id: "web",
    title: "Web a medida",
    tagline: "Una web real que personalizas en vivo: sector, color, tipografía y estilo.",
    tries: [
      "Cambia entre restaurante, clínica dental y peluquería",
      "Prueba colores, tipografías, formas y el modo claro u oscuro",
      "Filtra la carta y haz una reserva: el formulario valida de verdad",
      "Pregúntale al asistente de la esquina inferior derecha",
    ],
    art: "web",
    accent: "#6aa7ff",
    cta: "Entrar en la web",
  },
];

/* ── Historia ────────────────────────────────────────────────────────────── */
export const timeline = [
  {
    when: "Los inicios",
    title: "Consolas, ordenadores y curiosidad",
    text: "Crecer entre videojuegos y cacharros tecnológicos sembró la pregunta que lo inició todo: ¿cómo se hace esto?",
  },
  {
    when: "14 años",
    title: "Mi primera página web",
    text: "Aprendizaje autodidacta: HTML, CSS y las primeras noches de prueba y error hasta publicar algo propio.",
  },
  {
    when: "16 años",
    title: "Webs a medida para negocios",
    text: "Del hobby al oficio: diseño y desarrollo personalizado, con funciones reales y resultados que se pueden medir.",
  },
  {
    when: "17 años",
    title: "Automatización e IA",
    text: "Chatbots, agentes de llamadas y flujos automáticos. La web deja de ser un escaparate y empieza a trabajar.",
  },
  {
    when: "Hoy",
    title: "One More Step, agentes y webs",
    text: "Construyo mi propia app con backend, agentes de IA para negocios con n8n y webs a medida. Construyo, rompo y vuelvo a construir.",
  },
  {
    when: "Lo siguiente",
    title: "Llevar la app a las tiendas",
    text: "Conectar los servicios externos, probar con personas reales y publicar. Todo lo demás ya está hecho para llegar ahí.",
  },
];

/* ── Stack ───────────────────────────────────────────────────────────────── */
export const stackGroups = [
  { name: "Web", items: ["React", "TypeScript", "Tailwind CSS", "Vite", "Figma", "SEO"] },
  { name: "Backend", items: ["Node.js", "Fastify", "PostgreSQL", "REST", "Zod"] },
  { name: "IA y automatización", items: ["n8n", "Make", "Claude API", "OpenAI API", "Vapi", "WhatsApp Cloud API"] },
  { name: "Móvil y tiempo real", items: ["Expo", "React Native", "LiveKit", "RevenueCat", "AdMob"] },
];

/** Palabras que giran en la esfera 3D. */
export const sphereWords = [
  "React",
  "TypeScript",
  "Tailwind",
  "Vite",
  "Node.js",
  "Fastify",
  "PostgreSQL",
  "Expo",
  "React Native",
  "n8n",
  "Make",
  "Claude",
  "OpenAI",
  "Vapi",
  "LiveKit",
  "WhatsApp",
  "Zod",
  "REST",
  "Figma",
  "SEO",
  "Git",
  "Sheets",
  "Telegram",
];

/* ── Servicios ───────────────────────────────────────────────────────────── */
export const services = [
  {
    n: "01",
    title: "Webs a medida",
    text: "Diseño y desarrollo desde cero, rápidas, bonitas y pensadas para tu proyecto. Con demos que puedes probar antes de decidir.",
    tags: ["React", "SEO local", "Diseño propio"],
  },
  {
    n: "02",
    title: "Chatbots",
    text: "Asistentes que atienden por WhatsApp, Instagram o tu web, conocen tu negocio, reservan y pasan a una persona cuando hace falta.",
    tags: ["WhatsApp", "Instagram", "Claude / OpenAI"],
  },
  {
    n: "03",
    title: "Agentes de llamadas",
    text: "Una recepcionista con voz que coge el teléfono cuando tú no puedes: da citas, confirma, recuerda y avisa al equipo si es urgente.",
    tags: ["Voz", "Citas", "Recordatorios"],
  },
  {
    n: "04",
    title: "Automatizaciones",
    text: "Flujos que conectan tus herramientas y hacen solos el trabajo repetitivo: reservas, recordatorios, avisos, hojas de cálculo.",
    tags: ["n8n", "Make", "Google Sheets"],
  },
];

/* ── Cifras (todas comprobables en mis carpetas de trabajo) ──────────────── */
export const stats = [
  { value: 4, suffix: "", label: "años aprendiendo y construyendo por mi cuenta" },
  { value: 3, suffix: "", label: "demos que puedes probar aquí mismo" },
  { value: 7, suffix: "", label: "workflows de n8n en dos automatizaciones" },
  { value: 9, suffix: "", label: "fases de producto en One More Step" },
];

export const bandWords = [
  "Webs a medida",
  "Agentes de IA",
  "Webs con IA",
  "Automatización",
  "Chatbots",
  "Voz",
  "One More Step",
  "n8n",
];
