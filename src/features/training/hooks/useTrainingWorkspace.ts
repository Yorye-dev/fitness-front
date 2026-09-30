import { useEffect, useReducer, useState } from "react";
import { getTrainingWorkspace } from "../services/training.service";
import type { TrainingWorkspace } from "../types/training.types";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: TrainingWorkspace };
export function useTrainingWorkspace(userId: string) {
  const [revision, reload] = useReducer((value: number) => value + 1, 0);
  const key = `${userId}:${revision}`;
  const [result, setResult] = useState<{ key: string; state: State }>({
    key,
    state: { status: "loading" },
  });
  useEffect(() => {
    const controller = new AbortController();
    getTrainingWorkspace(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setResult({ key, state: { status: "success", data } });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ key, state: { status: "error" } });
      });
    return () => controller.abort();
  }, [key]);
  const state: State =
    result.key === key ? result.state : { status: "loading" };
  return { state, reload };
}
