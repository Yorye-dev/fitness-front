import { useState, type ReactNode } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

export function ConfirmDialog({
  title,
  children,
  onConfirm,
  onClose,
  errorMessage,
}: {
  title: string;
  children: ReactNode;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  errorMessage: (error: unknown) => string;
}) {
  const t = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog title={title} onClose={onClose} busy={busy}>
      <div className="space-y-5">
        {children}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            className="secondary-button flex-1"
            onClick={onClose}
            disabled={busy}
          >
            {t.common.cancel}
          </button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => void confirm()}
            loading={busy}
            loadingLabel={t.common.processing}
          >
            {t.common.confirm}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
