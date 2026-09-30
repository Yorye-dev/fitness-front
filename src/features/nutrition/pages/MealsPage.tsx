import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTranslation } from "@/hooks/useTranslation";
import { isDateKey, localDateKey } from "@/lib/date";
import { FoodBrowser } from "../components/FoodBrowser";
import { FoodEditorDialog } from "../components/FoodEditorDialog";
import { LogConsumptionDialog } from "../components/LogConsumptionDialog";
import { nutritionErrorMessage } from "../lib/errors";
import { archiveFood } from "../services/nutrition.service";
import type { Food } from "../types/nutrition.types";

type Action =
  { type: "create" } | { type: "edit" | "archive" | "log"; food: Food } | null;

export function MealsPage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dateParam = params.get("date");
  const date = isDateKey(dateParam) ? dateParam : localDateKey();
  const [action, setAction] = useState<Action>(null);
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const changed = (message: string) => {
    setNotice(message);
    setAction(null);
    setRevision((value) => value + 1);
  };
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">{t.dashboard.dailyIntake}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {t.foodCatalog.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-subtle">
            {t.foodCatalog.description}
          </p>
        </div>
        <Button
          className="w-auto"
          onClick={() => setAction({ type: "create" })}
        >
          <span className="flex items-center justify-center gap-2">
            <Plus size={18} aria-hidden="true" />
            {t.foodCatalog.newFood}
          </span>
        </Button>
      </header>
      {notice && (
        <p
          role="status"
          className="rounded-xl border border-green/30 bg-green/5 px-4 py-3 text-sm text-green"
        >
          {notice}
        </p>
      )}
      <section className="panel">
        <FoodBrowser
          key={revision}
          chooseLabel={t.foodCatalog.log}
          onChoose={(food) => setAction({ type: "log", food })}
          onEdit={(food) => setAction({ type: "edit", food })}
          onArchive={(food) => setAction({ type: "archive", food })}
        />
      </section>
      {(action?.type === "create" || action?.type === "edit") && (
        <FoodEditorDialog
          food={action.type === "edit" ? action.food : undefined}
          onClose={() => setAction(null)}
          onSaved={() => changed(t.foodCatalog.saved)}
        />
      )}
      {action?.type === "log" && (
        <LogConsumptionDialog
          initialFood={action.food}
          date={date}
          onClose={() => setAction(null)}
          onSaved={(entry) =>
            navigate(`/?date=${entry.date}`, { state: { intakeLogged: true } })
          }
        />
      )}
      {action?.type === "archive" && (
        <ConfirmDialog
          title={t.foodCatalog.archiveTitle}
          onClose={() => setAction(null)}
          errorMessage={(error) => nutritionErrorMessage(error, t)}
          onConfirm={async () => {
            await archiveFood(action.food.id);
            changed(t.foodCatalog.archived);
          }}
        >
          <p className="break-words font-medium">{action.food.name}</p>
          <p className="text-sm leading-relaxed text-text-subtle">
            {t.foodCatalog.archiveHint}
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
