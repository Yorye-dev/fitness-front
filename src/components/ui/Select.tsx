import { useId, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export function Select({ label, error, id, children, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className="space-y-2">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-text-muted"
      >
        {label}
      </label>
      <select
        {...props}
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={`field-input ${error ? "border-red-light" : ""}`}
      >
        {children}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-xs text-red-light">
          {error}
        </p>
      )}
    </div>
  );
}
