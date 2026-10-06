import { useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/utils/cn";
import { ICheck, IChat, IClose, IMoon, IReset, ISun, type DemoProps } from "./kit";

/* ══════════════════ Contenido de las webs de ejemplo (ficticias) ══════════════════ */

type SectorId = "restaurante" | "clinica" | "peluqueria";
type Item = { cat: string; name: string; desc: string; price: string };
type Sector = {
  id: SectorId;
  label: string;
  name: string;
  domain: string;
  code: string;
  headline: string;
  sub: string;
  cta: string;
  chips: string[];
  catalogTitle: string;
  cats: { id: string; label: string }[];
  items: Item[];
  formTitle: string;
  submit: string;
  people?: boolean;
  slots: string[];
  info: { k: string; v: string }[];
  faq: { q: string; a: string }[];
};

const lunchDinner = ["13:00", "13:30", "14:00", "14:30", "15:00", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];

const SECTORS: Sector[] = [
  {
    id: "restaurante",
    label: "Restaurante",
    name: "La Taberna del Peñón",
    domain: "latabernadelpenon.demo",
    code: "TP",
    headline: "Cocina de La Línea, con el mar en la mesa.",
    sub: "Producto de la bahía, brasa de encina y una terraza con vistas. Reserva en veinte segundos.",
    cta: "Reservar mesa",
    chips: ["Producto de lonja", "Brasa de encina", "Terraza con vistas"],
    catalogTitle: "La carta",
    cats: [
      { id: "picar", label: "Para picar" },
      { id: "mar", label: "Del mar" },
      { id: "brasa", label: "De la brasa" },
      { id: "dulce", label: "Dulces" },
    ],
    items: [
      { cat: "picar", name: "Croquetas de jamón", desc: "Seis unidades, cremosas, de jamón ibérico.", price: "8 €" },
      { cat: "picar", name: "Tortillitas de camarones", desc: "Finas y crujientes, con camarón de la bahía.", price: "9 €" },
      { cat: "mar", name: "Tataki de atún", desc: "Atún sellado, salsa cítrica y sésamo.", price: "16 €" },
      { cat: "mar", name: "Arroz con carabinero", desc: "Caldo intenso, carabinero y alioli suave.", price: "18 €" },
      { cat: "brasa", name: "Hamburguesa de retinto", desc: "Carne madurada, queso curado y cebolla caramelizada.", price: "13,50 €" },
      { cat: "brasa", name: "Presa ibérica", desc: "A la brasa de encina, con patatas de arena.", price: "17 €" },
      { cat: "dulce", name: "Tarta de queso", desc: "Cremosa, sin base, con mermelada de higo.", price: "6 €" },
      { cat: "dulce", name: "Torrija caramelizada", desc: "Pan brioche, canela y helado de vainilla.", price: "5,50 €" },
    ],
    formTitle: "Reserva tu mesa",
    submit: "Confirmar reserva",
    people: true,
    slots: lunchDinner,
    info: [
      { k: "Horario", v: "Mar–Dom · 13:00–16:00 y 20:00–23:30. Lunes cerrado." },
      { k: "Dónde", v: "Calle Real, 12 · La Línea de la Concepción" },
      { k: "Teléfono", v: "+34 956 00 45 67" },
    ],
    faq: [
      { q: "¿Qué horario tenéis?", a: "Abrimos de martes a domingo: comidas de 13:00 a 16:00 y cenas de 20:00 a 23:30. Los lunes descansamos." },
      { q: "¿Hay opciones sin gluten?", a: "Sí: tortillitas de camarones, tataki de atún, arroz con carabinero y tarta de queso. Avísanos al reservar." },
      { q: "¿Admitís perros?", a: "Sí, en la terraza son bienvenidos." },
      { q: "¿Cómo llego?", a: "Calle Real, 12. Hay parking público a 100 metros y la entrada no tiene escalones." },
    ],
  },
  {
    id: "clinica",
    label: "Clínica dental",
    name: "Clínica Dental Sonrisa Sur",
    domain: "sonrisasur.demo",
    code: "SS",
    headline: "Tu sonrisa, en buenas manos.",
    sub: "Un equipo cercano en el centro de La Línea. Te explicamos cada paso y el precio, antes de empezar.",
    cta: "Pedir cita",
    chips: ["Primera revisión gratis", "Financiación sin intereses", "Urgencias el mismo día"],
    catalogTitle: "Tratamientos",
    cats: [
      { id: "prev", label: "Prevención" },
      { id: "est", label: "Estética" },
      { id: "orto", label: "Ortodoncia" },
      { id: "impl", label: "Implantes" },
    ],
    items: [
      { cat: "prev", name: "Revisión y diagnóstico", desc: "Exploración completa y un plan claro por escrito.", price: "Gratis" },
      { cat: "prev", name: "Limpieza con ultrasonidos", desc: "Elimina sarro y manchas. Recomendada una vez al año.", price: "45 €" },
      { cat: "est", name: "Blanqueamiento profesional", desc: "Una sesión en clínica, con revisión previa.", price: "220 €" },
      { cat: "est", name: "Carillas", desc: "Ves cómo quedarán antes de empezar.", price: "Desde 290 € / pieza" },
      { cat: "orto", name: "Ortodoncia invisible", desc: "Alineadores casi imperceptibles.", price: "Desde 1.990 €" },
      { cat: "orto", name: "Brackets estéticos", desc: "Discretos y con precio más contenido.", price: "Desde 1.290 €" },
      { cat: "impl", name: "Implante + corona", desc: "Sustituye un diente perdido con aspecto natural.", price: "Desde 1.290 €" },
      { cat: "impl", name: "Valoración de implantes", desc: "Estudio 3D y presupuesto cerrado.", price: "Gratis" },
    ],
    formTitle: "Pide tu cita",
    submit: "Solicitar cita",
    slots: ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"],
    info: [
      { k: "Horario", v: "L–V 09:00–20:30 · Sáb 09:30–14:00" },
      { k: "Dónde", v: "Av. de España, 18 · La Línea de la Concepción" },
      { k: "Teléfono", v: "+34 956 00 12 30" },
    ],
    faq: [
      { q: "¿Qué horario tenéis?", a: "De lunes a viernes de 09:00 a 20:30 y los sábados de 09:30 a 14:00." },
      { q: "¿Aceptáis seguros?", a: "Trabajamos con las principales aseguradoras. Recepción comprueba tu póliza antes de la cita, sin compromiso." },
      { q: "¿Se puede financiar?", a: "Sí: los tratamientos de más de 300 € se pueden repartir en cuotas sin intereses." },
      { q: "Tengo una urgencia", a: "Pide cita marcando «urgencia» o llámanos. Si hay hinchazón en la cara o te cuesta tragar o respirar, llama al 112." },
    ],
  },
  {
    id: "peluqueria",
    label: "Peluquería",
    name: "Estudio Marea",
    domain: "estudiomarea.demo",
    code: "EM",
    headline: "Pelo con carácter, sin prisas.",
    sub: "Corte, color y tratamientos con cita online. Elige servicio y hora en un minuto.",
    cta: "Reservar cita",
    chips: ["Cita online 24/7", "Productos profesionales", "Atención personalizada"],
    catalogTitle: "Servicios",
    cats: [
      { id: "corte", label: "Corte" },
      { id: "color", label: "Color" },
      { id: "trat", label: "Tratamientos" },
    ],
    items: [
      { cat: "corte", name: "Corte y peinado", desc: "Lavado, corte y secado a tu medida.", price: "28 €" },
      { cat: "corte", name: "Corte + barba", desc: "Perfilado de barba incluido.", price: "32 €" },
      { cat: "color", name: "Balayage", desc: "Luz natural y degradados suaves.", price: "Desde 85 €" },
      { cat: "color", name: "Tinte de raíz", desc: "Cubre canas con tono a medida.", price: "38 €" },
      { cat: "color", name: "Mechas babylights", desc: "Iluminación fina y discreta.", price: "Desde 75 €" },
      { cat: "trat", name: "Keratina antifrizz", desc: "Brillo y control durante meses.", price: "110 €" },
      { cat: "trat", name: "Hidratación profunda", desc: "Recupera suavidad y elasticidad.", price: "30 €" },
    ],
    formTitle: "Reserva tu cita",
    submit: "Reservar cita",
    slots: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"],
    info: [
      { k: "Horario", v: "Mar–Sáb · 10:00–20:00" },
      { k: "Dónde", v: "Calle Clavel, 3 · La Línea de la Concepción" },
      { k: "Teléfono", v: "+34 956 00 74 40" },
    ],
    faq: [
      { q: "¿Qué horario tenéis?", a: "De martes a sábado de 10:00 a 20:00. Domingo y lunes cerramos." },
      { q: "¿Cuánto dura un balayage?", a: "Entre dos horas y media y tres, según el cabello. Te lo confirmamos al reservar." },
      { q: "¿Puedo cambiar mi cita?", a: "Sí, desde el mensaje de confirmación o escribiéndonos con 24 horas de antelación." },
      { q: "¿Cómo llego?", a: "Calle Clavel, 3, en pleno centro. Hay aparcamiento público a 80 metros." },
    ],
  },
];

/* ══════════════════ Personalización ══════════════════ */

const ACCENTS = [
  { id: "azul", hex: "#3b82f6" },
  { id: "coral", hex: "#ef5a4c" },
  { id: "verde", hex: "#12a574" },
  { id: "ámbar", hex: "#f0a91b" },
  { id: "violeta", hex: "#8b5cf6" },
];
const FONTS = [
  { id: "moderna", label: "Moderna", css: '"Space Grotesk", system-ui, sans-serif' },
  { id: "clásica", label: "Clásica", css: 'Georgia, "Times New Roman", serif' },
  { id: "técnica", label: "Técnica", css: '"JetBrains Mono", ui-monospace, monospace' },
];

const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const darken = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(v * k).toString(16).padStart(2, "0");
  return `#${f((n >> 16) & 255)}${f((n >> 8) & 255)}${f(n & 255)}`;
};

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

type FormState = { name: string; phone: string; date: string; time: string; people: number; service: string; notes: string; consent: boolean; urgent: boolean };
const emptyForm = (s: Sector): FormState => ({ name: "", phone: "", date: todayISO(), time: "", people: 2, service: s.items[0].name, notes: "", consent: false, urgent: false });

/* ══════════════════ Componente ══════════════════ */

export default function WebDemo({ onContact }: DemoProps) {
  const [sid, setSid] = useState<SectorId>("restaurante");
  const [accent, setAccent] = useState(ACCENTS[0].hex);
  const [font, setFont] = useState(FONTS[0].id);
  const [round, setRound] = useState(true);
  const [dark, setDark] = useState(true);
  const [panel, setPanel] = useState(false);

  const sector = SECTORS.find((s) => s.id === sid) ?? SECTORS[0];
  const [cat, setCat] = useState<string>(sector.cats[0].id);
  const [form, setForm] = useState<FormState>(() => emptyForm(sector));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [done, setDone] = useState<string | null>(null);
  const [chat, setChat] = useState(false);
  const [qa, setQa] = useState<{ q: string; a: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const theme = useMemo<CSSProperties>(() => {
    const light = !dark;
    return {
      ["--a" as string]: accent,
      ["--at" as string]: light ? darken(accent, 0.72) : accent,
      ["--on" as string]: lum(accent) > 0.5 ? "#101214" : "#ffffff",
      ["--bg" as string]: light ? "#fbf9f5" : "#0d0f12",
      ["--fg" as string]: light ? "#16191c" : "#f3f5f7",
      ["--mu" as string]: light ? "#5d646a" : "#9aa3ab",
      ["--card" as string]: light ? "#ffffff" : "#151a1f",
      ["--ln" as string]: light ? "rgba(0,0,0,0.11)" : "rgba(255,255,255,0.11)",
      ["--r" as string]: round ? "18px" : "3px",
      ["--rb" as string]: round ? "999px" : "3px",
      fontFamily: FONTS.find((f) => f.id === font)?.css,
      background: "var(--bg)",
      color: "var(--fg)",
    } as CSSProperties;
  }, [accent, dark, round, font]);

  const pickSector = (id: SectorId) => {
    const s = SECTORS.find((x) => x.id === id) ?? SECTORS[0];
    setSid(id);
    setCat(s.cats[0].id);
    setForm(emptyForm(s));
    setErrors({});
    setDone(null);
    setQa([]);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const resetAll = () => {
    setAccent(ACCENTS[0].hex);
    setFont(FONTS[0].id);
    setRound(true);
    setDark(true);
  };

  const go = (id: string) => {
    const box = scrollRef.current;
    const el = box?.querySelector<HTMLElement>(`#${id}`);
    if (box && el) box.scrollTo({ top: el.offsetTop - 56, behavior: "smooth" });
  };

  const pickItem = (it: Item) => {
    setDone(null);
    if (sector.people) setForm((f) => ({ ...f, notes: f.notes.includes(it.name) ? f.notes : `${f.notes ? f.notes + ". " : ""}Quiero probar: ${it.name}` }));
    else setForm((f) => ({ ...f, service: it.name }));
    go("wd-form");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (form.name.trim().length < 2) er.name = "Dinos tu nombre.";
    if (form.phone.replace(/\D/g, "").length < 9) er.phone = "Teléfono no válido (9 cifras).";
    if (!form.urgent || sector.people) {
      if (!form.date) er.date = "Elige un día.";
      else if (form.date < todayISO()) er.date = "Ese día ya pasó.";
      if (!form.time) er.time = "Elige una hora.";
    }
    if (!form.consent) er.consent = "Necesitamos tu consentimiento para gestionar la solicitud.";
    setErrors(er);
    if (Object.keys(er).length === 0) setDone(`${sector.code}-${Math.floor(100 + Math.random() * 900)}`);
  };

  const ask = (q: { q: string; a: string }) => setQa((x) => (x.some((y) => y.q === q.q) ? x : [...x, q]));

  const items = sector.items.filter((i) => i.cat === cat);
  const inputCls =
    "w-full border bg-transparent px-3.5 py-2.5 text-[0.9rem] outline-none transition-colors focus:border-[var(--a)] [border-color:var(--ln)] [border-radius:var(--r)] placeholder:opacity-50";

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      {/* ── Panel de personalización ── */}
      <aside className="shrink-0 border-b border-white/10 lg:w-[17.5rem] lg:border-b-0 lg:border-r lg:overflow-y-auto">
        <button
          onClick={() => setPanel((p) => !p)}
          aria-expanded={panel}
          className="flex w-full items-center justify-between px-4 py-3 text-left lg:hidden"
        >
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-lime">Personalizar esta web</span>
          <span className="font-mono text-[0.7rem] text-mute">{panel ? "Ocultar" : "Mostrar"}</span>
        </button>

        <div className={cn("space-y-5 px-4 pb-5 lg:block lg:max-h-none lg:overflow-visible lg:py-5", panel ? "block max-h-[42dvh] overflow-y-auto" : "hidden")}>
          <p className="hidden font-display text-[1rem] font-bold leading-tight text-white lg:block">
            Personaliza esta web
            <span className="mt-1 block font-sans text-[0.8rem] font-normal text-mute">Cada cambio se ve al instante a la derecha.</span>
          </p>

          <Group label="Sector">
            {SECTORS.map((s) => (
              <Pill key={s.id} on={s.id === sid} onClick={() => pickSector(s.id)}>
                {s.label}
              </Pill>
            ))}
          </Group>

          <Group label="Color principal">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAccent(a.hex)}
                aria-label={`Color ${a.id}`}
                aria-pressed={accent === a.hex}
                className={cn("h-8 w-8 rounded-full border-2 transition-transform", accent === a.hex ? "scale-110 border-white" : "border-transparent hover:scale-105")}
                style={{ background: a.hex }}
              />
            ))}
          </Group>

          <Group label="Tipografía">
            {FONTS.map((f) => (
              <Pill key={f.id} on={f.id === font} onClick={() => setFont(f.id)}>
                {f.label}
              </Pill>
            ))}
          </Group>

          <Group label="Estilo">
            <Pill on={round} onClick={() => setRound(true)}>
              Redondeado
            </Pill>
            <Pill on={!round} onClick={() => setRound(false)}>
              Recto
            </Pill>
          </Group>

          <Group label="Tema">
            <Pill on={dark} onClick={() => setDark(true)}>
              <IMoon className="h-3.5 w-3.5" /> Oscuro
            </Pill>
            <Pill on={!dark} onClick={() => setDark(false)}>
              <ISun className="h-3.5 w-3.5" /> Claro
            </Pill>
          </Group>

          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={resetAll} className="btn-ghost px-3.5 py-2 text-[0.74rem]">
              <IReset className="h-3.5 w-3.5" /> Restablecer
            </button>
            <button onClick={onContact} className="btn-lime px-3.5 py-2 text-[0.74rem]">
              Quiero una así
            </button>
          </div>

          <p className="text-[0.78rem] leading-relaxed text-mute">
            Esto es lo que significa «a medida»: estructura, colores, tipografías y funciones pensadas para cada negocio, no una plantilla con el logo cambiado.
          </p>
        </div>
      </aside>

      {/* ── Navegador con la web ── */}
      <div className="relative min-h-0 min-w-0 flex-1 p-2 sm:p-4">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/12 bg-panel">
          <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-3.5 py-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </span>
            <span className="min-w-0 flex-1 truncate rounded-lg bg-white/[0.05] px-3 py-1 text-center font-mono text-[0.62rem] text-mute">https://{sector.domain}</span>
          </div>

          {/* La web de ejemplo */}
          <div ref={scrollRef} style={theme} className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            {/* Menú */}
            <nav className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-8 [background:var(--bg)] [border-color:var(--ln)]">
              <span className="flex items-center gap-2.5 font-bold tracking-tight">
                <span className="grid h-8 w-8 place-items-center text-[0.8rem] font-extrabold [background:var(--a)] [color:var(--on)] [border-radius:var(--r)]">{sector.code}</span>
                <span className="hidden text-[0.95rem] sm:inline">{sector.name}</span>
              </span>
              <span className="hidden items-center gap-6 text-[0.84rem] [color:var(--mu)] md:flex">
                <button onClick={() => go("wd-cat")} className="hover:[color:var(--fg)]">{sector.catalogTitle}</button>
                <button onClick={() => go("wd-form")} className="hover:[color:var(--fg)]">Reservar</button>
                <button onClick={() => go("wd-info")} className="hover:[color:var(--fg)]">Contacto</button>
              </span>
              <button onClick={() => go("wd-form")} className="px-4 py-2 text-[0.8rem] font-semibold [background:var(--a)] [color:var(--on)] [border-radius:var(--rb)]">
                {sector.cta}
              </button>
            </nav>

            {/* Portada */}
            <header className="relative overflow-hidden px-4 py-14 sm:px-8 sm:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-40"
                style={{ background: "radial-gradient(circle, var(--a), transparent 68%)" }}
              />
              <div className="relative max-w-2xl">
                <p className="text-[0.74rem] font-semibold uppercase tracking-[0.22em] [color:var(--at)]">{sector.name}</p>
                <h1 className="mt-4 text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">{sector.headline}</h1>
                <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed [color:var(--mu)]">{sector.sub}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => go("wd-form")} className="px-6 py-3 text-[0.9rem] font-semibold [background:var(--a)] [color:var(--on)] [border-radius:var(--rb)]">
                    {sector.cta}
                  </button>
                  <button onClick={() => go("wd-cat")} className="border px-6 py-3 text-[0.9rem] font-semibold [border-color:var(--ln)] [border-radius:var(--rb)]">
                    Ver {sector.catalogTitle.toLowerCase()}
                  </button>
                </div>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {sector.chips.map((c) => (
                    <li key={c} className="border px-3.5 py-1.5 text-[0.76rem] [border-color:var(--ln)] [border-radius:var(--rb)] [color:var(--mu)]">
                      <span className="mr-1.5 [color:var(--at)]">●</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </header>

            {/* Catálogo con filtro */}
            <section id="wd-cat" className="px-4 py-12 sm:px-8">
              <h2 className="text-[1.7rem] font-extrabold tracking-[-0.02em]">{sector.catalogTitle}</h2>
              <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label={sector.catalogTitle}>
                {sector.cats.map((c) => (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={cat === c.id}
                    onClick={() => setCat(c.id)}
                    className={cn("border px-4 py-2 text-[0.82rem] font-medium transition-colors [border-radius:var(--rb)]", cat === c.id ? "[background:var(--a)] [border-color:var(--a)] [color:var(--on)]" : "[border-color:var(--ln)] [color:var(--mu)]")}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {items.map((it) => (
                  <article key={it.name} className="flex flex-col border p-5 [background:var(--card)] [border-color:var(--ln)] [border-radius:var(--r)]">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[1.02rem] font-bold leading-snug tracking-tight">{it.name}</h3>
                      <span className="shrink-0 text-[0.86rem] font-bold [color:var(--at)]">{it.price}</span>
                    </div>
                    <p className="mt-1.5 flex-1 text-[0.86rem] leading-relaxed [color:var(--mu)]">{it.desc}</p>
                    <button onClick={() => pickItem(it)} className="mt-4 self-start text-[0.8rem] font-semibold [color:var(--at)] hover:underline">
                      {sector.people ? "Añadir a mi reserva →" : "Pedir cita para esto →"}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* Formulario */}
            <section id="wd-form" className="border-y px-4 py-12 sm:px-8 [border-color:var(--ln)]">
              <h2 className="text-[1.7rem] font-extrabold tracking-[-0.02em]">{sector.formTitle}</h2>
              {done ? (
                <div className="pop mt-6 max-w-lg border p-6 [background:var(--card)] [border-color:var(--a)] [border-radius:var(--r)]">
                  <span className="grid h-10 w-10 place-items-center rounded-full [background:var(--a)] [color:var(--on)]">
                    <ICheck className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[1.2rem] font-extrabold">¡Hecho, {form.name.split(" ")[0]}!</p>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed [color:var(--mu)]">
                    {form.urgent && !sector.people ? "Te llamamos en menos de 15 minutos." : `${form.date.split("-").reverse().join("/")} a las ${form.time}${sector.people ? ` · ${form.people} personas` : ` · ${form.service}`}.`}{" "}
                    Código <strong className="[color:var(--fg)]">{done}</strong>. En una web real, te llegaría un WhatsApp de confirmación.
                  </p>
                  <p className="mt-3 text-[0.74rem] [color:var(--mu)]">Esto es una demo: no se ha enviado ningún dato.</p>
                  <button onClick={() => { setDone(null); setForm(emptyForm(sector)); }} className="mt-4 border px-4 py-2 text-[0.82rem] font-semibold [border-color:var(--ln)] [border-radius:var(--rb)]">
                    Hacer otra
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
                  <Field label="Nombre" error={errors.name}>
                    <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Tu nombre" />
                  </Field>
                  <Field label="Teléfono" error={errors.phone}>
                    <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} inputMode="tel" className={inputCls} placeholder="600 000 000" />
                  </Field>

                  {sector.people ? (
                    <Field label="Personas">
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label="Menos personas" onClick={() => setForm((f) => ({ ...f, people: Math.max(1, f.people - 1) }))} className="h-10 w-10 border text-lg [border-color:var(--ln)] [border-radius:var(--r)]">–</button>
                        <span className="min-w-[5.5rem] border py-2.5 text-center text-[0.9rem] [border-color:var(--ln)] [border-radius:var(--r)]">{form.people} personas</span>
                        <button type="button" aria-label="Más personas" onClick={() => setForm((f) => ({ ...f, people: Math.min(10, f.people + 1) }))} className="h-10 w-10 border text-lg [border-color:var(--ln)] [border-radius:var(--r)]">+</button>
                      </div>
                    </Field>
                  ) : (
                    <Field label="Servicio">
                      <select value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} className={cn(inputCls, "[color-scheme:inherit]")}>
                        {sector.items.map((i) => (
                          <option key={i.name} value={i.name} style={{ color: "#111" }}>
                            {i.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  <Field label="Día" error={errors.date}>
                    <input type="date" min={todayISO()} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={cn(inputCls, "[color-scheme:inherit]")} />
                  </Field>

                  <div className="sm:col-span-2">
                    <p className="mb-2 text-[0.74rem] font-semibold uppercase tracking-[0.14em] [color:var(--mu)]">
                      Hora {errors.time && <span className="ml-2 normal-case tracking-normal [color:#ef5a4c]">· {errors.time}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sector.slots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, time: t }))}
                          aria-pressed={form.time === t}
                          className={cn("border px-3.5 py-2 text-[0.8rem] font-medium [border-radius:var(--rb)]", form.time === t ? "[background:var(--a)] [border-color:var(--a)] [color:var(--on)]" : "[border-color:var(--ln)] [color:var(--mu)]")}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!sector.people && sector.id === "clinica" && (
                    <label className="flex cursor-pointer items-center gap-2.5 text-[0.86rem] sm:col-span-2">
                      <input type="checkbox" checked={form.urgent} onChange={(e) => setForm((f) => ({ ...f, urgent: e.target.checked }))} className="h-4 w-4" style={{ accentColor: "var(--a)" }} />
                      Tengo dolor o es una urgencia
                    </label>
                  )}

                  <div className="sm:col-span-2">
                    <Field label="Notas (opcional)">
                      <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className={cn(inputCls, "resize-none")} placeholder="Alergias, cumpleaños, lo que quieras contarnos…" />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-start gap-2.5 text-[0.8rem] leading-relaxed [color:var(--mu)]">
                      <input type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} className="mt-0.5 h-4 w-4 shrink-0" style={{ accentColor: "var(--a)" }} />
                      Acepto que usen estos datos solo para gestionar mi solicitud (RGPD).
                    </label>
                    {errors.consent && <p className="mt-1.5 text-[0.76rem] [color:#ef5a4c]">{errors.consent}</p>}
                  </div>

                  <button type="submit" className="px-7 py-3 text-[0.92rem] font-semibold sm:col-span-2 sm:justify-self-start [background:var(--a)] [color:var(--on)] [border-radius:var(--rb)]">
                    {sector.submit}
                  </button>
                </form>
              )}
            </section>

            {/* Información */}
            <section id="wd-info" className="px-4 py-12 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {sector.info.map((i) => (
                  <div key={i.k} className="border p-5 [background:var(--card)] [border-color:var(--ln)] [border-radius:var(--r)]">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] [color:var(--at)]">{i.k}</p>
                    <p className="mt-2 text-[0.9rem] leading-snug">{i.v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-[0.74rem] [color:var(--mu)]">© {new Date().getFullYear()} {sector.name} · web de ejemplo ficticia · diseñada por Joel</p>
            </section>
          </div>

          {/* Asistente */}
          <div className="pointer-events-none absolute bottom-5 right-5 z-20 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8" style={theme}>
            {chat && (
              <div
                className="pop pointer-events-auto flex max-h-[min(24rem,60vh)] w-[min(20rem,calc(100vw-3rem))] flex-col overflow-hidden border shadow-2xl [background:var(--card)] [border-color:var(--ln)] [border-radius:var(--r)]"
                style={{ background: "var(--card)", color: "var(--fg)" }}
              >
                <div className="flex items-center justify-between px-4 py-3 text-[0.85rem] font-bold [background:var(--a)] [color:var(--on)]">
                  Asistente de {sector.name}
                  <button onClick={() => setChat(false)} aria-label="Cerrar el asistente">
                    <IClose className="h-4 w-4" />
                  </button>
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3.5 text-[0.84rem]">
                  <p className="border px-3 py-2 leading-relaxed [border-color:var(--ln)] [border-radius:var(--r)]">Hola, soy el asistente. ¿Qué quieres saber?</p>
                  {qa.map((x) => (
                    <div key={x.q} className="space-y-2">
                      <p className="ml-auto w-fit max-w-[85%] px-3 py-2 font-medium [background:var(--a)] [color:var(--on)] [border-radius:var(--r)]">{x.q}</p>
                      <p className="border px-3 py-2 leading-relaxed [border-color:var(--ln)] [border-radius:var(--r)]">{x.a}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 border-t p-3 [border-color:var(--ln)]">
                  {sector.faq.map((q) => (
                    <button key={q.q} onClick={() => ask(q)} className="border px-3 py-1.5 text-[0.74rem] font-medium [border-color:var(--a)] [border-radius:var(--rb)] [color:var(--at)]">
                      {q.q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setChat((c) => !c)}
              aria-label="Abrir el asistente de la web"
              aria-expanded={chat}
              className="pointer-events-auto grid h-14 w-14 place-items-center rounded-full shadow-xl [background:var(--a)] [color:var(--on)]"
            >
              {chat ? <IClose className="h-6 w-6" /> : <IChat className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Piezas del panel y del formulario ── */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-colors",
        on ? "border-lime bg-lime font-semibold text-ink" : "border-white/15 text-soft hover:border-lime/50 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.14em] [color:var(--mu)]">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[0.76rem] [color:#ef5a4c]">{error}</span>}
    </label>
  );
}
