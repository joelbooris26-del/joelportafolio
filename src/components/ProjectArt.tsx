import type { ArtId } from "@/data/content";

/** Ilustración abstracta de cada proyecto, dibujada con SVG y CSS. */
export function ProjectArt({ art, accent }: { art: ArtId; accent: string }) {
  const common = "h-full w-full";

  if (art === "steps") {
    return (
      <svg viewBox="0 0 300 160" className={common} fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect
              x={30 + i * 48}
              y={120 - i * 20}
              width="40"
              height={20 + i * 20}
              rx="6"
              fill={accent}
              opacity={0.12 + i * 0.16}
            />
            <rect x={30 + i * 48} y={120 - i * 20} width="40" height="3" rx="1.5" fill={accent} />
          </g>
        ))}
        <circle cx="262" cy="30" r="9" fill={accent}>
          <animate attributeName="cy" values="30;24;30" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="262" cy="30" r="9" stroke={accent} opacity="0.5">
          <animate attributeName="r" values="9;22;9" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <path d="M20 140h260" stroke="white" opacity="0.15" />
      </svg>
    );
  }

  if (art === "voice") {
    return (
      <div className="flex h-full items-center justify-center gap-[5px]">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="bar-eq w-[5px] rounded-full"
            style={{
              height: `${18 + ((i * 37) % 70)}%`,
              background: accent,
              opacity: 0.35 + ((i * 13) % 50) / 100,
              animationDelay: `${(i % 7) * 0.13}s`,
              animationDuration: `${0.9 + (i % 5) * 0.18}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (art === "chat") {
    return (
      <svg viewBox="0 0 300 160" className={common} fill="none">
        <rect x="22" y="20" width="118" height="30" rx="12" fill="white" opacity="0.08" stroke="white" strokeOpacity="0.2" />
        <rect x="34" y="32" width="70" height="5" rx="2.5" fill="white" opacity="0.45" />
        <rect x="160" y="62" width="118" height="30" rx="12" fill={accent} opacity="0.22" stroke={accent} strokeOpacity="0.7" />
        <rect x="172" y="74" width="80" height="5" rx="2.5" fill={accent} />
        <rect x="22" y="104" width="150" height="30" rx="12" fill="white" opacity="0.08" stroke="white" strokeOpacity="0.2" />
        <rect x="34" y="116" width="96" height="5" rx="2.5" fill="white" opacity="0.45" />
        <g>
          <circle cx="262" cy="118" r="4" fill={accent}>
            <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="274" cy="118" r="4" fill={accent}>
            <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="286" cy="118" r="4" fill={accent}>
            <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    );
  }

  // web
  return (
    <svg viewBox="0 0 300 160" className={common} fill="none">
      <rect x="28" y="18" width="244" height="128" rx="12" fill="white" opacity="0.04" stroke="white" strokeOpacity="0.22" />
      <path d="M28 40h244" stroke="white" strokeOpacity="0.2" />
      <circle cx="44" cy="29" r="3" fill="white" opacity="0.4" />
      <circle cx="56" cy="29" r="3" fill="white" opacity="0.3" />
      <circle cx="68" cy="29" r="3" fill={accent} />
      <rect x="46" y="58" width="104" height="10" rx="3" fill={accent} opacity="0.8" />
      <rect x="46" y="76" width="140" height="5" rx="2.5" fill="white" opacity="0.3" />
      <rect x="46" y="88" width="110" height="5" rx="2.5" fill="white" opacity="0.2" />
      <rect x="46" y="108" width="56" height="18" rx="9" fill={accent} opacity="0.25" stroke={accent} />
      <rect x="200" y="58" width="56" height="68" rx="8" fill={accent} opacity="0.12" stroke={accent} strokeOpacity="0.5" />
      <path d="M222 100l12 22 4-8 8-2z" fill="white">
        <animateTransform attributeName="transform" type="translate" values="0 0;-14 -22;0 0" dur="4s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}
