import axios from "axios";
import { Droplets, Pencil, Undo2 } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTranslation } from "@/hooks/useTranslation";
import { localDateKey } from "@/lib/date";
import { newEntryId } from "@/lib/uuid";
import { usePreferencesStore } from "@/stores/preferences.store";
import { addWater, getWater, removeWater, setWaterGoal } from "../service";
import { useDailyWater } from "../useDailyWater";
import { WaterBottle } from "./WaterBottle";

export function DailyWaterCard({
  date,
  revision,
}: {
  date: string;
  revision: number;
}) {
  const t = useTranslation();
  const language = usePreferencesStore((s) => s.language);
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const { state, reload, setDay } = useDailyWater(date, userId, revision);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [custom, setCustom] = useState(false);
  const [amount, setAmount] = useState("250");
  const [goal, setGoal] = useState<string | null>(null);
  const [pending, setPending] = useState<{ id: string; amount: number } | null>(
    null,
  );
  const flight = useRef(false);
  const future = date > localDateKey();
  const format = (n: number) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: 3 }).format(n);
  const record = async (ml: number) => {
    if (flight.current) return;
    if (!Number.isInteger(ml) || ml < 1 || ml > 5000) {
      setError(t.water.invalid);
      return;
    }
    const entry = pending ?? { id: newEntryId(), amount: ml };
    setPending(entry);
    flight.current = true;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      setDay(await addWater(date, entry.id, entry.amount));
      setPending(null);
      setNotice(t.water.added);
      setCustom(false);
    } catch (e) {
      // A definitive client rejection is safe to correct; uncertain network failures keep the ID.
      if (
        axios.isAxiosError(e) &&
        e.response &&
        [400, 404, 409, 422].includes(e.response.status)
      ) {
        setPending(null);
        reload();
      }
      setError(
        axios.isAxiosError(e) && e.response?.status === 409
          ? t.water.conflict
          : t.water.saveFailed,
      );
    } finally {
      flight.current = false;
      setBusy(false);
    }
  };
  const updateGoal = async () => {
    const value = Number(goal);
    if (!Number.isInteger(value) || value < 100 || value > 10000) {
      setError(t.water.invalidGoal);
      return;
    }
    if (flight.current) return;
    flight.current = true;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      setDay(await setWaterGoal(date, value));
      setGoal(null);
      setNotice(t.water.goalSaved);
    } catch {
      setError(t.water.saveFailed);
    } finally {
      flight.current = false;
      setBusy(false);
    }
  };
  const undo = async (id: string) => {
    if (flight.current) return;
    flight.current = true;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await removeWater(id);
      setDay(await getWater(date));
      setNotice(t.water.removed);
    } catch {
      setError(t.water.saveFailed);
    } finally {
      flight.current = false;
      setBusy(false);
    }
  };
  return (
    <section className="panel space-y-4" aria-busy={busy}>
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <Droplets size={20} className="text-blue-light" aria-hidden="true" />
          {t.water.title}
        </h2>
        {state.status === "success" && (
          <button
            type="button"
            className="icon-button"
            aria-label={t.water.editGoal}
            title={t.water.editGoal}
            disabled={busy || !!pending || future}
            onClick={() => setGoal(String(state.data.goal_ml))}
          >
            <Pencil size={15} />
          </button>
        )}
      </header>
      {state.status === "loading" && (
        <p role="status" className="text-sm text-text-subtle">
          {t.water.loading}
        </p>
      )}
      {state.status === "error" && (
        <div role="alert" className="space-y-3">
          <p className="text-sm">{t.water.loadFailed}</p>
          <button type="button" className="secondary-button" onClick={reload}>
            {t.common.retry}
          </button>
        </div>
      )}
      {state.status === "success" && (
        <>
          <div className="flex items-center gap-3">
            <WaterBottle
              percentage={(state.data.total_ml / state.data.goal_ml) * 100}
              description={`${format(state.data.total_ml / 1000)} L / ${format(state.data.goal_ml / 1000)} L`}
            />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs text-text-subtle">{t.water.consumed}</p>
              <p className="text-2xl font-semibold tabular-nums">
                {format(state.data.total_ml / 1000)}{" "}
                <span className="text-base font-normal text-text-subtle">
                  / {format(state.data.goal_ml / 1000)} L
                </span>
              </p>
              <p className="text-xl font-medium tabular-nums text-blue-light">
                {format(
                  Math.round((state.data.total_ml / state.data.goal_ml) * 100),
                )}{" "}
                %
              </p>
              <p className="text-xs leading-relaxed text-text-subtle">
                {state.data.total_ml >= state.data.goal_ml
                  ? t.water.reached
                  : `${format((state.data.goal_ml - state.data.total_ml) / 1000)} L ${t.water.remaining}`}
              </p>
              <p className="text-xs text-text-subtle">
                {state.data.entries.length} {t.water.entries}
              </p>
            </div>
          </div>
          {goal !== null && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void updateGoal();
              }}
              className="space-y-3 rounded-xl border border-surface-elevated/50 p-3"
            >
              <Input
                label={t.water.goalLabel}
                type="number"
                min={100}
                max={10000}
                step={1}
                required
                value={goal}
                disabled={busy}
                onChange={(e) => setGoal(e.target.value)}
                hint={t.water.goalHint}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="secondary-button"
                >
                  {t.water.saveGoal}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="secondary-button"
                  onClick={() => setGoal(null)}
                >
                  {t.common.cancel}
                </button>
              </div>
            </form>
          )}
          <fieldset
            disabled={busy || !!pending || future}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="secondary-button text-blue-light"
                onClick={() => void record(250)}
              >
                +250 ml
              </button>
              <button
                type="button"
                className="secondary-button text-blue-light"
                onClick={() => void record(500)}
              >
                +500 ml
              </button>
            </div>
            <button
              type="button"
              className="w-full rounded-lg py-2 text-xs text-text-subtle hover:text-blue-light"
              onClick={() => setCustom(!custom)}
              aria-expanded={custom}
            >
              {t.water.custom}
            </button>
            {custom && (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void record(Number(amount));
                }}
              >
                <Input
                  label={t.water.amount}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={5000}
                  step={1}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit" className="secondary-button w-full">
                  {t.water.add}
                </button>
              </form>
            )}
            {state.data.entries.length > 0 && (
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs text-text-subtle hover:text-text"
                onClick={() =>
                  void undo(
                    state.data.entries[state.data.entries.length - 1].id,
                  )
                }
              >
                <Undo2 size={13} />
                {t.water.undo} (−
                {
                  state.data.entries[state.data.entries.length - 1].amount_ml
                }{" "}
                ml)
              </button>
            )}
          </fieldset>
        </>
      )}
      {future && <p className="text-xs text-text-subtle">{t.water.future}</p>}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {pending && !busy && (
        <div className="space-y-2">
          <button
            type="button"
            className="secondary-button w-full"
            onClick={() => void record(pending.amount)}
          >
            {t.water.retry} (+{pending.amount} ml)
          </button>
          <p className="text-xs text-text-subtle">{t.water.uncertain}</p>
        </div>
      )}
      {notice && (
        <p role="status" className="text-xs text-blue-light">
          {notice}
        </p>
      )}
    </section>
  );
}
