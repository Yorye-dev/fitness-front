import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@/components/ui/Dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { newEntryId } from "@/lib/uuid";
import { logConsumption } from "../services/nutrition.service";
import type { Consumption, Food } from "../types/nutrition.types";
import { ConsumptionForm } from "./ConsumptionForm";
import { FoodBrowser } from "./FoodBrowser";

export function LogConsumptionDialog({
  initialFood,
  date,
  onClose,
  onSaved,
}: {
  initialFood?: Food;
  date: string;
  onClose: () => void;
  onSaved: (entry: Consumption) => void;
}) {
  const t = useTranslation();
  const [food, setFood] = useState<Food | null>(initialFood ?? null);
  const [busy, setBusy] = useState(false);
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  return (
    <Dialog title={t.foodCatalog.log} onClose={onClose} busy={busy}>
      {food ? (
        <ConsumptionForm
          key={food.id}
          name={food.name}
          date={date}
          setBusy={setBusy}
          unitOnly={food.nutrition_basis === "per_unit"}
          onChangeFood={() => setFood(null)}
          basis={{
            amount: food.nutrition_basis === "per_unit" ? 1 : 100,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
          }}
          onSave={async (values) => {
            const payload = JSON.stringify({ ...values, meal_id: food.id });
            if (attempt.current?.payload !== payload)
              attempt.current = { payload, id: newEntryId() };
            onSaved(
              await logConsumption({
                ...values,
                meal_id: food.id,
                id: attempt.current.id,
              }),
            );
          }}
        />
      ) : (
        <>
          <FoodBrowser onChoose={setFood} chooseLabel={t.foodCatalog.choose} />
          <Link
            to={`/meals?date=${date}`}
            className="secondary-button mt-5 w-full"
          >
            {t.foodCatalog.goToCatalog}
          </Link>
        </>
      )}
    </Dialog>
  );
}
