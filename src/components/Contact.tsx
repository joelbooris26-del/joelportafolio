import { useState } from "react";
import { cn } from "@/utils/cn";
import { getAge, profile } from "@/data/content";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Eyebrow,
  Magnetic,
  Pin,
  Reveal,
  Send,
} from "./ui";

const temas = [
  "Web a medida",
  "Chatbot o agente de voz",
  "Automatización",
  "App móvil",
  "Otra idea",
];

const fieldCls =
  "mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] p-3.5 text-[0.95rem] text-white outline-none transition-colors placeholder:text-mute focus:border-lime/70 focus:bg-lime/[0.04]";

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
    if (form.nombre.trim().length < 2) return setError("Dime tu nombre para saber a quién responder.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Escribe un email válido para que pueda responderte.");
    if (form.msg.trim().length < 10) return setError("Cuéntame un poco más sobre tu idea.");

    setError(null);
    setSending(true);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Nuevo mensaje: ${form.tema} — ${form.nombre.trim()}`,
          _template: "table",
          _captcha: "false",
          Nombre: form.nombre.trim(),
          "Email de contacto": form.email.trim(),
          "Tipo de proyecto": form.tema,
          Mensaje: form.msg.trim(),
          Origen: "Portafolio de Joel",
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === "false" || result?.success === false) {
        throw new Error("envío fallido");
      }
      setSent(true);
      setForm({ nombre: "", email: "", tema: temas[0], msg: "" });
    } catch {
      setError(`No he podido enviar el mensaje ahora mismo. Escríbeme directamente a ${profile.email}.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section id="contacto" className="noise relative overflow-hidden bg-panel/40 py-24 sm:py-32">
        <div className="grid-bg fade-b pointer-events-none absolute inset-0 opacity-50" />
        <div className="drift pointer-events-none absolute -right-24 top-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(200,255,62,0.10),transparent_65%)] blur-3xl" />

        <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8">
          <Reveal>
            <Eyebrow n="06" label="Contacto" />
            <h2 className="mt-6 font-display text-[clamp(2.6rem,9vw,7.6rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-white">
              ¿Hacemos algo
              <br />
              <span className="text-gradient">juntos?</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="max-w-lg text-[1.05rem] leading-relaxed text-soft">
                  Cuéntame qué tienes en la cabeza: una web, un asistente que atienda por ti, algo que
                  automatizar o una idea de app. Te respondo con una propuesta clara y, si se puede,
                  con algo que puedas probar.
                </p>
              </Reveal>

              <Reveal delay={100} className="mt-9 space-y-3">
                <Magnetic strength={0.12} className="block">
                  <button
                    onClick={copy}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.03] p-5 text-left transition-colors hover:border-lime/60 hover:bg-lime/[0.05]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[0.6rem] uppercase tracking-[0.22em] text-mute">
                        Email · toca para copiar
                      </span>
                      <span className="mt-1 block truncate font-display text-[1.05rem] font-semibold tracking-tight text-white sm:text-[1.25rem]">
                        {profile.email}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all",
                        copied
                          ? "border-lime bg-lime text-ink"
                          : "border-white/15 text-soft group-hover:border-lime/60 group-hover:text-lime",
                      )}
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </span>
                  </button>
                </Magnetic>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="panel rounded-2xl p-5">
                    <p className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">
                      <Pin className="h-3.5 w-3.5 text-lime" /> Dónde estoy
                    </p>
                    <p className="mt-2 text-[0.95rem] leading-snug text-white">
                      {profile.city}
                      <br />
                      {profile.region}, {profile.country}
                    </p>
                  </div>
                  <div className="panel rounded-2xl p-5">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">Respuesta</p>
                    <p className="mt-2 text-[0.95rem] leading-snug text-white">
                      Menos de 24 h
                      <br />
                      <span className="text-mute">Trabajo en remoto, en toda España</span>
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={140}>
                <div className="panel rounded-[2rem] p-6 sm:p-9">
                  {sent ? (
                    <div className="pop py-10 text-center">
                      <span className="btn-lime mx-auto grid h-16 w-16 place-items-center !rounded-full">
                        <Check className="h-8 w-8" />
                      </span>
                      <p className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white">
                        Mensaje enviado
                      </p>
                      <p className="mx-auto mt-3 max-w-sm text-[0.97rem] leading-relaxed text-soft">
                        Ha llegado directamente a <span className="font-medium text-white">{profile.email}</span>.
                        Te respondo en menos de 24 horas.
                      </p>
                      <button onClick={() => setSent(false)} className="btn-ghost mt-7 px-5 py-2.5 text-sm">
                        Escribir otro mensaje
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submit} noValidate className="space-y-5">
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-lime">
                        Cuéntame tu idea
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">Nombre</span>
                          <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            placeholder="Tu nombre"
                            className={fieldCls}
                          />
                        </label>
                        <label className="block">
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">Email</span>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="tu@correo.com"
                            className={fieldCls}
                          />
                        </label>
                      </div>

                      <div>
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">
                          ¿Qué necesitas?
                        </span>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {temas.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setForm({ ...form, tema: t })}
                              className={cn(
                                "rounded-full border px-4 py-2 text-[0.84rem] transition-all",
                                form.tema === t
                                  ? "border-lime bg-lime text-ink font-semibold"
                                  : "border-white/15 text-soft hover:border-lime/50 hover:text-white",
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="block">
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">Mensaje</span>
                        <textarea
                          value={form.msg}
                          onChange={(e) => setForm({ ...form, msg: e.target.value })}
                          rows={4}
                          placeholder="Tengo un negocio en Cádiz y me gustaría automatizar…"
                          className={cn(fieldCls, "resize-none")}
                        />
                      </label>

                      {error && (
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-amber">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={sending}
                        className="btn-lime group w-full justify-center px-7 py-4 text-sm disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                      >
                        {sending ? "Enviando…" : "Enviar mensaje"}
                        {sending ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/25 border-t-ink" />
                        ) : (
                          <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        )}
                      </button>
                      <p className="font-mono text-[0.56rem] uppercase leading-relaxed tracking-[0.14em] text-mute">
                        El mensaje se envía directamente a mi correo · no se publican tus datos
                      </p>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[84rem] flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/[0.04] font-display text-sm font-extrabold text-white">
              JM
            </span>
            <div>
              <p className="font-display text-[1rem] font-semibold tracking-tight text-white">
                {profile.alias} · {profile.fullName}
              </p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mute">
                {getAge()} años · {profile.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-mute">
              © {new Date().getFullYear()} · hecho a mano con React
            </p>
            <a href="#top" className="btn-ghost group px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em]">
              Arriba
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 flex max-w-[84rem] items-center gap-2 font-mono text-[0.56rem] uppercase leading-relaxed tracking-[0.16em] text-mute/70">
          <ArrowRight className="h-3 w-3 shrink-0" />
          Las demos de mis proyectos usan datos ficticios. Lo que escribas en ellas no sale de tu navegador.
        </p>
      </footer>
    </>
  );
}
