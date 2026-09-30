export interface Nutrient {
  consumed: number;
  target: number;
}

export interface FoodInput {
  name: string;
  nutrition_basis: "per_100g" | "per_unit";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Food extends FoodInput {
  id: string;
}

export type ConsumptionQuantityInput =
  | { quantity_grams: number; portion_count?: never; portion_grams?: never }
  | { quantity_grams?: never; portion_count: number; portion_grams?: number };

export type UpdateConsumptionInput = ConsumptionQuantityInput & {
  date: string;
};

export type LogConsumptionInput = UpdateConsumptionInput & {
  id: string;
  meal_id: string;
};

export interface Consumption extends Omit<DailyMeal, "name"> {
  date: string;
}

export interface DailyMeal {
  id: string;
  meal_id: string;
  name: string;
  quantity_grams: number | null;
  portion_count: number | null;
  portion_grams: number | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyNutrition {
  date: string;
  calories: Nutrient;
  macros: { protein: Nutrient; carbs: Nutrient; fat: Nutrient };
  meals: DailyMeal[];
}
