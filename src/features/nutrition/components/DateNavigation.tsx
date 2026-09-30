import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { isDateKey, localDateKey, shiftDate } from "@/lib/date";

interface DateNavigationProps {
  date: string;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
  loading: boolean;
  dateLabel?: string;
  refreshLabel?: string;
}

export function DateNavigation({
  date,
  onDateChange,
  onRefresh,
  loading,
  dateLabel,
  refreshLabel,
}: DateNavigationProps) {
  const t = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-xl border border-surface-elevated/60 bg-bg-deep/40 p-1">
        <button
          type="button"
          className="icon-button border-0"
          aria-label={t.dashboard.previousDay}
          onClick={() => onDateChange(shiftDate(date, -1))}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <input
          type="date"
          aria-label={dateLabel ?? t.dashboard.date}
          value={date}
          className="min-w-0 max-w-36 rounded-lg bg-transparent px-1 py-2 text-sm"
          onChange={(event) => {
            if (isDateKey(event.target.value)) onDateChange(event.target.value);
          }}
        />
        <button
          type="button"
          className="icon-button border-0"
          aria-label={t.dashboard.nextDay}
          onClick={() => onDateChange(shiftDate(date, 1))}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        className="secondary-button"
        disabled={date === localDateKey()}
        onClick={() => onDateChange(localDateKey())}
      >
        {t.dashboard.today}
      </button>
      <button
        type="button"
        className="icon-button"
        aria-label={refreshLabel ?? t.dashboard.refresh}
        title={refreshLabel ?? t.dashboard.refresh}
        onClick={onRefresh}
        disabled={loading}
      >
        <RotateCw size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
