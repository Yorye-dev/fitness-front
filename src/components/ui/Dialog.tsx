import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface DialogProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
}

// Mounted only while open. Native dialogs manage focus, Escape and background inertness.
export function Dialog({
  title,
  children,
  onClose,
  busy = false,
}: DialogProps) {
  const t = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previouslyFocused = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      )
        previouslyFocused.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="app-dialog m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-surface-elevated bg-bg p-5 text-text shadow-xl sm:p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-lg font-medium">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="icon-button"
          aria-label={t.common.close}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
