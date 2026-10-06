/** Piezas pequeñas compartidas por las tres demos (iconos y utilidades). */

type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IPhone = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
  </svg>
);
export const IPhoneOff = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 3 21 21" />
    <path d="M8.5 6.5 9 4H6.5a2 2 0 0 0-2 2.2A17 17 0 0 0 19 20.5l.4-2-2.6-.9" />
  </svg>
);
export const IVolume = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 10v4h3.5L12 18V6L7.5 10H4Z" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);
export const IVolumeOff = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 10v4h3.5L12 18V6L7.5 10H4Z" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </svg>
);
export const ISend = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M21 3 10.5 13.5" />
    <path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" />
  </svg>
);
export const ICheck = ({ className }: P) => (
  <svg {...base} strokeWidth={2.3} className={className}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);
export const ISun = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
  </svg>
);
export const IMoon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
  </svg>
);
export const IReset = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 12a8 8 0 1 0 2.5-5.8" />
    <path d="M4 4v4.5h4.5" />
  </svg>
);
export const IChat = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M20 12.5c0 3.9-3.6 7-8 7-1 0-2-.2-2.9-.5L4 21l1.4-3.6C4.2 16.1 3.5 14.4 3.5 12.5c0-3.9 3.8-7 8.5-7s8 3.1 8 7Z" />
  </svg>
);
export const IClose = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const IArrow = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

/** Primera letra en mayúscula. */
export const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** Texto sin tildes y en minúsculas, para comparar lo que escribe la persona. */
export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export type DemoProps = { onContact: () => void };
