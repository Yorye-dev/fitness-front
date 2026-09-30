import { Archive, Pencil, Search, Utensils } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useFoodCatalog } from "../hooks/useFoodCatalog";
import type { Food } from "../types/nutrition.types";

interface FoodBrowserProps {
  onChoose: (food: Food) => void;
  chooseLabel: string;
  onEdit?: (food: Food) => void;
  onArchive?: (food: Food) => void;
}

export function FoodBrowser({
  onChoose,
  chooseLabel,
  onEdit,
  onArchive,
}: FoodBrowserProps) {
  const t = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const format = (value: number) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(value);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const state = useFoodCatalog(page, query.trim(), revision);
  const pagination =
    state.status === "success" ? state.result.meta.pagination : null;
  return (
    <div className="space-y-5">
      <Input
        label={t.foodCatalog.search}
        type="search"
        maxLength={200}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
        trailing={
          <Search
            size={17}
            aria-hidden="true"
            className="mr-3 text-text-subtle"
          />
        }
      />
      {state.status === "loading" && (
        <p role="status" className="py-8 text-center text-sm text-text-subtle">
          {t.common.loading}
        </p>
      )}
      {state.status === "error" && (
        <div role="alert" className="space-y-4 py-5 text-sm">
          <p>{t.foodCatalog.loadError}</p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setRevision((value) => value + 1)}
          >
            {t.common.retry}
          </button>
        </div>
      )}
      {state.status === "success" &&
        (state.result.data.length === 0 ? (
          <div className="py-10 text-center">
            <Utensils
              className="mx-auto mb-4 text-green"
              size={27}
              aria-hidden="true"
            />
            <h3 className="font-medium">
              {query ? t.foodCatalog.noResults : t.foodCatalog.empty}
            </h3>
            {!query && (
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-text-subtle">
                {t.foodCatalog.emptyHint}
              </p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-surface-elevated/50">
            {state.result.data.map((food) => (
              <li
                key={food.id}
                className="flex flex-wrap items-center justify-between gap-4 py-5"
              >
                <div className="min-w-0 flex-1 basis-44">
                  <h3 className="break-words font-medium">{food.name}</h3>
                  <p className="mt-1 text-xs text-text-subtle">
                    {food.nutrition_basis === "per_unit"
                      ? t.foodCatalog.perUnit
                      : t.foodCatalog.per100g}{" "}
                    ·{" "}
                    <span className="text-text-muted">
                      {format(food.calories)} kcal
                    </span>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-text-subtle">
                    {t.macros.protein} {format(food.protein)} g ·{" "}
                    {t.macros.carbs} {format(food.carbs)} g · {t.macros.fat}{" "}
                    {format(food.fat)} g
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="secondary-button text-green"
                    onClick={() => onChoose(food)}
                  >
                    {chooseLabel}
                  </button>
                  {onEdit && (
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`${t.foodCatalog.edit}: ${food.name}`}
                      title={t.foodCatalog.edit}
                      onClick={() => onEdit(food)}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                  )}
                  {onArchive && (
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`${t.foodCatalog.archive}: ${food.name}`}
                      title={t.foodCatalog.archive}
                      onClick={() => onArchive(food)}
                    >
                      <Archive size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ))}
      {pagination && pagination.total_pages > 1 && (
        <nav
          aria-label={t.foodCatalog.title}
          className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-elevated/50 pt-4"
        >
          <button
            type="button"
            className="secondary-button"
            disabled={!pagination.prev_page}
            onClick={() => setPage(pagination.prev_page!)}
          >
            {t.common.previous}
          </button>
          <span className="text-xs text-text-subtle">
            {t.common.page} {pagination.page} / {pagination.total_pages}
          </span>
          <button
            type="button"
            className="secondary-button"
            disabled={!pagination.next_page}
            onClick={() => setPage(pagination.next_page!)}
          >
            {t.common.next}
          </button>
        </nav>
      )}
    </div>
  );
}
