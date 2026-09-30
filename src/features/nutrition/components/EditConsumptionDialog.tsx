import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { updateConsumption } from "../services/nutrition.service";
import type { Consumption, DailyMeal } from "../types/nutrition.types";
import { ConsumptionForm } from "./ConsumptionForm";

export function EditConsumptionDialog({
  meal,
  date,
  onClose,
  onSaved,
}: {
  meal: DailyMeal;
  date: string;
  onClose: () => void;
  onSaved: (entry: Consumption) => void;
}) {
  const t = useTranslation();
  const [busy, setBusy] = useState(false);
  return (
    <Dialog title={t.foodCatalog.editIntake} onClose={onClose} busy={busy}>
      <ConsumptionForm
        name={meal.name}
        date={date}
        initial={meal}
        basis={{
          ...meal,
          amount: meal.quantity_grams ?? meal.portion_count ?? 1,
        }}
        unitOnly={meal.quantity_grams === null}
        editing
        setBusy={setBusy}
        onSave={async (values) => {
          onSaved(await updateConsumption(meal.id, values));
        }}
      />
    </Dialog>
  );
}
