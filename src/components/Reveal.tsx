import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  once?: boolean;
};

/** Aparece con un fundido suave cuando entra en pantalla. */
export function Reveal({ children, className, delay = 0, style, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            if (once) io.disconnect();
          } else if (!once) {
            setSeen(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={cn("reveal", seen && "is-in", className)}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Texto que se escribe solo, carácter a carácter. */
export function TypeWriter({
  lines,
  className,
  speed = 26,
  linePause = 900,
}: {
  lines: string[];
  className?: string;
  speed?: number;
  linePause?: number;
}) {
  const [output, setOutput] = useState<string[]>([""]);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    setOutput([""]);

    (async () => {
      for (const line of lines) {
        for (let i = 1; i <= line.length; i++) {
          await new Promise((r) => timers.push(window.setTimeout(r, speed)));
          if (cancelled) return;
          setOutput((prev) => {
            const next = [...prev];
            next[next.length - 1] = line.slice(0, i);
            return next;
          });
        }
        if (cancelled) return;
        await new Promise((r) => timers.push(window.setTimeout(r, linePause)));
        if (cancelled) return;
        setOutput((prev) => [...prev, ""]);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [lines, speed, linePause]);

  return (
    <span className={className}>
      {output.map((l, i) => (
        <span key={i} className="block">
          {l}
          {i === output.length - 1 && <span className="anim-caret">▍</span>}
        </span>
      ))}
    </span>
  );
}
