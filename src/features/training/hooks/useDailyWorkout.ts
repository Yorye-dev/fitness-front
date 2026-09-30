import { useEffect, useReducer, useState } from "react";
import { getDailyWorkout } from "../services/training.service";
import type { DailyWorkout } from "../types/training.types";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: DailyWorkout };
export function useDailyWorkout(
  date: string,
  userId: string,
  revision: number,
) {
  const [version, reload] = useReducer((value: number) => value + 1, 0);
  const key = `${userId}:${date}:${revision}:${version}`;
  const [result, setResult] = useState<{ key: string; state: State }>({
    key,
    state: { status: "loading" },
  });
  useEffect(() => {
    const controller = new AbortController();
    getDailyWorkout(date, controller.signal)
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
  const state: State =
    result.key === key ? result.state : { status: "loading" };
  return { state, reload };
}
