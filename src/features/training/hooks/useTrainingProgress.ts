import { useEffect, useReducer, useState } from "react";
import { getTrainingProgress } from "../services/training.service";
import type { TrainingProgress } from "../types/progress.types";
type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: TrainingProgress };
export function useTrainingProgress(
  from: string,
  to: string,
  exerciseId: string | null,
  userId: string,
) {
  const [revision, reload] = useReducer((n: number) => n + 1, 0);
  const key = `${userId}:${from}:${to}:${exerciseId}:${revision}`;
  const [result, setResult] = useState<{ key: string; state: State }>({
    key,
    state: { status: "loading" },
  });
  useEffect(() => {
    const controller = new AbortController();
    getTrainingProgress(from, to, exerciseId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setResult({ key, state: { status: "success", data } });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ key, state: { status: "error" } });
      });
    return () => controller.abort();
  }, [from, to, exerciseId, key]);
  const state: State =
    result.key === key ? result.state : { status: "loading" };
  return { state, reload };
}
