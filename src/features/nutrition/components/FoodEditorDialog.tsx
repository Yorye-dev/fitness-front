import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/hooks/useTranslation";
import { nutritionErrorMessage } from "../lib/errors";
import { saveFood } from "../services/nutrition.service";
import type { Food, FoodInput } from "../types/nutrition.types";
import { foodSchema } from "../validation/nutrition.schemas";

export function FoodEditorDialog({
  food,
  onClose,
  onSaved,
}: {
  food?: Food;
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useTranslation();
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<FoodInput>({
    resolver: zodResolver(foodSchema(t)),
    mode: "onTouched",
    defaultValues: food ?? { name: "", nutrition_basis: "per_100g" },
  });
  const perUnit = useWatch({ control, name: "nutrition_basis" }) === "per_unit";
  const macroMax = perUnit ? 99999.999 : 100;
  const fields = [
    {
      name: "calories",
      label: `${t.macros.calories} (kcal)`,
      max: 99999.999,
    },
    { name: "protein", label: `${t.macros.protein} (g)`, max: macroMax },
    { name: "carbs", label: `${t.macros.carbs} (g)`, max: macroMax },
    { name: "fat", label: `${t.macros.fat} (g)`, max: macroMax },
  ] as const;
  const submit = async (values: FoodInput) => {
    setBusy(true);
    clearErrors("root");
    try {
      await saveFood(values, food?.id);
      onSaved();
    } catch (error) {
      setError("root", { message: nutritionErrorMessage(error, t) });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      title={food ? t.foodCatalog.editFood : t.foodCatalog.newFood}
      onClose={onClose}
      busy={busy}
    >
      <form noValidate onSubmit={handleSubmit(submit)} className="space-y-5">
        <fieldset disabled={busy} className="space-y-5">
          <Input
            label={t.foodCatalog.name}
            placeholder={t.foodCatalog.namePlaceholder}
            required
            {...register("name")}
            error={errors.name?.message}
          />
          <Select
            label={t.foodCatalog.nutritionBasis}
            {...register("nutrition_basis")}
          >
            <option value="per_100g">{t.foodCatalog.per100g}</option>
            <option value="per_unit">{t.foodCatalog.perUnit}</option>
          </Select>
          <div>
            <h3 className="text-sm font-medium text-green">
              {perUnit ? t.foodCatalog.perUnit : t.foodCatalog.per100g}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-text-subtle">
              {perUnit
                ? t.foodCatalog.unitValuesHint
                : t.foodCatalog.valuesHint}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ name, label, max }) => (
              <Input
                key={name}
                label={label}
                type="number"
                inputMode="decimal"
                min={0}
                max={max}
                step="0.001"
                required
                {...register(name, { valueAsNumber: true })}
                error={errors[name]?.message}
              />
            ))}
          </div>
        </fieldset>
        {errors.root?.message && (
          <p role="alert" className="form-error">
            {errors.root.message}
          </p>
        )}
        <p className="text-xs leading-relaxed text-text-subtle">
          {t.foodCatalog.catalogHint}
        </p>
        <Button
          type="submit"
          loading={busy}
          loadingLabel={t.foodCatalog.saving}
        >
          {t.foodCatalog.save}
        </Button>
      </form>
    </Dialog>
  );
}
