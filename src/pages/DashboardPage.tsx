import { useAuthStore } from "@/features/auth/stores/auth.store";
import { MacroCard } from "@/features/nutrition/components/MacroCard";
import { dailyNutritionMock } from "@/features/nutrition/mocks/dailyNutrition.mock";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const nutrition = dailyNutritionMock;

  return (
    <div className="mx-auto max-w-7xl">
      <section>
        <p className="text-sm text-text-subtle">
          Welcome back,
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {user?.username}
        </h1>

        <p className="mt-2 text-sm text-text-subtle">
          Here's your nutrition progress for today.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MacroCard
          name="Calories"
          value={nutrition.calories.consumed}
          target={nutrition.calories.target}
          unit="kcal"
        />

        <MacroCard
          name="Protein"
          value={nutrition.macros.protein.consumed}
          target={nutrition.macros.protein.target}
          unit="g"
        />

        <MacroCard
          name="Carbs"
          value={nutrition.macros.carbs.consumed}
          target={nutrition.macros.carbs.target}
          unit="g"
        />

        <MacroCard
          name="Fat"
          value={nutrition.macros.fat.consumed}
          target={nutrition.macros.fat.target}
          unit="g"
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <article className="rounded-xl border border-surface-elevated/50 bg-surface/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">
                Daily intake
              </p>

              <h2 className="mt-2 text-lg font-medium">
                Today's nutrition
              </h2>
            </div>

            <span className="font-mono text-xs text-green-light">
              TODAY
            </span>
          </div>

          <div className="mt-6 divide-y divide-surface-elevated/40">
            {nutrition.meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <span className="text-sm">
                  {meal.name}
                </span>

                <span className="font-mono text-sm text-text-subtle">
                  {meal.calories} kcal
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-surface-elevated/50 bg-surface/30 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">
            Goal
          </p>

          <h2 className="mt-2 text-lg font-medium">
            {user?.goal}
          </h2>

          <div className="mt-8">
            <p className="text-4xl font-semibold">
              {user?.weight}

              <span className="ml-2 text-base font-normal text-text-subtle">
                kg
              </span>
            </p>

            <p className="mt-2 text-sm text-text-subtle">
              Current body weight
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
