interface MacroCardProps {
  name: string;
  value: number;
  target: number;
  unit: string;
  ofLabel: string;
}

export function MacroCard({
  name,
  value,
  target,
  unit,
  ofLabel,
}: MacroCardProps) {
  const percentage =
    target > 0
      ? Math.min(
          (value / target) * 100,
          100,
        )
      : 0;

  return (
    <article
      className={[
        "rounded-xl",
        "border border-surface-elevated/50",
        "bg-surface/30",
        "p-4 sm:p-5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">
            {name}
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              {value}
            </span>

            <span className="text-sm text-text-subtle">
              {unit}
            </span>
          </div>
        </div>

        <span className="font-mono text-xs text-green-light">
          {Math.round(percentage)}%
        </span>
      </div>

      <p className="mt-1 text-xs text-text-subtle">
        {ofLabel} {target} {unit}
      </p>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-bg-deep">
        <div
          className="h-full rounded-full bg-green-light transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </article>
  );
}
