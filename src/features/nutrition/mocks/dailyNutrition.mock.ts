export type MealType =
  | "breakfast"
  | "lunch"
  | "snack"
  | "dinner";

export interface DailyNutrition {
  date: string;

  calories: {
    consumed: number;
    target: number;
  };

  macros: {
    protein: {
      consumed: number;
      target: number;
    };

    carbs: {
      consumed: number;
      target: number;
    };

    fat: {
      consumed: number;
      target: number;
    };
  };

  meals: {
    id: string;
    type: MealType;
    calories: number;
  }[];
}

export const dailyNutritionMock: DailyNutrition = {
  date: "2026-08-28",

  calories: {
    consumed: 1840,
    target: 2300,
  },

  macros: {
    protein: {
      consumed: 132,
      target: 160,
    },

    carbs: {
      consumed: 188,
      target: 250,
    },

    fat: {
      consumed: 54,
      target: 70,
    },
  },

  meals: [
    {
      id: "breakfast",
      type: "breakfast",
      calories: 520,
    },
    {
      id: "lunch",
      type: "lunch",
      calories: 730,
    },
    {
      id: "snack",
      type: "snack",
      calories: 190,
    },
    {
      id: "dinner",
      type: "dinner",
      calories: 400,
    },
  ],
};
