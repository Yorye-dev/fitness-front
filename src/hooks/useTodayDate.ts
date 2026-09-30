import { useEffect, useState } from "react";
import { localDateKey } from "@/lib/date";

// A home left open overnight switches to the new local day without deleting history.
export function useTodayDate() {
  const [today, setToday] = useState(localDateKey);
  useEffect(() => {
    const refresh = () => setToday(localDateKey());
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return today;
}
