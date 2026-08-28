import type { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-widest text-text-subtle"
      >
        {label}
      </label>

      <input
        id={id}
        className={[
          "h-12 w-full rounded-lg",
          "border border-surface-elevated",
          "bg-bg/50 px-4",
          "text-sm text-text",
          "outline-none transition",
          "placeholder:text-text-subtle/50",
          "focus:border-green-light",
          "focus:ring-1 focus:ring-green-light/30",
          className,
        ].join(" ")}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-light">
          {error}
        </p>
      )}
    </div>
  );
}
