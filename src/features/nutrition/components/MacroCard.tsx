interface MacroCardProps {
  name: string;
  value: number;
  target: number;
  unit: string;
}

export function MacroCard({
  name,
  value,
  target,
  unit,
}: MacroCardProps) {
  const percentage = Math.min((value / target) * 100, 100);

  return (
    <article className="rounded-xl border border-surface-elevated/50 bg-surface/35 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">
            {name}
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-text">
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
        of {target} {unit}
      </p>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-bg-deep">
        <div
          className="h-full rounded-full bg-green-light transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </article>
  );
}
