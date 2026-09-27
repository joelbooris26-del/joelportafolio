import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import {
  busySlots,
  hours,
  menu,
  restaurant,
  tastingMenu,
  timeSlots,
  zones,
} from "@/data/restaurant";
import { ArrowUpRight, Calendar, Check, Chef, Clock, Mail, Phone, Pin, Star, Users } from "../icons";

export const fmtPrice = (p: string) => (p.includes("/") ? p.replace("/", "€ /") : `${p} €`);

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

/* ══════════════════ CARTA ══════════════════ */
export function Carta({ onReserve }: { onReserve: (note: string) => void }) {
  const [active, setActive] = useState(menu[0].id);
  const section = menu.find((m) => m.id === active)!;
  const withPhotos = section.dishes.some((d) => d.img);

  return (
    <section
      id="r-carta"
      className="scroll-mt-24 border-t border-white/10 bg-black px-5 py-16 sm:px-10 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-zinc-400">
              La carta
            </p>
            <h2 className="mt-3 font-chef text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-white">
              Producto de la bahía,
              <br />
              brasa de encina
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
            Carta de temporada. Compramos cada mañana en la lonja, así que algunos platos cambian
            según lo que traiga el mar.
          </p>
        </div>

        {/* Pestañas de cristal */}
        <div className="swipe-wrap mt-10 rounded-full">
        <div className="glass swipe-x flex gap-2 rounded-full p-1.5">
          {menu.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-all duration-300",
                active === m.id
                  ? "glass-pill-active"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        </div>

        {section.note && (
          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-zinc-500">
            {section.note}
          </p>
        )}

        {/* Platos */}
        <div className={cn("mt-6 grid gap-5", withPhotos ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1")}>
          {section.dishes.map((d) =>
            d.img ? (
              <article
                key={d.name}
                className="glass-card group flex flex-col overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1.5"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-black">
                  <img
                    src={d.img}
                    alt={d.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-[20%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.08] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {d.star && (
                    <span className="glass absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-white">
                      <Star className="h-2.5 w-2.5 text-white" /> Especialidad
                    </span>
                  )}
                  <span className="glass-btn absolute bottom-3 right-3 rounded-lg px-2.5 py-1 font-mono text-[0.7rem] font-bold text-white">
                    {fmtPrice(d.price)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-chef text-[1.12rem] font-semibold leading-snug text-white">
                    {d.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.86rem] leading-relaxed text-zinc-400">{d.desc}</p>
                  {d.tags && (
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {d.tags.map((t) => (
                        <span
                          key={t}
                          className="glass rounded-full px-2.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-zinc-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ) : withPhotos ? (
              <article
                key={d.name}
                className="glass-card group flex flex-col overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1.5"
              >
                <div className="glass relative grid aspect-[5/4] place-items-center">
                  <Chef className="relative h-11 w-11 text-zinc-600 transition-all duration-500 group-hover:scale-110 group-hover:text-white" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-chef text-[1.12rem] font-semibold leading-snug text-white">
                    {d.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.86rem] leading-relaxed text-zinc-400">{d.desc}</p>
                  <span className="mt-3.5 font-mono text-[0.78rem] font-bold text-white">
                    {fmtPrice(d.price)}
                  </span>
                </div>
              </article>
            ) : (
              <div
                key={d.name}
                className="group flex items-baseline gap-4 border-b border-dashed border-white/10 py-4 transition-colors first:border-t hover:border-white/40"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-chef text-[1.08rem] font-semibold text-white transition-colors group-hover:text-zinc-300">
                    {d.name}
                  </h3>
                  <p className="mt-1 text-[0.84rem] leading-relaxed text-zinc-400">{d.desc}</p>
                </div>
                <span className="shrink-0 font-mono text-[0.82rem] font-bold text-white">
                  {fmtPrice(d.price)}
                </span>
              </div>
            ),
          )}
        </div>

        {/* Menú degustación */}
        <div className="glass-card relative mt-14 overflow-hidden rounded-3xl p-8 text-zinc-200 sm:p-10">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-[0.12]" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-zinc-300">
                <Chef className="h-3.5 w-3.5 text-white" /> Solo con reserva
              </span>
              <h3 className="mt-4 font-chef text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight text-white">
                {tastingMenu.name}
              </h3>
              <p className="mt-3 font-mono text-lg text-white font-bold">{tastingMenu.price}</p>
              <p className="mt-1 text-sm text-zinc-400">{tastingMenu.maridaje}</p>
              <button
                onClick={() => onReserve(tastingMenu.name)}
                className="glass-btn-primary group mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black"
              >
                Reservar el menú
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <ol className="lg:col-span-7">
              {tastingMenu.steps.map((s, i) => (
                <li
                  key={s}
                  className="flex items-baseline gap-4 border-b border-white/10 py-3 last:border-0"
                >
                  <span className="font-mono text-[0.62rem] text-zinc-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-chef text-[1.02rem] text-zinc-200">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ RESERVAS ══════════════════ */
export type Prefill = { guests?: number; date?: string; note?: string; token: number };

type Errors = Partial<Record<"nombre" | "telefono" | "fecha" | "hora" | "email", string>>;

export function Reservas({ prefill }: { prefill: Prefill | null }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fecha, setFecha] = useState(todayISO());
  const [hora, setHora] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [zona, setZona] = useState(zones[1]);
  const [notas, setNotas] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<null | { code: string }>(null);

  const lastToken = prefill?.token ?? 0;

  useEffect(() => {
    if (!prefill) return;
    if (prefill.guests) setGuests(prefill.guests);
    if (prefill.date) setFecha(prefill.date);
    if (prefill.note) setNotas(`Reserva: ${prefill.note}`);
    setDone(null);
    setErrors({});
  }, [lastToken, prefill]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (nombre.trim().length < 2) e.nombre = "Dinos tu nombre para la lista.";
    const digits = telefono.replace(/\D/g, "");
    if (digits.length < 9) e.telefono = "Necesitamos un teléfono de contacto válido.";
    if (!fecha) e.fecha = "Elige el día.";
    else if (fecha < todayISO()) e.fecha = "Esa fecha ya pasó.";
    if (!hora) e.hora = "Elige una hora disponible.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Revisa el email.";
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setDone({ code: `MA-${Math.floor(1000 + Math.random() * 9000)}` });
  };

  const reset = () => {
    setDone(null);
    setNombre("");
    setTelefono("");
    setEmail("");
    setFecha(todayISO());
    setHora(null);
    setGuests(2);
    setNotas("");
    setErrors({});
  };

  const fechaBonita = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <section
      id="r-reservas"
      className="scroll-mt-24 border-t border-white/10 bg-black px-5 py-16 sm:px-10 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-zinc-400">
            Reservas
          </p>
          <h2 className="mt-3 font-chef text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-white">
            Guarda tu mesa
            <br />
            en veinte segundos
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400">
            Confirmación inmediata por SMS y email. Guardamos la mesa 15 minutos; después se libera
            para la lista de espera.
          </p>

          {done ? (
            <div className="glass-card anim-pop mt-9 overflow-hidden rounded-2xl">
              <div className="glass flex items-center gap-3 p-4">
                <span className="glass-btn-primary grid h-9 w-9 place-items-center rounded-full">
                  <Check className="h-5 w-5 text-black" strokeWidth={2.4} />
                </span>
                <div>
                  <p className="font-chef text-lg font-semibold text-white">Mesa confirmada</p>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-400">
                    Localizador {done.code}
                  </p>
                </div>
              </div>
              <dl className="glass grid gap-px sm:grid-cols-2">
                {[
                  { k: "A nombre de", v: nombre },
                  { k: "Día", v: fechaBonita(fecha) },
                  { k: "Hora", v: hora ?? "—" },
                  { k: "Comensales", v: `${guests} ${guests === 1 ? "persona" : "personas"}` },
                  { k: "Zona", v: zona },
                  { k: "Contacto", v: telefono },
                ].map((r) => (
                  <div key={r.k} className="bg-black/40 p-4">
                    <dt className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-zinc-500">
                      {r.k}
                    </dt>
                    <dd className="mt-1 text-[0.95rem] font-medium capitalize text-white">{r.v}</dd>
                  </div>
                ))}
              </dl>
              {notas && (
                <p className="border-t border-white/10 p-4 text-sm text-zinc-300">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-zinc-500">
                    Notas para el equipo ·{" "}
                  </span>
                  {notas}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 p-4">
                <button
                  onClick={reset}
                  className="glass-btn-primary rounded-full px-5 py-2.5 text-sm font-semibold text-black"
                >
                  Hacer otra reserva
                </button>
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-zinc-500">
                  demo · no se envía ningún dato real
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-9 space-y-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nombre y apellidos" error={errors.nombre}>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="María González"
                    className={inputCls(!!errors.nombre)}
                  />
                </Field>
                <Field label="Teléfono" error={errors.telefono}>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+34 600 000 000"
                    inputMode="tel"
                    className={inputCls(!!errors.telefono)}
                  />
                </Field>
              </div>

              <Field label="Email (opcional)" error={errors.email}>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@correo.com"
                  className={inputCls(!!errors.email)}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Día" error={errors.fecha}>
                  <input
                    type="date"
                    min={todayISO()}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className={inputCls(!!errors.fecha)}
                  />
                </Field>
                <Field label="Comensales">
                  <div className="flex items-center gap-3">
                    <Stepper
                      label="Quitar comensal"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                    >
                      –
                    </Stepper>
                    <span className="glass flex-1 rounded-xl py-2.5 text-center font-mono text-sm text-white">
                      {guests} {guests === 1 ? "persona" : "personas"}
                    </span>
                    <Stepper
                      label="Añadir comensal"
                      onClick={() => setGuests((g) => Math.min(12, g + 1))}
                      disabled={guests >= 12}
                    >
                      +
                    </Stepper>
                  </div>
                </Field>
              </div>

              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-400">
                  Hora {errors.hora && <span className="text-zinc-300">· {errors.hora}</span>}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {timeSlots.map((t) => {
                    const busy = busySlots.includes(t);
                    const on = hora === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={busy}
                        onClick={() => setHora(t)}
                        title={busy ? "Completo" : undefined}
                        className={cn(
                          "glass-btn rounded-xl py-2.5 font-mono text-[0.78rem]",
                          busy && "cursor-not-allowed opacity-25 line-through hover:bg-transparent",
                          on && "glass-pill-active",
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-zinc-500">
                  Horas tachadas: completo · 2 mesas en lista de espera a las 14:30
                </p>
              </div>

              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-400">
                  Zona
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {zones.map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZona(z)}
                      className={cn(
                        "glass-btn rounded-full px-4 py-2 text-[0.82rem]",
                        zona === z && "glass-pill-active",
                      )}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Notas para el equipo (opcional)">
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                  placeholder="Cumpleaños, alergias, trona para el pequeño…"
                  className={cn(inputCls(false), "resize-none")}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="glass-btn-primary group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold text-black"
                >
                  Confirmar reserva
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-zinc-500">
                  o llama al {restaurant.phone}
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Lateral */}
        <aside className="lg:col-span-5">
          <div className="glass-card rounded-2xl p-7">
            <h3 className="flex items-center gap-2 font-chef text-xl font-semibold text-white">
              <Clock className="h-5 w-5 text-white" /> Horario
            </h3>
            <ul className="mt-5 space-y-3">
              {hours.map((h) => (
                <li key={h.day} className="flex items-baseline justify-between gap-4 text-sm">
                  <span className={cn(h.closed ? "text-zinc-500" : "text-zinc-300")}>{h.day}</span>
                  <span
                    className={cn(
                      "text-right font-mono text-[0.72rem]",
                      h.closed ? "text-zinc-500" : "text-white font-bold",
                    )}
                  >
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
              <a
                href={restaurant.phoneHref}
                className="group flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-white transition-colors" />
                {restaurant.phone}
              </a>
              <a
                href={`mailto:${restaurant.email}`}
                className="group flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-white transition-colors" />
                {restaurant.email}
              </a>
            </div>
          </div>

          <div className="glass-card mt-5 rounded-2xl p-7 text-zinc-200">
            <h3 className="flex items-center gap-2 font-chef text-xl font-semibold text-white">
              <Users className="h-5 w-5 text-white" /> Grupos y celebraciones
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Hasta 40 personas en sala interior y menús cerrados desde 38 € por persona. Para más de
              8 comensales escríbenos y te preparamos una propuesta en 24 horas.
            </p>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-zinc-500">
              <p>· Cancelación gratuita hasta 4 h antes</p>
              <p>· Adaptamos menús sin gluten y sin lactosa</p>
              <p>· Terraza cubierta y climatizada todo el año</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

const inputCls = (error: boolean) =>
  cn(
    "glass-input w-full rounded-xl p-3.5 text-[0.92rem] text-white outline-none placeholder:text-zinc-500",
    error && "border-white/50 ring-2 ring-white/20",
  );

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
      {error && (
        <span className="mt-1.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-zinc-300">
          {error}
        </span>
      )}
    </label>
  );
}

function Stepper({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="glass-btn grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-lg text-white disabled:opacity-20"
    >
      {children}
    </button>
  );
}

/* ══════════════════ UBICACIÓN ══════════════════ */
export function Ubicacion() {
  return (
    <section
      id="r-ubicacion"
      className="scroll-mt-24 border-t border-white/10 bg-black px-5 py-16 sm:px-10 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-zinc-400">
              Dónde estamos
            </p>
            <h2 className="mt-3 font-chef text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-white">
              Primera línea de playa
            </h2>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${restaurant.mapsQuery}`}
            target="_blank"
            rel="noreferrer"
            className="glass-btn group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white"
          >
            Abrir en Google Maps
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Mapa dibujado monocromático */}
          <div className="lg:col-span-7">
            <div className="glass-card relative overflow-hidden rounded-2xl">
              <svg viewBox="0 0 800 520" className="h-full w-full" role="img" aria-label="Mapa de la ubicación del restaurante">
                <rect width="800" height="520" fill="#090909" />
                {/* mar */}
                <path d="M0 0h800v190c-120 26-230-14-350 6S200 250 60 232 0 240 0 240Z" fill="#141414" />
                <path d="M0 196c120 24 240-16 360 4s240 44 440 6" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" fill="none" />
                <path d="M0 214c140 22 250-14 370 6s250 40 430 4" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" fill="none" />
                {/* arena */}
                <path d="M0 236c140 18 210-24 350-4s230 40 450-6v34H0Z" fill="#1c1c1c" />
                {/* manzanas */}
                {[
                  [40, 300, 180, 80],
                  [250, 300, 150, 80],
                  [430, 300, 160, 80],
                  [620, 300, 140, 80],
                  [40, 420, 220, 70],
                  [300, 420, 190, 70],
                  [520, 420, 240, 70],
                ].map(([x, y, w, h], i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#181818" stroke="#2a2a2a" />
                ))}
                {/* calles */}
                <path d="M0 288h800M0 402h800M230 250v270M410 250v270M600 250v270" stroke="#000000" strokeWidth="16" />
                <path d="M0 288h800M0 402h800M230 250v270M410 250v270M600 250v270" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="10 12" />
                {/* etiquetas */}
                <text x="24" y="150" fill="#ffffff" fontSize="17" fontFamily="IBM Plex Mono, monospace" letterSpacing="3" opacity="0.6">
                  MAR MEDITERRÁNEO
                </text>
                <text x="24" y="264" fill="#a0a0a0" fontSize="13" fontFamily="IBM Plex Mono, monospace" letterSpacing="2">
                  PLAYA DE LEVANTE
                </text>
                <text x="424" y="284" fill="#888888" fontSize="13" fontFamily="IBM Plex Mono, monospace" letterSpacing="2">
                  PASEO MARÍTIMO
                </text>
                <text x="620" y="462" fill="#888888" fontSize="13" fontFamily="IBM Plex Mono, monospace" letterSpacing="2">
                  PARKING P2
                </text>
                {/* pin */}
                <g transform="translate(400 330)">
                  <circle r="46" fill="#ffffff" opacity="0.12">
                    <animate attributeName="r" values="30;58;30" dur="3.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="3.2s" repeatCount="indefinite" />
                  </circle>
                  <path
                    d="M0 12c0 0 16-14 16-26A16 16 0 1 0-16-14C-16-2 0 12 0 12Z"
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="-14" r="5.5" fill="#000000" />
                </g>
                <text x="428" y="342" fill="#ffffff" fontSize="16" fontWeight="600" fontFamily="Fraunces, serif">
                  Marea Alta
                </text>
                {/* brújula */}
                <g transform="translate(740 60)" opacity="0.5">
                  <circle r="22" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                  <path d="M0-16 5 0 0 16-5 0Z" fill="#ffffff" />
                  <text x="-4" y="-26" fill="#ffffff" fontSize="11" fontFamily="IBM Plex Mono, monospace">
                    N
                  </text>
                </g>
              </svg>
            </div>
            <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-500">
              Mapa ilustrativo · demo
            </p>
          </div>

          {/* Datos */}
          <div className="space-y-5 lg:col-span-5">
            <div className="glass-card rounded-2xl p-7">
              <Pin className="h-6 w-6 text-white" />
              <p className="mt-4 font-chef text-2xl font-semibold leading-tight text-white">
                {restaurant.address}
              </p>
              <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-zinc-400">
                {restaurant.zip}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-sm text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-white">·</span> Aparcamiento público P2 a 150 m (2 €/hora)
                </li>
                <li className="flex gap-3">
                  <span className="text-white">·</span> Parada de autobús urbano en la puerta
                </li>
                <li className="flex gap-3">
                  <span className="text-white">·</span> Acceso adaptado y terraza a pie de calle
                </li>
                <li className="flex gap-3">
                  <span className="text-white">·</span> A 8 min en coche de la frontera con Gibraltar
                </li>
              </ul>
            </div>

            <div className="glass overflow-hidden rounded-2xl">
              <img
                src={restaurant.interiorImage}
                alt="Interior del restaurante Marea Alta"
                loading="lazy"
                className="h-56 w-full object-cover grayscale-[15%] transition-transform duration-[1200ms] hover:scale-105 hover:grayscale-0"
              />
            </div>

            <div className="glass-card rounded-2xl p-7 text-zinc-200">
              <Calendar className="h-6 w-6 text-white" />
              <p className="mt-4 font-chef text-xl font-semibold text-white">Horario de esta semana</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex justify-between gap-4 border-b border-white/10 pb-2 last:border-0"
                  >
                    <span className="text-zinc-400">{h.day}</span>
                    <span
                      className={cn(
                        "font-mono text-[0.7rem]",
                        h.closed ? "text-zinc-500" : "text-white font-bold",
                      )}
                    >
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ CONTACTO ══════════════════ */
const asuntos = ["Reservas", "Eventos y grupos", "Trabaja con nosotros", "Prensa", "Otra consulta"];

export function Contacto() {
  const [sent, setSent] = useState(false);
  const [asunto, setAsunto] = useState(asuntos[0]);
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim().length < 2 || msg.trim().length < 5) {
      setError(true);
      return;
    }
    setError(false);
    setSent(true);
  };

  return (
    <section
      id="r-contacto"
      className="scroll-mt-24 border-t border-white/10 bg-black px-5 py-16 sm:px-10 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-zinc-400">
            Contacto
          </p>
          <h2 className="mt-3 font-chef text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-white">
            Escríbenos y te contestamos hoy
          </h2>

          {sent ? (
            <div className="glass-card anim-pop mt-8 rounded-2xl p-8">
              <span className="glass-btn-primary grid h-11 w-11 place-items-center rounded-full">
                <Check className="h-6 w-6 text-black" strokeWidth={2.4} />
              </span>
              <p className="mt-5 font-chef text-2xl font-semibold text-white">
                Mensaje enviado, {nombre.split(" ")[0]}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                El equipo de sala lo recibe al instante y te responderá a {mail || "tu correo"} en
                menos de 2 horas dentro del horario de apertura.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setNombre("");
                  setMail("");
                  setMsg("");
                }}
                className="glass-btn mt-6 rounded-full px-5 py-2.5 text-sm font-medium"
              >
                Escribir otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nombre">
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className={inputCls(error && nombre.trim().length < 2)}
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    placeholder="tu@correo.com"
                    className={inputCls(false)}
                  />
                </Field>
              </div>
              <div>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-400">
                  Asunto
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {asuntos.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAsunto(a)}
                      className={cn(
                        "glass-btn rounded-full px-3.5 py-1.5 text-[0.8rem]",
                        asunto === a && "glass-pill-active",
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="Mensaje"
                error={error && msg.trim().length < 5 ? "Cuéntanos algo más, por favor." : undefined}
              >
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={4}
                  placeholder="Hola, quería preguntar por…"
                  className={cn(inputCls(error && msg.trim().length < 5), "resize-none")}
                />
              </Field>
              <button
                type="submit"
                className="glass-btn-primary group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold text-black"
              >
                Enviar mensaje
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4 lg:col-span-6">
          {[
            {
              icon: Phone,
              k: "Teléfono",
              v: restaurant.phone,
              href: restaurant.phoneHref,
              note: "De martes a domingo, en horario de servicio",
            },
            {
              icon: Mail,
              k: "Email",
              v: restaurant.email,
              href: `mailto:${restaurant.email}`,
              note: "Respondemos en menos de 24 h",
            },
            {
              icon: Pin,
              k: "Dirección",
              v: restaurant.address,
              href: `https://www.google.com/maps/search/?api=1&query=${restaurant.mapsQuery}`,
              note: restaurant.zip,
            },
            {
              icon: Star,
              k: "Instagram",
              v: restaurant.instagram,
              href: "https://www.instagram.com/",
              note: "El plato del día, cada mañana en historias",
            },
          ].map(({ icon: Icon, k, v, href, note }) => (
            <a
              key={k}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="glass-card group flex items-center gap-5 rounded-2xl p-6 transition-all duration-400 hover:-translate-y-0.5"
            >
              <span className="glass grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white transition-colors group-hover:bg-white group-hover:text-black">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-500">
                  {k}
                </span>
                <span className="mt-1 block truncate font-chef text-[1.15rem] font-semibold text-white">
                  {v}
                </span>
                <span className="mt-0.5 block text-[0.8rem] text-zinc-400">{note}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </a>
          ))}

          <div className="glass rounded-2xl p-6">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-400">
              Aviso de la demo
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Este restaurante es ficticio: lo he inventado y construido de cero para que puedas
              probar cómo sería una web real —carta, reservas, ubicación, contacto y asistente— sin
              que se envíe ningún dato a ningún sitio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
