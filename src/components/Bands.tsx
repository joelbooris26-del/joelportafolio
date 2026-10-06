import { bandWords } from "@/data/content";

function Track({ reverse, outline }: { reverse?: boolean; outline?: boolean }) {
  const group = (copy: number) => (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={copy === 2 ? true : undefined}>
      {bandWords.map((w) => (
        <span key={`${copy}-${w}`} className="flex shrink-0 items-center gap-10">
          <span
            className={
              outline
                ? "outline-text font-display text-[clamp(2rem,5vw,3.6rem)] font-extrabold uppercase tracking-[-0.02em]"
                : "font-display text-[clamp(1.3rem,3vw,2rem)] font-extrabold uppercase tracking-[-0.01em] text-ink"
            }
          >
            {w}
          </span>
          <span className={outline ? "text-lime" : "text-ink/60"}>✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`mq-track ${reverse ? "mq-r" : "mq-l"}`}>
      {group(1)}
      {group(2)}
    </div>
  );
}

/** Dos bandas inclinadas que se cruzan y se mueven en sentidos opuestos. */
export function Bands() {
  return (
    <section className="relative overflow-x-clip py-10 sm:py-16" aria-label="Lo que hago">
      <div className="relative mx-auto h-[15rem] sm:h-[19rem]">
        <div
          className="band absolute inset-x-[-6%] top-[18%] overflow-hidden border-y border-ink bg-lime py-3 sm:py-4"
          style={{ transform: "rotate(-3deg)" }}
        >
          <Track />
        </div>
        <div
          className="band absolute inset-x-[-6%] top-[48%] overflow-hidden border-y border-white/15 bg-panel py-3 sm:py-5"
          style={{ transform: "rotate(2.4deg)" }}
        >
          <Track reverse outline />
        </div>
      </div>
    </section>
  );
}
