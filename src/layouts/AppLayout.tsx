import {
  Dumbbell,
  LayoutDashboard,
  Salad,
  Target,
  User,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import logo from "@/assets/logos/logo-dark.svg";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Nutrition",
    href: "/nutrition",
    icon: Salad,
  },
  {
    name: "Workouts",
    href: "/workouts",
    icon: Dumbbell,
  },
  {
    name: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function AppLayout() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-surface-elevated/50 bg-bg-deep lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 px-6">
          <img
            src={logo}
            alt="FitNess"
            className="h-10 w-10 object-contain"
          />

          <span className="text-lg font-semibold tracking-tight">
            FitNess
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                    isActive
                      ? "bg-surface text-green-light"
                      : "text-text-subtle hover:bg-surface/50 hover:text-text",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />

                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-surface-elevated/50 p-4">
          <div className="rounded-lg bg-surface/40 px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-text-subtle">
              Signed in as
            </p>

            <p className="mt-1 truncate text-sm font-medium">
              {user?.username}
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-elevated/40 bg-bg/90 px-4 backdrop-blur-md sm:px-6 lg:h-20 lg:px-10">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <img
              src={logo}
              alt="FitNess"
              className="h-8 w-8 object-contain lg:hidden"
            />

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-green-light sm:text-xs">
                FitNess OS
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-elevated bg-surface text-sm font-medium">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-elevated/50 bg-bg-deep/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  [
                    "flex min-w-14 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[10px] transition",
                    isActive
                      ? "text-green-light"
                      : "text-text-subtle",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
