/** Restaurante inventado para la demo interactiva: "Marea Alta". */

const px = (id: number, w = 700) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${w}`;

export const restaurant = {
  name: "Marea Alta",
  tagline: "Cocina de mar y brasa",
  city: "La Línea de la Concepción",
  address: "Paseo Marítimo de Levante, 14",
  zip: "11300 · La Línea de la Concepción (Cádiz)",
  phone: "+34 956 00 12 34",
  phoneHref: "tel:+34956001234",
  email: "reservas@mareaalta.es",
  instagram: "@mareaalta.cadiz",
  mapsQuery: "Paseo+Maritimo+La+Linea+de+la+Concepcion+Cadiz",
  heroImage:
    "https://images.pexels.com/photos/33630389/pexels-photo-33630389.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900",
  interiorImage:
    "https://images.pexels.com/photos/10135116/pexels-photo-10135116.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800",
  since: 2016,
};

export const hours = [
  { day: "Lunes", time: "Cerrado", closed: true },
  { day: "Martes – Jueves", time: "13:00 – 16:00 · 20:00 – 23:30" },
  { day: "Viernes – Sábado", time: "13:00 – 16:30 · 20:00 – 00:30" },
  { day: "Domingo", time: "13:00 – 17:00" },
];

export type Dish = {
  name: string;
  desc: string;
  price: string;
  img?: string;
  tags?: string[];
  star?: boolean;
};

export type MenuSection = {
  id: string;
  label: string;
  note?: string;
  dishes: Dish[];
};

export const menu: MenuSection[] = [
  {
    id: "empezar",
    label: "Para empezar",
    note: "Tapas frías y calientes de la bahía",
    dishes: [
      {
        name: "Gambas blancas al ajillo de manzanilla",
        desc: "Gamba de Huelva, ajo confitado, manzanilla de Sanlúcar y guindilla.",
        price: "14,50",
        img: px(8697543),
        tags: ["Marisco", "Picante suave"],
        star: true,
      },
      {
        name: "Tartar de atún rojo de almadraba",
        desc: "Atún de almadraba, soja cítrica, aguacate y crujiente de algas.",
        price: "18,00",
        img: px(34556825),
        tags: ["Pescado crudo"],
      },
      {
        name: "Ensaladilla de centollo con regañá",
        desc: "Centollo desmigado, patata de Sanlúcar, mayonesa fina y regañá.",
        price: "11,50",
        img: px(8743912),
        tags: ["Marisco"],
      },
      {
        name: "Tomate de Barbate con ventresca",
        desc: "Tomate de temporada, ventresca en conserva, AOVE y sal en escamas.",
        price: "9,80",
        img: px(6383082),
        tags: ["Vegetariano sin pan"],
      },
    ],
  },
  {
    id: "mar",
    label: "Del mar y la brasa",
    note: "Producto del día comprado en la lonja",
    dishes: [
      {
        name: "Lubina de estero a la brasa",
        desc: "Lubina salvaje de estero, brasa de encina, limón asado y su pil-pil.",
        price: "24,00",
        img: px(6046746),
        tags: ["Para compartir"],
        star: true,
      },
      {
        name: "Corvina al horno con hierbas de la Sierra",
        desc: "Corvina del día, hinojo, patata panadera y mantequilla de hierbas.",
        price: "22,50",
        img: px(6382822),
      },
      {
        name: "Mariscada Marea Alta",
        desc: "Langostinos, gambas, cigalas, bocas, cañaíllas y almejas. Para dos.",
        price: "58,00",
        img: px(17649395),
        tags: ["2 personas", "Encargo 24 h"],
      },
      {
        name: "Ventresca de atún a la plancha",
        desc: "Ventresca marcada, cebolleta encurtida y reducción de oloroso.",
        price: "21,00",
        img: px(31815435),
      },
    ],
  },
  {
    id: "arroces",
    label: "Arroces y guisos",
    note: "Mínimo 2 personas · 20 minutos de espera",
    dishes: [
      {
        name: "Arroz a banda de galera y langostino",
        desc: "Fondo de galera, langostino de la bahía y alioli de azafrán.",
        price: "21,50 / pers.",
        img: px(17649394),
        star: true,
      },
      {
        name: "Caldereta de fideos con choco",
        desc: "Fideos tostados, choco de la bahía y salsa de pimiento choricero.",
        price: "19,00",
        img: px(20157989),
      },
    ],
  },
  {
    id: "tierra",
    label: "De la tierra",
    dishes: [
      {
        name: "Presa ibérica con mojo de ajo quemado",
        desc: "Presa de bellota a la brasa, mojo canario y patatas de arena.",
        price: "22,50",
        img: px(15597769),
      },
      {
        name: "Retinto de la Janda, chuletón madurado",
        desc: "45 días de maduración. Se sirve al peso con pimientos asados.",
        price: "48,00 / kg",
        img: px(7636375),
        tags: ["Para compartir"],
      },
    ],
  },
  {
    id: "postres",
    label: "Postres",
    note: "Obrador propio, hechos cada mañana",
    dishes: [
      {
        name: "Tocino de cielo con helado de vainilla",
        desc: "Receta de la casa, yema caramelizada y helado artesano.",
        price: "7,00",
        img: px(15643149),
      },
      { name: "Tarta de queso de La Serena al horno", desc: "Cremosa, sin base, con mermelada de higo.", price: "7,50" },
      { name: "Pestiños gaditanos con miel de caña", desc: "Cuatro unidades, canela y anís.", price: "6,00" },
      { name: "Helado de mantecado y torta de aceite", desc: "Sorbete casero de invierno.", price: "5,50" },
    ],
  },
  {
    id: "bodega",
    label: "Bodega",
    note: "Marco de Jerez y vinos de Cádiz",
    dishes: [
      { name: "Manzanilla en rama (copa / botella)", desc: "Sanlúcar de Barrameda, saca de primavera.", price: "3,50 / 16,00" },
      { name: "Fino gaditano (copa / botella)", desc: "Crianza biológica, servido a 7 ºC.", price: "3,00 / 14,00" },
      { name: "Blanco de Cádiz (copa / botella)", desc: "Palomino y moscatel, salino y fresco.", price: "4,00 / 19,00" },
      { name: "Tinto de la Sierra de Cádiz", desc: "Syrah y tempranillo, 6 meses de barrica.", price: "4,50 / 21,00" },
      { name: "Vermut de la casa", desc: "Naranja amarga, oliva y sifón.", price: "4,00" },
    ],
  },
];

export const tastingMenu = {
  name: "Menú degustación Marea Alta",
  price: "48 € por persona",
  maridaje: "Maridaje con vinos de Cádiz +18 €",
  steps: [
    "Gamba blanca de Huelva templada",
    "Tartar de atún rojo de almadraba",
    "Arroz meloso de galera",
    "Lubina de estero a la brasa",
    "Presa ibérica con mojo de ajo quemado",
    "Tocino de cielo y helado de vainilla",
  ],
};

export const zones = ["Sala interior", "Terraza con vistas", "Barra"];
export const timeSlots = [
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];
export const busySlots = ["14:30", "21:00", "21:30"];

/* ── Asistente virtual del restaurante ───────────────────────────────────── */
export type BotRule = {
  keys: string[];
  reply: string;
  chips?: string[];
};

export const botRules: BotRule[] = [
  {
    keys: ["horario", "hora", "abierto", "abren", "cerr", "cuando abren", "cuándo abren"],
    reply:
      "Abrimos de martes a jueves de 13:00 a 16:00 y de 20:00 a 23:30; viernes y sábado hasta las 00:30, y el domingo solo mediodía (13:00–17:00). Los lunes descansamos.",
    chips: ["Reservar mesa", "Ver la carta"],
  },
  {
    keys: ["reserv", "mesa", "cita", "booking", "sitio"],
    reply:
      "Puedo guardarte la mesa ahora mismo. Dime para cuántas personas y a qué hora, o abre el formulario de reservas y lo completas en 20 segundos.",
    chips: ["Reservar para 2 hoy", "Reservar para 4 el sábado", "Abrir reservas"],
  },
  {
    keys: ["carta", "menu", "menú", "comer", "plato", "precio", "cuesta", "recomien", "especialidad"],
    reply:
      "Nuestra especialidad es el producto de la bahía: gamba blanca al ajillo de manzanilla, tartar de atún rojo de almadraba y la lubina de estero a la brasa. También tenemos el Menú degustación Marea Alta por 48 € (6 pases).",
    chips: ["Ver la carta", "¿Hay menú para niños?", "Soy vegetariano"],
  },
  {
    keys: ["terraz", "fuera", "vistas", "mar", "exterior"],
    reply:
      "Sí, tenemos terraza cubierta con vistas al paseo marítimo y calefactores en invierno. Es la zona que más se pide: conviene reservar con antelación los fines de semana.",
    chips: ["Reservar terraza", "¿Horario?"],
  },
  {
    keys: ["alerg", "gluten", "celiac", "celíac", "lactosa", "vegan", "vegetarian", "intoleran"],
    reply:
      "Trabajamos con carta de alérgenos y adaptamos casi todos los platos sin gluten y sin lactosa. Para celiaquía severa, avísanos al reservar: la cocina prepara un pase aparte. Opciones vegetarianas: tomate de Barbate con ventresca, ensalada de la huerta y arroz de verduras.",
    chips: ["Reservar mesa", "Ver la carta"],
  },
  {
    keys: ["donde", "dónde", "ubicacion", "ubicación", "direccion", "dirección", "llegar", "mapa", "aparcar", "parking"],
    reply:
      "Estamos en el Paseo Marítimo de Levante, 14, en primera línea de playa (La Línea de la Concepción). Hay aparcamiento público a 150 m y parada de autobús en la misma puerta.",
    chips: ["Ver ubicación", "¿Horario?"],
  },
  {
    keys: ["perro", "mascota", "niño", "niños", "familia", "silla"],
    reply:
      "Los perros son bienvenidos en la terraza y tenemos tronas y menú infantil (12 €) con pescado del día o pollo empanado.",
    chips: ["Reservar mesa", "¿Horario?"],
  },
  {
    keys: ["grupo", "evento", "celebr", "cumple", "empresa", "comunion", "comunión", "boda"],
    reply:
      "Aceptamos grupos de hasta 40 personas en la sala interior y menús cerrados para celebraciones desde 38 € por persona. Escríbenos a reservas@mareaalta.es y te preparamos una propuesta en 24 h.",
    chips: ["Abrir contacto", "Ver la carta"],
  },
  {
    keys: ["pago", "tarjeta", "efectivo", "bizum", "factura"],
    reply:
      "Aceptamos tarjeta, Bizum y efectivo. Podemos emitir factura si la pides antes de pagar.",
  },
  {
    keys: ["humano", "persona", "telefono", "teléfono", "llamar", "encargado", "hablar con"],
    reply:
      "Claro. Llama al +34 956 00 12 34 (horario de apertura) o escríbenos a reservas@mareaalta.es. Si me dejas tu nombre y teléfono, el equipo te devuelve la llamada hoy mismo.",
    chips: ["Abrir contacto", "Reservar mesa"],
  },
  {
    keys: ["hola", "buenas", "hey", "saludos", "buenos dias", "buenas tardes", "buenas noches"],
    reply:
      "¡Hola! Soy Sofía, la asistente de Marea Alta. Puedo ayudarte con la carta, las reservas, los horarios, los alérgenos o cómo llegar. ¿Qué necesitas?",
    chips: ["Reservar mesa", "Ver la carta", "¿Dónde estáis?"],
  },
];

export const botFallback =
  "No estoy segura de haberlo entendido. Puedo ayudarte con reservas, la carta, horarios, alérgenos, terrazas y cómo llegar. Si prefieres, te paso con una persona del equipo.";

export const botChips = [
  "Reservar mesa",
  "Ver la carta",
  "¿Horario?",
  "¿Tenéis terraza?",
  "Alérgenos",
  "¿Dónde estáis?",
  "Hablar con una persona",
];
