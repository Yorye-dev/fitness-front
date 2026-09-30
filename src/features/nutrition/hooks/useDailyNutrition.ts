import { useEffect, useReducer, useState } from "react";
import { getDailyNutrition } from "../services/nutrition.service";
import type { DailyNutrition } from "../types/nutrition.types";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: DailyNutrition };

export function useDailyNutrition(date: string, userId: string) {
  const [version, reload] = useReducer((value: number) => value + 1, 0);
  const key = `${userId}:${date}:${version}`;
  const [result, setResult] = useState<{ key: string; state: LoadState }>({
    key,
    state: { status: "loading" },
  });

  useEffect(() => {
    const controller = new AbortController();
    getDailyNutrition(date, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setResult({ key, state: { status: "success", data } });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ key, state: { status: "error" } });
      });
    return () => controller.abort();
  }, [date, key]);

  // Never show a previous day/user's data during a new request.
  const state: LoadState =
    result.key === key ? result.state : { status: "loading" };
  return { state, reload };
}
