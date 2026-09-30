import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/stores/preferences.store";
import { nutritionErrorMessage } from "../lib/errors";
import { portionTotalGrams } from "../lib/quantity";
import type {
  DailyMeal,
  UpdateConsumptionInput,
} from "../types/nutrition.types";
import {
  intakeSchema,
  type IntakeValues,
} from "../validation/nutrition.schemas";

type NutritionBasis = Pick<
  DailyMeal,
  "calories" | "protein" | "carbs" | "fat"
> & { amount: number };

export function ConsumptionForm({
  name,
  date,
  basis,
  initial,
  editing = false,
  unitOnly = false,
  onSave,
  setBusy,
  onChangeFood,
}: {
  name: string;
  date: string;
  basis: NutritionBasis;
  initial?: DailyMeal;
  editing?: boolean;
  unitOnly?: boolean;
  onSave: (values: UpdateConsumptionInput) => Promise<void>;
  setBusy: (value: boolean) => void;
  onChangeFood?: () => void;
}) {
  const t = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IntakeValues>({
    resolver: zodResolver(intakeSchema(t)),
    mode: "onTouched",
    defaultValues: {
      date,
      mode: unitOnly
        ? "units"
        : initial?.portion_count != null
          ? "portions"
          : "grams",
      quantity_grams: initial?.quantity_grams ?? 100,
      portion_count: initial?.portion_count ?? 1,
      portion_grams: initial?.portion_grams ?? initial?.quantity_grams ?? 100,
    },
  });
  const [mode, grams, count, unitGrams] = useWatch({
    control,
    name: ["mode", "quantity_grams", "portion_count", "portion_grams"],
  });
  const quantity =
    mode === "units"
      ? count
      : mode === "portions"
        ? portionTotalGrams(count, unitGrams)
        : grams;
  const validQuantity =
    Number.isFinite(quantity) &&
    quantity >= 0.001 &&
    quantity <= 1000000 &&
    (mode !== "portions" || (count > 0 && unitGrams > 0));
  const format = (value: number, decimals = 1) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: decimals }).format(
      value,
    );
  const preview = [
    { label: t.macros.calories, value: basis.calories, unit: "kcal" },
    { label: t.macros.protein, value: basis.protein, unit: "g" },
    { label: t.macros.carbs, value: basis.carbs, unit: "g" },
    { label: t.macros.fat, value: basis.fat, unit: "g" },
  ];
  const submit = async (values: IntakeValues) => {
    setBusy(true);
    clearErrors("root");
    try {
      await onSave(
        values.mode === "units"
          ? { date: values.date, portion_count: values.portion_count }
          : values.mode === "grams"
            ? { date: values.date, quantity_grams: values.quantity_grams }
            : {
                date: values.date,
                portion_count: values.portion_count,
                portion_grams: values.portion_grams,
              },
      );
    } catch (error) {
      setError("root", { message: nutritionErrorMessage(error, t) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface/40 p-4">
        <p className="min-w-0 break-words font-medium">{name}</p>
        {onChangeFood && (
          <button
            type="button"
            className="text-xs font-medium text-green underline-offset-4 hover:underline"
            disabled={isSubmitting}
            onClick={onChangeFood}
          >
            {t.foodCatalog.change}
          </button>
        )}
      </div>
      <fieldset disabled={isSubmitting} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {unitOnly ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-muted">
                {t.foodCatalog.measurement}
              </p>
              <p className="py-3 text-sm text-text-subtle">
                {t.foodCatalog.unitOnly}
              </p>
            </div>
          ) : (
            <Select
              label={t.foodCatalog.measurement}
              {...register("mode")}
              onChange={(event) => {
                const nextMode =
                  event.target.value === "portions" ? "portions" : "grams";
                if (nextMode === "grams" && validQuantity)
                  setValue("quantity_grams", quantity);
                if (
                  nextMode === "portions" &&
                  validQuantity &&
                  portionTotalGrams(
                    getValues("portion_count"),
                    getValues("portion_grams"),
                  ) !== quantity
                ) {
                  setValue("portion_count", 1);
                  setValue("portion_grams", quantity);
                }
                setValue("mode", nextMode);
                clearErrors([
                  "quantity_grams",
                  "portion_count",
                  "portion_grams",
                ]);
              }}
            >
              <option value="grams">{t.foodCatalog.inGrams}</option>
              <option value="portions">{t.foodCatalog.inPortions}</option>
            </Select>
          )}
          <Input
            label={t.foodCatalog.date}
            type="date"
            required
            {...register("date")}
            error={errors.date?.message}
          />
        </div>
        {unitOnly ? (
          <Input
            label={t.foodCatalog.unitCount}
            type="number"
            inputMode="decimal"
            min="0.001"
            max="1000000"
            step="0.001"
            required
            {...register("portion_count", { valueAsNumber: true })}
            error={errors.portion_count?.message}
            hint={t.foodCatalog.unitIntakeHint}
          />
        ) : mode === "grams" ? (
          <Input
            label={t.foodCatalog.quantity}
            type="number"
            inputMode="decimal"
            min="0.001"
            max="1000000"
            step="0.001"
            required
            {...register("quantity_grams", { valueAsNumber: true })}
            error={errors.quantity_grams?.message}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t.foodCatalog.portionCount}
              type="number"
              inputMode="decimal"
              min="0.001"
              max="1000000"
              step="0.001"
              required
              {...register("portion_count", { valueAsNumber: true })}
              error={errors.portion_count?.message}
            />
            <Input
              label={t.foodCatalog.portionGrams}
              type="number"
              inputMode="decimal"
              min="0.001"
              max="1000000"
              step="0.001"
              required
              {...register("portion_grams", { valueAsNumber: true })}
              error={errors.portion_grams?.message}
              hint={t.foodCatalog.portionHint}
            />
          </div>
        )}
      </fieldset>
      {mode === "portions" && (
        <p role="status" className="text-sm text-text-muted">
          {validQuantity
            ? `${format(count, 3)} × ${format(unitGrams, 3)} g = ${format(quantity, 3)} g`
            : t.foodCatalog.portionTotalHint}
        </p>
      )}
      <section
        className="rounded-xl border border-surface-elevated/50 p-4"
        aria-label={t.foodCatalog.preview}
      >
        <h3 className="mb-3 text-xs font-medium text-text-subtle">
          {t.foodCatalog.preview}
        </h3>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {preview.map(({ label, value, unit }) => (
            <div key={label}>
              <dt className="text-xs text-text-subtle">{label}</dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums">
                {validQuantity && basis.amount > 0
                  ? `${format((value * quantity) / basis.amount)} ${unit}`
                  : "—"}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      {errors.root?.message && (
        <p role="alert" className="form-error">
          {errors.root.message}
        </p>
      )}
      <p className="text-xs leading-relaxed text-text-subtle">
        {editing ? t.foodCatalog.editIntakeHint : t.foodCatalog.logHint}
      </p>
      <Button
        type="submit"
        loading={isSubmitting}
        loadingLabel={editing ? t.foodCatalog.saving : t.foodCatalog.logging}
      >
        {editing ? t.foodCatalog.saveIntake : t.foodCatalog.log}
      </Button>
    </form>
  );
}
