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
    name: string;
    calories: number;
  }[];
}

export const dailyNutritionMock: DailyNutrition = {
  date: "2026-08-24",

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
      name: "Breakfast",
      calories: 520,
    },
    {
      id: "lunch",
      name: "Lunch",
      calories: 730,
    },
    {
      id: "snack",
      name: "Snack",
      calories: 190,
    },
    {
      id: "dinner",
      name: "Dinner",
      calories: 400,
    },
  ],
};
