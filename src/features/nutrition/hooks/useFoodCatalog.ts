import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { PaginatedResponse } from "@/lib/api/types";
import { getFoods } from "../services/nutrition.service";
import type { Food } from "../types/nutrition.types";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; result: PaginatedResponse<Food> };

export function useFoodCatalog(page: number, query: string, revision: number) {
  const userId = useAuthStore((state) => state.user?.id);
  const key = JSON.stringify([userId, page, query, revision]);
  const [result, setResult] = useState<{ key: string; state: State }>({
    key,
    state: { status: "loading" },
  });
  useEffect(() => {
    const controller = new AbortController();
    // Debounce search and abort obsolete requests when typing/changing pages.
    const timer = window.setTimeout(() => {
      getFoods(page, query, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted)
            setResult({ key, state: { status: "success", result: data } });
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setResult({ key, state: { status: "error" } });
        });
    }, 200);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [key, page, query]);
  return result.key === key ? result.state : ({ status: "loading" } as State);
}
