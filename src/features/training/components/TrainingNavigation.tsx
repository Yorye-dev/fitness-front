import { NavLink } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export function TrainingNavigation() {
  const t = useTranslation();
  return (
    <nav
      aria-label={t.navigation.training}
      className="flex gap-1 border-b border-surface-elevated/50"
    >
      {[
        { to: "/training", label: t.trainingProgress.routinesTab },
        { to: "/training/progress", label: t.trainingProgress.tab },
      ].map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            `border-b-2 px-4 py-3 text-sm transition ${isActive ? "border-green text-green" : "border-transparent text-text-subtle hover:text-text"}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
