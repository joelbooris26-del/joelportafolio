/**
 * Contenido del portafolio.
 * Todo lo editable vive aquí: nombre, textos, proyectos, automatizaciones, sectores.
 */

/* ── Edad automática ──────────────────────────────────────────────────────────
   La edad no es un número fijo: se calcula desde una fecha de nacimiento real y
   suma un año sola cada 22 de julio.

   El año de nacimiento se deduce la primera vez que se abre la página a partir de
   la edad declarada (18) y se guarda en el navegador, de modo que a partir de ahí
   siempre avanza solo, cada 22/07, sin tocar nada.                              */

const AGE_DECLARED = 18; // edad declarada al publicar esta versión
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

export const BIRTH_DATE = new Date(resolveBirthYear(), 6, 22); // 22 de julio

export function getAge(now = new Date()): number {
  let age = now.getFullYear() - BIRTH_DATE.getFullYear();
  const m = now.getMonth() - BIRTH_DATE.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < BIRTH_DATE.getDate())) age--;
  return age;
}

/** Próximo cumpleaños: fecha, días que faltan y edad que cumplirá. */
export function nextBirthday(now = new Date()) {
  let year = now.getFullYear();
  let next = new Date(year, 6, 22);
  const today = new Date(year, now.getMonth(), now.getDate());
  if (next < today) {
    year += 1;
    next = new Date(year, 6, 22);
  }
  return {
    date: next,
    year,
    days: Math.round((next.getTime() - today.getTime()) / 86_400_000),
    turns: year - BIRTH_DATE.getFullYear(),
  };
}

export const profile = {
  alias: "Joel",
  fullName: "Joaquin Merizalde Fernandez",
  role: "Desarrollo web a medida · Automatización con IA",
  city: "La Línea de la Concepción",
  region: "Cádiz",
  country: "España",
  email: "joeljmerizaldefernandez@gmail.com",
  headline: "Construyo webs a medida y agentes de IA que atienden, llaman y reservan por ti. Y mucho más.",
  sub: `${getAge()} años, de La Línea de la Concepción. Cuatro años aprendiendo por mi cuenta y un único objetivo: que la tecnología trabaje mientras el negocio vive.`,
};

export const bioParagraphs = [
  "Soy de La Línea de la Concepción, en Cádiz, donde el mar y el Peñón se ven desde cualquier azotea. Crecí rodeado de videojuegos, ordenadores y consolas: en mi casa la tecnología nunca fue un lujo, fue un lenguaje. Y mientras otros jugaban, yo me preguntaba cómo estaba hecho todo aquello por dentro.",
  "Con 14 años empecé a responder esa pregunta por mi cuenta. Sin cursos, sin atajos: documentación, foros y muchas noches de prueba y error hasta levantar mi primera página web. Desde entonces no he dejado de construir —y de romper— cosas en internet.",
  "Luego llegaron las automatizaciones y los agentes con inteligencia artificial, y entendí que ahí estaba el siguiente salto. Me lancé de cabeza: chatbots, agentes de voz y flujos que conectan aplicaciones y hacen solos el trabajo repetitivo que antes se comía las tardes de cualquier pequeño negocio.",
  "Hoy combino las dos piezas. Webs rápidas, cuidadas y totalmente personalizadas —nada de plantillas— que además trabajan solas: responden a tus clientes, gestionan tus reservas o tus citas, y te avisan solo cuando hace falta una persona de verdad. Trabajo con cualquier tipo de negocio, ya sea un restaurante, una clínica, una tienda o un taller: el método es el mismo; lo que se adapta es la solución a lo que tu empresa necesita.",
];

export const howIWork = [
  {
    title: "Entiendo antes de diseñar",
    text: "Primero el negocio: qué vendes, quién te llama, dónde pierdes tiempo. Después, la pantalla.",
  },
  {
    title: "A medida o nada",
    text: "Cada proyecto se construye desde cero: estructura, tipografías, color y funciones propias.",
  },
  {
    title: "Se prueba, no se imagina",
    text: "Entrego demos reales y funcionales para que puedas tocar el resultado antes de decidir.",
  },
  {
    title: "Sirve para tu sector",
    text: "Hostelería, salud, comercio, servicios… El método se adapta a cómo trabajas tú, no al revés.",
  },
];

export const timeline = [
  {
    year: "Los inicios",
    title: "Consolas, ordenadores y curiosidad",
    text: "Crecer entre videojuegos y cacharros tecnológicos sembró la pregunta que lo inició todo: ¿cómo se hace esto?",
  },
  {
    year: "14 años",
    title: "Mi primera página web",
    text: "Aprendizaje autodidacta: HTML, CSS y las primeras noches de prueba y error hasta publicar algo propio.",
  },
  {
    year: "16 años",
    title: "Webs a medida para negocios",
    text: "Del hobby al oficio: diseño y desarrollo personalizado, funciones reales y clientes que necesitan resultados.",
  },
  {
    year: "17 años",
    title: "Automatización e IA",
    text: "Chatbots, agentes de llamadas y flujos automáticos. La web deja de ser un escaparate y empieza a trabajar.",
  },
  {
    year: "Hoy",
    title: "Proyectos que se pueden probar",
    text: "Desarrollo web + agentes de IA en un mismo sitio: rápido, bonito y medible. Todo con demos vivas.",
  },
  {
    year: "Próximo paso",
    title: "Apps móviles",
    text: "Estoy creando una app móvil. Próximamente compartiré más información y avances del proyecto.",
  },
];

export const ticker = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Apps móviles · próximamente",
  "React Native",
  "Expo",
  "PWA",
  "Notificaciones push",
  "Diseño a medida",
  "Chatbots con IA",
  "Agentes de voz",
  "n8n",
  "Make",
  "OpenAI API",
  "Automatización",
  "SEO local",
  "Reservas online",
  "Atención al cliente 24/7",
  "Integraciones",
  "WhatsApp Business",
  "Cualquier sector",
];

export const webCapabilities = [
  {
    n: "01",
    title: "Diseño desde cero",
    text: "Identidad propia: tipografías, color, ritmo y textos pensados para tu marca. Ni una sola plantilla.",
  },
  {
    n: "02",
    title: "Funciones reales",
    text: "Reservas, cartas y catálogos, galerías, formularios que llegan a tu correo y paneles a medida.",
  },
  {
    n: "03",
    title: "Asistente integrado",
    text: "Un círculo abajo a la derecha que responde a tus clientes 24/7 con la información de tu negocio.",
  },
  {
    n: "04",
    title: "Rápida y encontrable",
    text: "Optimizada para móvil, carga ligera y SEO local para que te encuentren en tu ciudad antes que a la competencia.",
  },
  {
    n: "05",
    title: "Mantenimiento sin dolor",
    text: "Cambios de precios, fotos, servicios u horarios en minutos, sin depender de nadie ni romper nada.",
  },
];

export const webStack = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Vite",
  "Node.js",
  "Figma",
  "Responsive",
  "SEO",
  "Accesibilidad",
];

export const demoChecklist = [
  "Explorar la carta con filtros por categoría",
  "Reservar con fecha, hora y número de personas",
  "Ver la ubicación, el horario y cómo llegar",
  "Escribir al asistente del círculo inferior derecho",
];

/* ── Automatizaciones ────────────────────────────────────────────────────── */
export type AutomationId = "chatbot" | "voz" | "soporte" | "citas";

export type Automation = {
  id: AutomationId;
  n: string;
  title: string;
  tagline: string;
  text: string;
  parts: { title: string; text: string }[];
  metrics: { value: string; label: string }[];
  demoLabel: string;
};

export const automations: Automation[] = [
  {
    id: "chatbot",
    n: "01",
    title: "Chatbots inteligentes",
    tagline: "En tu web o en WhatsApp, con tu tono y tus datos",
    text: "Un bot que conoce tu negocio de verdad: servicios, precios, horarios y reglas internas. Detecta lo que quiere cada cliente, resuelve lo que puede y ejecuta lo demás —pedir una cita, abrir un ticket, avisar al equipo—.",
    parts: [
      {
        title: "Base de conocimiento",
        text: "Se alimenta con tus servicios, tarifas, FAQ, horarios y política interna.",
      },
      {
        title: "Detección de intención",
        text: "Clasifica cada mensaje: reservar, precio, urgencia, queja o duda.",
      },
      {
        title: "Respuesta y acción",
        text: "No solo contesta: crea la cita, guarda el lead o dispara un flujo.",
      },
      {
        title: "Traspaso a humano",
        text: "Si se complica, te pasa la conversación con todo el contexto.",
      },
    ],
    metrics: [
      { value: "< 2 s", label: "tiempo de respuesta" },
      { value: "24/7", label: "siempre disponible" },
      { value: "8/10", label: "conversaciones sin intervención" },
    ],
    demoLabel: "Probar el chatbot",
  },
  {
    id: "voz",
    n: "02",
    title: "Agentes de llamadas",
    tagline: "Voz natural que llama y recibe llamadas",
    text: "Un agente que descuelga tu teléfono cuando tú no puedes: confirma citas, recuerda pedidos, toma datos y cuelga dejando todo registrado. También llama por su cuenta a una lista de clientes para recuperar reservas perdidas.",
    parts: [
      {
        title: "Número y centralita",
        text: "Se conecta a tu línea actual o a un número virtual dedicado.",
      },
      {
        title: "Voz en tiempo real",
        text: "Escucha, entiende y habla con latencia de conversación humana.",
      },
      {
        title: "Guion y reglas",
        text: "Sabe qué preguntar, qué ofrecer, qué no prometer y cuándo cerrar.",
      },
      {
        title: "Registro y acciones",
        text: "Transcripción, resumen, actualización del calendario y aviso al cliente.",
      },
    ],
    metrics: [
      { value: "−40 %", label: "ausencias tras recordatorio" },
      { value: "100 %", label: "llamadas transcritas" },
      { value: "∞", label: "llamadas en paralelo" },
    ],
    demoLabel: "Simular una llamada",
  },
  {
    id: "soporte",
    n: "03",
    title: "Atención al cliente",
    tagline: "Todos tus mensajes en una sola bandeja",
    text: "Email, WhatsApp, redes y el formulario de tu web llegan al mismo sitio. La IA clasifica cada mensaje, detecta la urgencia y el tono, redacta la respuesta con tu voz y solo te molesta cuando hace falta una persona.",
    parts: [
      {
        title: "Entrada unificada",
        text: "Todos los canales entran en una única bandeja ordenada.",
      },
      {
        title: "Clasificación automática",
        text: "Tema, prioridad y sentimiento detectados al instante.",
      },
      {
        title: "Borrador de respuesta",
        text: "Redactado con tu tono; apruebas, editas o corriges en un clic.",
      },
      {
        title: "Escalado y aviso",
        text: "Lo urgente te llega al móvil; lo repetitivo se resuelve solo.",
      },
    ],
    metrics: [
      { value: "3 min", label: "respuesta media" },
      { value: "−70 %", label: "tiempo del equipo" },
      { value: "4,8/5", label: "satisfacción" },
    ],
    demoLabel: "Procesar tickets con IA",
  },
  {
    id: "citas",
    n: "04",
    title: "Reserva de citas",
    tagline: "La agenda llena sin coger el teléfono",
    text: "El cliente elige servicio, día y hora desde tu web o desde el chat. El sistema comprueba la disponibilidad real, confirma al instante y envía recordatorios. Cambios y cancelaciones: autogestión total.",
    parts: [
      {
        title: "Servicios y duraciones",
        text: "Cada servicio con su tiempo, precio y profesional asignado.",
      },
      {
        title: "Disponibilidad real",
        text: "Lee tu calendario y solo ofrece huecos que existen de verdad.",
      },
      {
        title: "Confirmación y recordatorio",
        text: "Mensaje automático al reservar y otro 24 horas antes.",
      },
      {
        title: "Cambios y cancelaciones",
        text: "El cliente se autogestiona y el hueco vuelve a quedar libre.",
      },
    ],
    metrics: [
      { value: "0", label: "llamadas para reservar" },
      { value: "24 h", label: "recordatorio automático" },
      { value: "+31 %", label: "citas fuera de horario" },
    ],
    demoLabel: "Reservar una cita",
  },
];

/* ── Sectores: mismo método, cualquier negocio ───────────────────────────── */
export type Sector = {
  name: string;
  icon:
    | "chef"
    | "heart"
    | "scissors"
    | "bag"
    | "key"
    | "tool"
    | "dumbbell"
    | "docs"
    | "bed"
    | "book"
    | "car"
    | "spark";
  pitch: string;
  web: string;
  ia: string;
  ideas: string[];
};

/* ── Apps móviles: lo que viene próximamente ─────────────────────────────── */
export const appsIntro = [
  "Hasta ahora todo lo que construyo vive en el navegador: la web de tu negocio y los agentes de IA que la hacen funcionar. El siguiente paso es lógico y ya estoy en ello: llevar ese mismo sistema al bolsillo de tus clientes y de tu equipo en forma de aplicación móvil.",
  "No hablo de hacer una app por hacerla. Hablo de la misma base de datos, la misma agenda, el mismo chatbot y las mismas automatizaciones que ya tienes, con una capa pensada para el móvil: notificaciones push, login, pagos, modo sin cobertura y un panel desde el que controlas el negocio aunque estés fuera.",
];

export const appTypes = [
  {
    n: "01",
    title: "Apps para tus clientes",
    text: "Reservar, pedir, consultar su historial, acumular puntos de fidelización y recibir avisos. Tu marca en su pantalla de inicio, no en una pestaña que se pierde.",
    icon: "users" as const,
  },
  {
    n: "02",
    title: "Apps internas para tu equipo",
    text: "Agenda del día, partes de trabajo con fotos, control de stock, fichaje y tareas asignadas. Todo sincronizado al segundo entre móviles y oficina.",
    icon: "tool" as const,
  },
  {
    n: "03",
    title: "PWA: app sin pasar por las tiendas",
    text: "Se instala desde tu propia web en dos toques, pesa muy poco, funciona sin conexión y no paga comisión de tienda. La vía más rápida y barata de empezar.",
    icon: "bolt" as const,
  },
  {
    n: "04",
    title: "Panel de control en el móvil",
    text: "Reservas, mensajes, ventas y alertas del negocio en una sola pantalla, con notificaciones push cuando ocurre algo importante.",
    icon: "chart" as const,
  },
];

export const appFeatures = [
  "iOS + Android desde un mismo código",
  "Notificaciones push",
  "Login y perfiles de usuario",
  "Pagos integrados",
  "Modo offline",
  "Sincronización en la nube",
  "Chatbot de IA dentro de la app",
  "Publicación en App Store y Google Play",
  "Actualizaciones y versiones",
  "Panel de administración",
];

export const appProcess = [
  {
    phase: "Fase 01",
    title: "Idea y alcance",
    text: "Definimos qué problema resuelve la app, para quién y qué funciones entran en la primera versión. Nada de añadir por añadir.",
  },
  {
    phase: "Fase 02",
    title: "Diseño UI/UX",
    text: "Prototipo clicable pantalla por pantalla: lo ves y lo tocas en tu móvil antes de escribir una sola línea de código.",
  },
  {
    phase: "Fase 03",
    title: "Desarrollo",
    text: "Construcción con React Native / Expo sobre la misma API que tu web. Versiones de prueba cada semana para que veas avances reales.",
  },
  {
    phase: "Fase 04",
    title: "Beta con usuarios reales",
    text: "Un grupo reducido de clientes o empleados prueba la app y reporta fallos. Se pule antes de salir al público.",
  },
  {
    phase: "Fase 05",
    title: "Publicación en tiendas",
    text: "Alta de desarrollador, fichas, capturas, políticas de privacidad y envío a App Store y Google Play hasta su aprobación.",
  },
  {
    phase: "Fase 06",
    title: "Mantenimiento y versiones",
    text: "Actualizaciones del sistema, nuevas funciones y soporte continuo. Una app sin mantenimiento muere en seis meses.",
  },
];

export const appSkills = [
  { label: "React Native / Expo", value: 68, note: "en práctica diaria" },
  { label: "Backend, APIs y bases de datos", value: 82, note: "dominado desde la web" },
  { label: "Diseño UI/UX móvil", value: 58, note: "prototipos y sistemas de diseño" },
  { label: "Publicación en tiendas", value: 34, note: "en proceso de aprendizaje" },
];

export const sectors: Sector[] = [
  {
    name: "Hostelería",
    icon: "chef",
    pitch: "Carta, reservas y un teléfono que no deja de sonar en hora punta.",
    web: "Web con carta editable, reservas por zona y galería del local.",
    ia: "Asistente que reserva mesas y responde sobre alérgenos y horarios.",
    ideas: [
      "Reservas online con confirmación automática",
      "Carta y precios actualizables sin tocar código",
      "Agente de voz que confirma y reduce mesas vacías",
    ],
  },
  {
    name: "Salud y clínicas",
    icon: "heart",
    pitch: "Citas que se mueven, dudas repetidas y pacientes que esperan respuesta.",
    web: "Web con servicios, equipo, precios orientativos y acceso a la agenda.",
    ia: "Chatbot que da cita, resuelve dudas frecuentes y filtra urgencias.",
    ideas: [
      "Agenda con recordatorios 24 h antes",
      "Triaje de urgencias con aviso inmediato al equipo",
      "Respuestas sobre seguros y cobertura",
    ],
  },
  {
    name: "Estética y bienestar",
    icon: "scissors",
    pitch: "Bonos, horarios partidos y clientes que escriben por Instagram a medianoche.",
    web: "Web con servicios, bonos, antes y después y reserva por profesional.",
    ia: "Bot en Instagram y WhatsApp que reserva y recupera clientes antiguos.",
    ideas: [
      "Reserva por profesional y duración real del servicio",
      "Campañas automáticas de reactivación",
      "Respuestas de precios y disponibilidad al instante",
    ],
  },
  {
    name: "Comercio y tiendas",
    icon: "bag",
    pitch: "Pedidos, devoluciones y la misma pregunta cincuenta veces al día.",
    web: "Tienda o catálogo con stock, envíos y ficha de producto cuidada.",
    ia: "Soporte que resuelve estados de pedido, cambios y devoluciones.",
    ideas: [
      "Bandeja única con todos los mensajes clasificados",
      "Borradores de respuesta con el tono de la marca",
      "Aviso al equipo solo en incidencias de verdad",
    ],
  },
  {
    name: "Inmobiliarias",
    icon: "key",
    pitch: "Visitas, portales y leads que se enfrían si nadie contesta a tiempo.",
    web: "Web con inmuebles, filtros, mapa y solicitud de visita.",
    ia: "Agente que cualifica al interesado y agenda la visita solo.",
    ideas: [
      "Cualificación automática del lead antes de llamar",
      "Agenda de visitas sincronizada con el equipo",
      "Seguimiento automático tras la visita",
    ],
  },
  {
    name: "Reformas y servicios",
    icon: "tool",
    pitch: "Presupuestos, obras en curso y llamadas mientras estás con las manos ocupadas.",
    web: "Web con servicios, portfolio de obras y solicitud de presupuesto.",
    ia: "Agente de voz que atiende la llamada y recoge los datos del trabajo.",
    ideas: [
      "Formulario de presupuesto que llega ordenado",
      "Llamadas atendidas cuando no puedes descolgar",
      "Recordatorios de seguimiento por obra",
    ],
  },
  {
    name: "Deporte y gimnasios",
    icon: "dumbbell",
    pitch: "Clases con aforo, cuotas y bajas que nadie avisa.",
    web: "Web con horarios, clases, tarifas y reserva de plaza.",
    ia: "Bot que reserva, mueve clases y recuerda la sesión.",
    ideas: [
      "Reserva de plaza con lista de espera automática",
      "Recordatorios que reducen ausencias",
      "Renovación de cuota avisada antes del cargo",
    ],
  },
  {
    name: "Asesorías y despachos",
    icon: "docs",
    pitch: "Documentos, plazos y clientes que llaman siempre en el peor momento.",
    web: "Web con áreas de práctica, equipo y zona privada de documentos.",
    ia: "Asistente que resuelve dudas frecuentes y organiza las peticiones.",
    ideas: [
      "Recepción y clasificación de documentación",
      "Avisos de plazo automáticos al equipo",
      "Respuestas inmediatas sobre estado de expedientes",
    ],
  },
  {
    name: "Turismo y alojamientos",
    icon: "bed",
    pitch: "Reservas de varias plataformas y huéspedes preguntando lo mismo.",
    web: "Web con habitaciones, disponibilidad, experiencias y reserva directa.",
    ia: "Asistente 24/7 para check-in, normas y recomendaciones de la zona.",
    ideas: [
      "Reserva directa sin comisiones de plataforma",
      "Check-in digital con instrucciones automáticas",
      "Atención multilingüe a cualquier hora",
    ],
  },
  {
    name: "Educación y academias",
    icon: "book",
    pitch: "Grupos, matrículas y familias que necesitan información clara.",
    web: "Web con cursos, niveles, calendario y matrícula online.",
    ia: "Bot que informa de plazas, precios y horarios y reserva clase de prueba.",
    ideas: [
      "Matrícula y pago online sin papeleo",
      "Clase de prueba reservada automáticamente",
      "Avisos a familias por canal único",
    ],
  },
  {
    name: "Automoción",
    icon: "car",
    pitch: "Citas de taller, recambios y clientes que quieren saber dónde está su coche.",
    web: "Web con servicios, vehículos en venta y petición de cita al taller.",
    ia: "Agente que agenda la cita y avisa cuando el trabajo está listo.",
    ideas: [
      "Cita de taller con huecos reales del equipo",
      "Actualizaciones de estado automáticas",
      "Presupuesto enviado sin llamadas de ida y vuelta",
    ],
  },
  {
    name: "Tu sector, si no está aquí",
    icon: "spark",
    pitch: "Si tu negocio no aparece en la lista, no significa que no encaje.",
    web: "Escucho cómo trabajas y diseño la web alrededor de tu proceso real.",
    ia: "Automatizo lo que repites cada semana, sea cual sea el sector.",
    ideas: [
      "Sesión breve para entender tu día a día",
      "Propuesta con lo que se puede automatizar",
      "Demo funcional antes de decidir nada",
    ],
  },
];
