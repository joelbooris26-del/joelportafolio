import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

export const ArrowUpRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export const ArrowDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v15" />
    <path d="m6 13 6 6 6-6" />
  </svg>
);

export const Close = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const Chat = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12.5c0 3.9-3.6 7-8 7-1 0-2-.2-2.9-.5L4 21l1.4-3.6C4.2 16.1 3.5 14.4 3.5 12.5c0-3.9 3.8-7 8.5-7s8 3.1 8 7Z" />
    <path d="M9 12h.01M12 12h.01M15 12h.01" strokeWidth={2.2} />
  </svg>
);

export const Phone = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
  </svg>
);

export const PhoneOff = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 3 21 21" />
    <path d="M8.5 6.5 9 4H6.5a2 2 0 0 0-2 2.2A17 17 0 0 0 19 20.5l.4-2-2.6-.9" />
  </svg>
);

export const Calendar = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
  </svg>
);

export const Clock = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Pin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const Mail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m3.8 7 7.3 5.6a1.6 1.6 0 0 0 1.8 0L20.2 7" />
  </svg>
);

export const Check = (p: P) => (
  <svg {...base} {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Spark = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3.5 13.9 9l5.6 1.9-5.6 2L12 18.5 10.1 13 4.5 11 10.1 9 12 3.5Z" />
    <path d="M18.5 17.5 19.3 20l2.2.8-2.2.8-.8 2.2" transform="translate(0 -4)" />
  </svg>
);

export const Bolt = (p: P) => (
  <svg {...base} {...p}>
    <path d="M13.5 3 5 13.5h5.5L10 21l8.5-10.5H13L13.5 3Z" />
  </svg>
);

export const Cpu = (p: P) => (
  <svg {...base} {...p}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
    <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
  </svg>
);

export const Inbox = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.5 13.5 6 5.2A2 2 0 0 1 7.9 3.8h8.2A2 2 0 0 1 18 5.2l2.5 8.3v4.3a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-4.3Z" />
    <path d="M3.5 13.5h4l1.2 2.2h6.6l1.2-2.2h4" />
  </svg>
);

export const Send = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 3 10.5 13.5" />
    <path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" />
  </svg>
);

export const Users = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M16 5.6a3.2 3.2 0 0 1 0 6M17.5 14.9c2 .6 3.3 2.3 3.7 4.6" />
  </svg>
);

export const Copy = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11.5" height="11.5" rx="2" />
    <path d="M15 6.2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1.2" />
  </svg>
);

export const Menu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const Code = (p: P) => (
  <svg {...base} {...p}>
    <path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.5 4.5l-3 15" />
  </svg>
);

export const Wave = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2 9c2.5-3 5-3 7.5 0S15 12 17.5 9 22 6 22 6" />
    <path d="M2 15c2.5-3 5-3 7.5 0s5.5 3 8-0 4.5-3 4.5-3" />
  </svg>
);

export const Star = (p: P) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8L12 3.8Z" />
  </svg>
);

export const Leaf = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 20c0-8 5-14 16-15 0 10-5 15-11 15a5 5 0 0 1-5 0Z" />
    <path d="M9 15c2-3.5 4.5-6 8-8" />
  </svg>
);

export const Chef = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6.5 20.5h11l-.8-6.2H7.3l-.8 6.2Z" />
    <path d="M7.3 14.3C5 13.6 3.5 11.8 3.5 9.8A3.8 3.8 0 0 1 8 6.1a4.2 4.2 0 0 1 8 0 3.8 3.8 0 0 1 4.5 3.7c0 2-1.5 3.8-3.8 4.5" />
  </svg>
);

export const Heart = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20.2s-7.5-4.5-7.5-9.6A4 4 0 0 1 12 8.2a4 4 0 0 1 7.5 2.4c0 5.1-7.5 9.6-7.5 9.6Z" />
  </svg>
);

export const Scissors = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="6" r="2.4" />
    <circle cx="6" cy="18" r="2.4" />
    <path d="M8.1 7.3 20 18M20 6 8.1 16.7" />
  </svg>
);

export const Bag = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4.8 7.5h14.4l-1 12.8H5.8L4.8 7.5Z" />
    <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
  </svg>
);

export const Key = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="7.5" cy="12" r="3.8" />
    <path d="M11.3 12H21M17.8 12v3.2M14.8 12v2.4" />
  </svg>
);

export const Wrench = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20.2 6.2a4.2 4.2 0 0 1-5.5 5.5L6.3 20.1a1.8 1.8 0 0 1-2.5-2.5l8.4-8.4a4.2 4.2 0 0 1 5.5-5.5l-2.4 2.4.6 3.2 3.2.6 1.1-3.7Z" />
  </svg>
);

export const Dumbbell = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9.5v5M7.2 7.5v9M16.8 7.5v9M20 9.5v5M7.2 12h9.6" />
  </svg>
);

export const Docs = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 3.5h7.5L19 9v11.5H6V3.5Z" />
    <path d="M13.2 3.6V9H19M9 13h6.5M9 16.5h6.5" />
  </svg>
);

export const Bed = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 7.5v11M3 12.5h18v5.5M21 18v-4.2a3 3 0 0 0-3-3H11v-1.3" />
    <circle cx="6.8" cy="10.2" r="1.6" />
  </svg>
);

export const Book = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 6.8C10.2 5.3 7.4 4.7 4 5.2v13c3.4-.5 6.2.1 8 1.6 1.8-1.5 4.6-2.1 8-1.6v-13c-3.4-.5-6.2.1-8 1.6Z" />
    <path d="M12 6.8v13" />
  </svg>
);

export const Mobile = (p: P) => (
  <svg {...base} {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 5.2h3" />
    <circle cx="12" cy="18.4" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const Bell = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 9.5a6 6 0 1 1 12 0c0 3.2.7 5 1.6 6.1.5.6.1 1.4-.7 1.4H5.1c-.8 0-1.2-.8-.7-1.4C5.3 14.5 6 12.7 6 9.5Z" />
    <path d="M10 20a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const Cloud = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 18.5a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 9.6a3.9 3.9 0 0 1-.6 7.8l-1.2.1H7Z" />
  </svg>
);

export const Rocket = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3.5c3.2 2.1 5 5.4 5 9.2l-2 3.8H9L7 12.7c0-3.8 1.8-7.1 5-9.2Z" />
    <circle cx="12" cy="10.5" r="1.8" />
    <path d="M9 16.5 7 20.5l3-1.4M15 16.5l2 4-3-1.4" />
  </svg>
);

export const Layers = (p: P) => (
  <svg {...base} {...p}>
    <path d="m12 3.5 8.5 4.3L12 12 3.5 7.8 12 3.5Z" />
    <path d="m4 12 8 4 8-4M4 16.2l8 4 8-4" />
  </svg>
);

export const Store = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9.5h16V20H4V9.5Z" />
    <path d="M3 9.5 5 4h14l2 5.5" />
    <path d="M9.5 20v-6h5v6" />
  </svg>
);

export const Lock = (p: P) => (
  <svg {...base} {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);

export const Search = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.2 15.2 4.3 4.3" />
  </svg>
);

export const Chart = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16.5V12M12.5 16.5V7.5M17 16.5v-6" />
  </svg>
);

export const Car = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.5 16.5v-3.2l2-4.6A2 2 0 0 1 7.3 7.4h9.4a2 2 0 0 1 1.8 1.3l2 4.6v3.2" />
    <path d="M3.5 13h17" />
    <circle cx="7.3" cy="17.6" r="1.6" />
    <circle cx="16.7" cy="17.6" r="1.6" />
  </svg>
);
