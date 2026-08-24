import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`relative h-12 w-full overflow-hidden rounded-lg bg-green-light px-4 text-sm font-bold tracking-wide text-bg transition-all duration-200 hover:bg-green-light/90 hover:shadow-[0_0_30px_rgba(184,187,38,0.15)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {loading ? "AUTHENTICATING..." : children}
    </button>
  );
}
