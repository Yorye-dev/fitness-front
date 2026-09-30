import { useId, type InputHTMLAttributes, type ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export function Input({
  label,
  error,
  hint,
  trailing,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = [
    props["aria-describedby"],
    hint && `${inputId}-hint`,
    error && `${inputId}-error`,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-text-muted"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={`field-input ${error ? "border-red-light" : ""} ${trailing ? "pr-12" : ""} ${className}`}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-1 flex items-center">
            {trailing}
          </div>
        )}
      </div>
      {hint && (
        <p
          id={`${inputId}-hint`}
          className="text-xs leading-relaxed text-text-subtle"
        >
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-light">
          {error}
        </p>
      )}
    </div>
  );
}
