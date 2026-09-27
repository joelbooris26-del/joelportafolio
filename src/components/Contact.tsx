import { useState } from "react";
import { cn } from "@/utils/cn";
import { getAge, profile } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./About";
import { ArrowRight, ArrowUpRight, Check, Copy, Mail, Pin, Send } from "./icons";

const temas = [
  "Web a medida",
  "Chatbot para mi negocio",
  "Agente de llamadas",
  "Atención al cliente",
  "Reserva de citas",
  "App móvil (próximamente)",
  "Otra idea",
];

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", tema: temas[0], msg: "" });
  const [error, setError] = useState<string | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      /* portapapeles no disponible */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nombre.trim().length < 2) {
      setError("Dime tu nombre para saber a quién responder.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Escribe un email válido para que pueda responderte.");
      return;
    }
    if (form.msg.trim().length < 10) {
      setError("Cuéntame un poco más sobre tu proyecto.");
      return;
    }

    setError(null);
    setSending(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Nuevo proyecto: ${form.tema} — ${form.nombre.trim()}`,
          _template: "table",
          _captcha: "false",
          Nombre: form.nombre.trim(),
          "Email de contacto": form.email.trim(),
          "Tipo de proyecto": form.tema,
          Mensaje: form.msg.trim(),
          Origen: "Formulario del portafolio de Joel",
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === "false" || result?.success === false) {
        throw new Error("No se pudo completar el envío");
      }

      setSent(true);
      setForm({ nombre: "", email: "", tema: temas[0], msg: "" });
    } catch {
      setError(
        `No he podido enviar el mensaje ahora mismo. Escríbeme directamente a ${profile.email}.`,
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section id="contacto" className="noise-layer relative overflow-hidden bg-black py-24 sm:py-32">
        <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-40" />
        <div className="anim-float pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_65%)] blur-3xl" />
        <div
          className="anim-float pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)] blur-3xl"
          style={{ animationDelay: "-4s" }}
        />

        <div className="relative mx-auto max-w-[86rem] px-5 sm:px-8">
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-6">
              <Reveal>
                <SectionEyebrow n="07" label="Contacto" />
                <h2 className="mt-6 font-display text-[clamp(2.25rem,10vw,5rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-white">
                  ¿Tienes un negocio?
                  <br />
                  <span className="swash text-zinc-400">Pongámoslo a trabajar.</span>
                </h2>
                <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-zinc-400 sm:mt-6 sm:text-[1.05rem]">
                  Cuéntame qué te quita tiempo cada semana: las llamadas que no puedes coger, los
                  mensajes sin responder, las reservas que se pierden. Te contesto con una idea clara
                  de qué se puede automatizar y una demo que puedas tocar.
                </p>
              </Reveal>

              <Reveal delay={100} className="mt-10 space-y-3">
                <button
                  onClick={copy}
                  className="glass-btn group flex w-full items-center gap-4 rounded-2xl p-4 text-left"
                >
                  <Mail className="h-5 w-5 shrink-0 text-white" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.56rem] uppercase tracking-[0.2em] text-zinc-400">
                      Email · toca para copiar
                    </span>
                    <span className="mt-0.5 block truncate font-display text-lg font-bold tracking-tight text-white">
                      {profile.email}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[0.56rem] uppercase tracking-[0.14em] transition-colors",
                      copied ? "text-white font-bold" : "text-zinc-500 group-hover:text-white",
                    )}
                  >
                    {copied ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.6} /> copiado
                      </span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </span>
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="glass rounded-2xl p-5">
                    <p className="flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-zinc-400">
                      <Pin className="h-3.5 w-3.5 text-white" /> Dónde estoy
                    </p>
                    <p className="mt-2 text-[0.9rem] leading-snug text-white sm:text-[0.95rem]">
                      {profile.city}
                      <br />
                      {profile.region}, {profile.country}
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <p className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-zinc-400">
                      Respuesta
                    </p>
                    <p className="mt-2 text-[0.95rem] leading-snug text-white">
                      Menos de 24 h
                      <br />
                      <span className="text-zinc-400">Proyectos abiertos a toda España</span>
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-6">
              <Reveal delay={140}>
                <div className="glass-card rounded-2xl p-6 sm:p-8">
                  {sent ? (
                    <div className="anim-pop py-8 text-center">
                      <span className="glass-btn-primary mx-auto grid h-14 w-14 place-items-center rounded-full">
                        <Check className="h-7 w-7 text-black" strokeWidth={2.6} />
                      </span>
                      <p className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white">
                        Mensaje enviado
                      </p>
                      <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-zinc-400">
                        La información de tu proyecto ha llegado directamente a{" "}
                        <span className="text-white font-medium">{profile.email}</span>. Te responderé
                        en menos de 24 horas.
                      </p>
                      <button
                        onClick={() => setSent(false)}
                        className="glass-btn mt-7 rounded-full px-5 py-2.5 text-sm"
                      >
                        Escribir otro mensaje
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submit} noValidate className="space-y-5">
                      <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-zinc-400">
                        Cuéntame tu proyecto
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-zinc-400">
                            Nombre
                          </span>
                          <input
                            type="text"
                            required
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            placeholder="Tu nombre"
                            className={fieldCls}
                          />
                        </label>
                        <label className="block">
                          <span className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-zinc-400">
                            Email
                          </span>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="tu@correo.com"
                            className={fieldCls}
                          />
                        </label>
                      </div>

                      <div>
                        <span className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-zinc-400">
                          ¿Qué necesitas?
                        </span>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {temas.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setForm({ ...form, tema: t })}
                              className={cn(
                                "glass-btn rounded-full px-3.5 py-1.5 text-[0.8rem]",
                                form.tema === t && "glass-pill-active",
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="block">
                        <span className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-zinc-400">
                          Mensaje
                        </span>
                        <textarea
                          required
                          minLength={10}
                          value={form.msg}
                          onChange={(e) => setForm({ ...form, msg: e.target.value })}
                          rows={4}
                          placeholder="Tengo un negocio en Cádiz y pierdo llamadas los fines de semana…"
                          className={cn(fieldCls, "resize-none")}
                        />
                      </label>

                      {error && (
                        <p className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-zinc-300">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={sending}
                        className="glass-btn-primary group inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-bold text-black disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                      >
                        {sending ? "Enviando..." : "Enviar mensaje"}
                        {sending ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/25 border-t-black" />
                        ) : (
                          <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        )}
                      </button>
                      <p className="font-mono text-[0.52rem] uppercase leading-relaxed tracking-[0.12em] text-zinc-600">
                        El mensaje se envía directamente a mi Gmail · no se publican tus datos
                      </p>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 bg-black px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[86rem] flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="glass grid h-11 w-11 place-items-center rounded-xl font-display text-sm font-bold text-white">
              JM
            </span>
            <div>
              <p className="font-display text-[1.05rem] font-bold tracking-tight text-white">
                {profile.alias} · {profile.fullName}
              </p>
              <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-400">
                {profile.role} · {getAge()} años · {profile.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="#top"
              className="glass-btn group inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-zinc-300 hover:text-white"
            >
              Volver arriba
              <ArrowRight className="h-3.5 w-3.5 -rotate-90 transition-transform group-hover:-translate-y-0.5" />
            </a>
            <span className="h-4 w-px bg-white/10" />
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-zinc-500">
              © {new Date().getFullYear()} · webs, automatización y pronto apps
            </p>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[86rem] font-mono text-[0.54rem] uppercase leading-relaxed tracking-[0.14em] text-zinc-600">
          Los ejemplos de esta página (el restaurante, los chats, las llamadas y las agendas) son
          negocios y datos ficticios, creados solo para demostrar el trabajo. Nada de lo que
          escribas aquí sale de tu navegador.
          <a
            href="#web"
            className="ml-2 inline-flex items-center gap-1 text-zinc-300 transition-colors hover:text-white"
          >
            Ver proyectos <ArrowUpRight className="h-3 w-3" />
          </a>
        </p>
      </footer>
    </>
  );
}

const fieldCls =
  "glass-input mt-2 w-full rounded-xl p-3.5 text-[0.92rem] text-white outline-none placeholder:text-zinc-500";
