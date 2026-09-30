import { useEffect, useId, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function WaterBottle({
  percentage,
  description,
}: {
  percentage: number;
  description: string;
}) {
  const t = useTranslation();
  const id = useId().replaceAll(":", "");
  const [level, setLevel] = useState(0);
  const clamped = Math.min(100, Math.max(0, percentage));
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setLevel(clamped));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [clamped]);
  const outline =
    "M49 28 H79 V49 C79 62 99 65 99 84 V211 Q99 229 81 229 H47 Q29 229 29 211 V84 C29 65 49 62 49 49 Z";
  return (
    <div
      role="progressbar"
      aria-label={t.water.bottle}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={description}
      className="mx-auto w-20 shrink-0 sm:w-24"
    >
      <svg viewBox="0 0 128 244" aria-hidden="true" className="w-full">
        <defs>
          <clipPath id={`${id}-bottle`}>
            <path d={outline} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-bottle)`}>
          <g
            className="water-bottle-level"
            style={{ transform: `translateY(${229 - level * 2.01}px)` }}
          >
            <rect
              x="28"
              y="0"
              width="72"
              height="232"
              fill="var(--color-blue-light)"
              opacity="0.35"
            />
            <path
              d="M28 1 H100"
              stroke="var(--color-blue-light)"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
          </g>
        </g>
        <path
          d={outline}
          fill="none"
          stroke="var(--color-text-subtle)"
          strokeOpacity="0.65"
          strokeWidth="1.8"
        />
        <rect
          x="48"
          y="15"
          width="32"
          height="10"
          rx="3"
          fill="var(--color-blue-light)"
          fillOpacity="0.12"
          stroke="var(--color-text-subtle)"
          strokeOpacity="0.65"
          strokeWidth="1.8"
        />
      </svg>
    </div>
  );
}
