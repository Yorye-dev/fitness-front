import { useAuthStore } from "@/features/auth/stores/auth.store";
import { MacroCard } from "@/features/nutrition/components/MacroCard";
import { dailyNutritionMock } from "@/features/nutrition/mocks/dailyNutrition.mock";
import { useTranslation } from "@/hooks/useTranslation";

export function DashboardPage() {
  const t = useTranslation();

  const user = useAuthStore(
    (state) => state.user,
  );

  const nutrition =
    dailyNutritionMock;

  const getGoalLabel = (
    goal?: string,
  ) => {
    if (!goal) {
      return t.goals.unknown;
    }

    const normalizedGoal = goal
      .replaceAll("_", "")
      .toLowerCase();

    switch (normalizedGoal) {
      case "loseweight":
        return t.goals.loseWeight;

      case "gainmuscle":
        return t.goals.gainMuscle;

      case "maintainweight":
        return t.goals.maintainWeight;

      default:
        return t.goals.unknown;
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <section>
        <p className="text-sm text-text-subtle">
          {
            t.dashboard
              .welcomeBack
          }
          ,
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {user?.username}
        </h1>

        <p className="mt-2 text-sm text-text-subtle">
          {
            t.dashboard
              .nutritionProgress
          }
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:mt-10 xl:grid-cols-4">
        <MacroCard
          name={
            t.macros.calories
          }
          value={
            nutrition.calories
              .consumed
          }
          target={
            nutrition.calories
              .target
          }
          unit={
            t.common.units
              .calories
          }
          ofLabel={t.macros.of}
        />

        <MacroCard
          name={
            t.macros.protein
          }
          value={
            nutrition.macros
              .protein.consumed
          }
          target={
            nutrition.macros
              .protein.target
          }
          unit={
            t.common.units
              .grams
          }
          ofLabel={t.macros.of}
        />

        <MacroCard
          name={
            t.macros.carbs
          }
          value={
            nutrition.macros
              .carbs.consumed
          }
          target={
            nutrition.macros
              .carbs.target
          }
          unit={
            t.common.units
              .grams
          }
          ofLabel={t.macros.of}
        />

        <MacroCard
          name={
            t.macros.fat
          }
          value={
            nutrition.macros
              .fat.consumed
          }
          target={
            nutrition.macros
              .fat.target
          }
          unit={
            t.common.units
              .grams
          }
          ofLabel={t.macros.of}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:mt-8 xl:grid-cols-[2fr_1fr]">
        <article
          className={[
            "rounded-xl",
            "border border-surface-elevated/50",
            "bg-surface/30",
            "p-4 sm:p-6",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">
                {
                  t.dashboard
                    .dailyIntake
                }
              </p>

              <h2 className="mt-2 text-lg font-medium">
                {
                  t.dashboard
                    .todaysNutrition
                }
              </h2>
            </div>

            <span className="font-mono text-xs text-green-light">
              {
                t.dashboard
                  .today
              }
            </span>
          </div>

          <div className="mt-6 divide-y divide-surface-elevated/40">
            {nutrition.meals.map(
              (meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="text-sm">
                    {
                      t.meals[
                        meal.type
                      ]
                    }
                  </span>

                  <span className="font-mono text-sm text-text-subtle">
                    {meal.calories}{" "}
                    {
                      t.common.units
                        .calories
                    }
                  </span>
                </div>
              ),
            )}
          </div>
        </article>

        <article
          className={[
            "rounded-xl",
            "border border-surface-elevated/50",
            "bg-surface/30",
            "p-4 sm:p-6",
          ].join(" ")}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">
            {t.dashboard.goal}
          </p>

          <h2 className="mt-2 text-lg font-medium text-green-light">
            {getGoalLabel(
              user?.goal,
            )}
          </h2>

          <div className="mt-8">
            <p className="text-3xl font-semibold sm:text-4xl">
              {user?.weight}

              <span className="ml-2 text-base font-normal text-text-subtle">
                {
                  t.common.units
                    .kilograms
                }
              </span>
            </p>

            <p className="mt-2 text-sm text-text-subtle">
              {
                t.dashboard
                  .currentBodyWeight
              }
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
