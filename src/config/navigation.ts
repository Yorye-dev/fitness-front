import { Dumbbell, History, LayoutDashboard, Utensils } from "lucide-react";

// Add an item only when its route is available. Both navigation layouts share this list.
export const navigationItems = [
  { to: "/", label: "dashboard", Icon: LayoutDashboard, end: true },
  { to: "/meals", label: "meals", Icon: Utensils, end: false },
  { to: "/intakes", label: "history", Icon: History, end: false },
  { to: "/training", label: "training", Icon: Dumbbell, end: false },
] as const;
