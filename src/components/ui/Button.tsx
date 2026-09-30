import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingLabel?: string;
}

export function Button({
  children,
  loading = false,
  loadingLabel,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "relative h-12 w-full overflow-hidden rounded-lg",
        "bg-[var(--color-action)] px-4",
        "text-sm font-semibold tracking-wide text-[var(--color-accent-contrast)]",
        "transition-all duration-200",
        "hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      {...props}
      aria-busy={loading}
    >
      {loading ? (loadingLabel ?? children) : children}
    </button>
  );
}
