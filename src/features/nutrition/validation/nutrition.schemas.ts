import { z } from "zod";
import type { Translation } from "@/config/i18n";
import { isDateKey } from "@/lib/date";
import { portionTotalGrams } from "../lib/quantity";

const threeDecimals = (value: number) =>
  Math.abs(value * 1000 - Math.round(value * 1000)) < 0.000001;

export function foodSchema(t: Translation) {
  const macro = z
    .number({ error: t.foodCatalog.unitMacroError })
    .min(0, t.foodCatalog.unitMacroError)
    .lt(100000, t.foodCatalog.unitMacroError)
    .refine(threeDecimals, t.foodCatalog.decimalsError);
  return z
    .object({
      name: z
        .string()
        .trim()
        .refine(
          (value) => value.length > 0 && Array.from(value).length <= 200,
          t.foodCatalog.nameError,
        ),
      nutrition_basis: z.enum(["per_100g", "per_unit"]),
      calories: z
        .number({ error: t.foodCatalog.caloriesError })
        .min(0, t.foodCatalog.caloriesError)
        .lt(100000, t.foodCatalog.caloriesError)
        .refine(threeDecimals, t.foodCatalog.decimalsError),
      protein: macro,
      carbs: macro,
      fat: macro,
    })
    .superRefine((food, context) => {
      if (food.nutrition_basis !== "per_100g") return;
      for (const key of ["protein", "carbs", "fat"] as const) {
        if (food[key] > 100)
          context.addIssue({
            code: "custom",
            path: [key],
            message: t.foodCatalog.macroError,
          });
      }
    });
}

export function intakeSchema(t: Translation) {
  // Inactive fields may be blank; only the selected measurement mode is submitted.
  const draftNumber = z.number().or(z.nan());
  return z
    .object({
      date: z.string().refine(isDateKey, t.foodCatalog.dateError),
      mode: z.enum(["grams", "portions", "units"]),
      quantity_grams: draftNumber,
      portion_count: draftNumber,
      portion_grams: draftNumber,
    })
    .superRefine((values, context) => {
      const valid = (value: number) =>
        Number.isFinite(value) &&
        value >= 0.001 &&
        value <= 1000000 &&
        threeDecimals(value);
      if (values.mode === "grams") {
        if (!valid(values.quantity_grams))
          context.addIssue({
            code: "custom",
            path: ["quantity_grams"],
            message: t.foodCatalog.quantityError,
          });
        return;
      }
      if (!valid(values.portion_count))
        context.addIssue({
          code: "custom",
          path: ["portion_count"],
          message: t.foodCatalog.portionCountError,
        });
      if (values.mode === "units") return;
      if (!valid(values.portion_grams))
        context.addIssue({
          code: "custom",
          path: ["portion_grams"],
          message: t.foodCatalog.quantityError,
        });
      if (
        valid(values.portion_count) &&
        valid(values.portion_grams) &&
        !valid(portionTotalGrams(values.portion_count, values.portion_grams))
      )
        context.addIssue({
          code: "custom",
          path: ["portion_count"],
          message: t.foodCatalog.portionTotalError,
        });
    });
}

export type IntakeValues = z.infer<ReturnType<typeof intakeSchema>>;
