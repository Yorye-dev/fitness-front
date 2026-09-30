import { useEffect, useReducer, useRef, useState } from "react";
import { getWater } from "./service";
import type { DailyWater } from "./types";
type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: DailyWater };
export function useDailyWater(date: string, userId: string, revision: number) {
  const [version, reload] = useReducer((n: number) => n + 1, 0);
  const key = `${userId}:${date}:${revision}:${version}`;
  const [result, setResult] = useState<{ key: string; state: State }>({
    key,
    state: { status: "loading" },
  });
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    request.current = controller;
    getWater(date, controller.signal)
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
  const setDay = (data: DailyWater) => {
    request.current?.abort();
    setResult({ key, state: { status: "success", data } });
  };
  return {
    state: result.key === key ? result.state : ({ status: "loading" } as State),
    reload,
    setDay,
  };
}
