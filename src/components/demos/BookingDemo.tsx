import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { nichesData, type NicheId } from "@/data/niches";
import { Check, Clock, Spark } from "../icons";

export function BookingDemo() {
  const [selectedNiche, setSelectedNiche] = useState<NicheId>("salud");
  const niche = nichesData[selectedNiche];

  const days = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const [selectedServiceId, setSelectedServiceId] = useState(niche.booking.services[0].id);
  const [selectedDayIdx, setSelectedDayIdx] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string | null>("11:30");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<{ dayIdx: number; time: string; title: string; pro: string }[]>([]);
  const [confirmedModal, setConfirmedModal] = useState<boolean>(false);
  const [lastBookingInfo, setLastBookingInfo] = useState<any>(null);

  // Al cambiar de nicho, actualizar servicio por defecto
  const service = niche.booking.services.find((s) => s.id === selectedServiceId) || niche.booking.services[0];
  const activeDay = days[selectedDayIdx];

  const timeSlots = ["09:00", "10:00", "11:00", "11:30", "12:30", "15:00", "16:30", "17:30", "18:30"];

  const isSlotBusy = (time: string) => {
    // Verificar en reservas creadas en la demo
    const inDemo = bookings.some((b) => b.dayIdx === selectedDayIdx && b.time === time);
    if (inDemo) return true;

    // Verificar en ocupaciones por defecto del nicho
    const inDefault = niche.booking.defaultBusy.some(
      (b) => b.dayOffset === selectedDayIdx && b.time === time,
    );
    return inDefault;
  };

  const confirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !selectedTime) return;

    const newBooking = {
      dayIdx: selectedDayIdx,
      time: selectedTime,
      title: `${service.name} · ${name}`,
      pro: service.pro,
    };

    setBookings((prev) => [...prev, newBooking]);
    setLastBookingInfo({
      serviceName: service.name,
      pro: service.pro,
      day: activeDay.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }),
      time: selectedTime,
      clientName: name,
      price: service.price,
    });
    setConfirmedModal(true);
  };

  const resetAll = () => {
    setConfirmedModal(false);
    setName("");
    setPhone("");
    setSelectedTime(null);
  };

  return (
    <div className="space-y-4">
      {/* Selector de nicho para la agenda */}
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-400">
            Selecciona tipo de negocio con agenda:
          </span>
          <span className="swipe-hint text-white">→</span>
        </div>
        <div className="swipe-wrap">
          <div className="swipe-x flex gap-1.5 pb-1">
            {(Object.keys(nichesData) as NicheId[]).map((nid) => {
              const item = nichesData[nid];
              const on = nid === selectedNiche;
              return (
                <button
                  key={nid}
                  onClick={() => {
                    setSelectedNiche(nid);
                    setSelectedServiceId(nichesData[nid].booking.services[0].id);
                    setSelectedTime(null);
                    setConfirmedModal(false);
                  }}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] transition-all",
                    on
                      ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      : "glass text-zinc-400 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interfaz oficial de Google Calendar / Cal.com Dark Theme */}
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#17171a] shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
        {/* Barra superior de Google Calendar */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#1e1e24] px-5 py-3">
          <div className="flex items-center gap-3">
            {/* Logo estilo Google Calendar */}
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-black font-bold text-xs">
              {activeDay.getDate()}
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white leading-tight">
                Google Calendar · {niche.companyName}
              </p>
              <p className="font-mono text-[0.58rem] text-zinc-400">
                Zona horaria: Europa/Madrid (GMT+1) · Sincronización automática
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="glass rounded-full px-3 py-1 font-mono text-[0.6rem] text-zinc-300">
              {niche.booking.businessType}
            </span>
          </div>
        </div>

        {/* Contenido: Selector de Servicio + Días + Horas estilo Cal.com */}
        <div className="grid lg:grid-cols-12">
          {/* Columna izquierda: Selección de servicio y formulario */}
          <div className="border-b border-white/10 p-3.5 sm:p-5 lg:col-span-6 lg:border-b-0 lg:border-r">
            <h4 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-400 mb-3">
              1. Selecciona el servicio
            </h4>

            <div className="space-y-2">
              {niche.booking.services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedServiceId(s.id);
                    setSelectedTime(null);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all",
                    selectedServiceId === s.id
                      ? "bg-white text-black font-semibold shadow-md"
                      : "glass text-zinc-300 hover:bg-white/[0.08]",
                  )}
                >
                  <div>
                    <p className="text-sm">{s.name}</p>
                    <p className={cn("text-xs font-mono mt-0.5", selectedServiceId === s.id ? "text-zinc-700" : "text-zinc-500")}>
                      {s.dur} min · Asignado a: {s.pro}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold">
                    {s.price === 0 ? "Gratis" : `${s.price} €`}
                  </span>
                </button>
              ))}
            </div>

            {/* Formulario rápido */}
            <form onSubmit={confirmBooking} className="mt-6 space-y-3 border-t border-white/10 pt-4">
              <h4 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-400">
                2. Datos del cliente
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  required
                  className="glass-input rounded-xl p-2.5 text-xs text-white outline-none"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Teléfono (WhatsApp)"
                  required
                  className="glass-input rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTime}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all",
                  selectedTime
                    ? "glass-btn-primary"
                    : "glass opacity-40 cursor-not-allowed text-zinc-500",
                )}
              >
                <Spark className="h-4 w-4" />
                {selectedTime ? `Confirmar Cita para las ${selectedTime}` : "Selecciona una hora en el calendario"}
              </button>
            </form>
          </div>

          {/* Columna derecha: Vista de Días y Horas estilo Google Calendar */}
          <div className="bg-[#121215] p-3.5 sm:p-5 lg:col-span-6">
            <h4 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-400 mb-3">
              3. Elige fecha y hora en Google Calendar
            </h4>

            {/* Días de la semana */}
            <div className="grid grid-cols-5 gap-1.5 pb-4 border-b border-white/10">
              {days.map((d, idx) => {
                const isSelected = idx === selectedDayIdx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDayIdx(idx);
                      setSelectedTime(null);
                    }}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-xl text-center transition-all",
                      isSelected ? "bg-white text-black font-bold shadow-md" : "glass text-zinc-400 hover:text-white",
                    )}
                  >
                    <span className="font-mono text-[0.55rem] uppercase">
                      {d.toLocaleDateString("es-ES", { weekday: "short" })}
                    </span>
                    <span className="text-base font-display mt-0.5">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            {/* Parrilla de horas con eventos de calendario */}
            <div className="demo-scroll mt-4 max-h-[15rem] space-y-1.5 overflow-y-auto pr-1 sm:max-h-64">
              <p className="font-mono text-[0.58rem] text-zinc-500 mb-2">
                Huecos en tiempo real para el {activeDay.toLocaleDateString("es-ES", { weekday: "long", day: "numeric" })}:
              </p>

              {timeSlots.map((time) => {
                const busy = isSlotBusy(time);
                const isSelected = selectedTime === time;

                if (busy) {
                  return (
                    <div
                      key={time}
                      className="flex items-center justify-between rounded-xl bg-white/[0.04] p-2.5 border border-white/5 opacity-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-zinc-500">{time}</span>
                        <span className="h-2 w-2 rounded-full bg-zinc-600" />
                        <span className="text-xs text-zinc-400 font-medium">Ocupado / Cita programada</span>
                      </div>
                      <span className="font-mono text-[0.55rem] text-zinc-600 uppercase">No disponible</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left",
                      isSelected
                        ? "bg-white text-black font-bold shadow-md"
                        : "glass text-zinc-200 hover:bg-white/10",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-mono text-xs">{time}</span>
                      <span className="text-xs">Disponible con {service.pro}</span>
                    </div>
                    <span className="font-mono text-[0.58rem] uppercase font-bold">
                      {isSelected ? "Seleccionado ✓" : "Elegir"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal de confirmación de Google Calendar */}
        {confirmedModal && lastBookingInfo && (
          <div className="anim-pop border-t border-white/15 bg-white/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="glass-btn-primary grid h-10 w-10 place-items-center rounded-full">
                  <Check className="h-6 w-6 text-black" strokeWidth={2.5} />
                </span>
                <div>
                  <h5 className="font-display text-base font-bold text-white">
                    ¡Cita agregada a Google Calendar!
                  </h5>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    <strong>{lastBookingInfo.serviceName}</strong> con {lastBookingInfo.pro} el {lastBookingInfo.day} a las {lastBookingInfo.time}.
                  </p>
                </div>
              </div>

              <button
                onClick={resetAll}
                className="glass-btn rounded-full px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-white"
              >
                Hacer otra reserva
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-[0.72rem] text-zinc-400 font-mono">
              <span>✓ Recordatorio por WhatsApp programado 24h antes</span>
              <span>✓ Enlace de videollamada / ubicación enviado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
