import {
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { PreferencesMenu } from "@/components/preferences/PreferencesMenu";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTranslation } from "@/hooks/useTranslation";

export function AppLayout() {
  const t = useTranslation();

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const userInitial =
    user?.username
      ?.charAt(0)
      .toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Desktop sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0",
          "hidden w-64",
          "border-r border-surface-elevated/50",
          "bg-bg-deep",
          "lg:flex lg:flex-col",
        ].join(" ")}
      >
        <div className="flex h-20 items-center gap-3 px-6">
          <Logo className="h-10 w-10 object-contain" />

          <span className="text-lg font-semibold tracking-tight">
            {t.app.name}
          </span>
        </div>

        <nav className="flex-1 px-3 py-6">
          <NavLink
            to="/"
            end
            className={({
              isActive,
            }) =>
              [
                "flex items-center gap-3",
                "rounded-lg px-3 py-2.5",
                "text-sm transition",
                isActive
                  ? "bg-surface text-green-light"
                  : "text-text-subtle hover:bg-surface/50 hover:text-text",
              ].join(" ")
            }
          >
            <LayoutDashboard className="h-4 w-4" />

            {
              t.navigation
                .dashboard
            }
          </NavLink>
        </nav>

        <div className="border-t border-surface-elevated/50 p-4">
          <div className="rounded-lg bg-surface/40 p-3">
            <p className="text-[10px] uppercase tracking-widest text-text-subtle">
              {
                t.account
                  .signedInAs
              }
            </p>

            <p className="mt-1 truncate text-sm font-medium">
              {user?.username}
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className={[
                "mt-3 flex w-full items-center gap-2",
                "rounded-md px-2 py-2",
                "text-xs text-text-subtle",
                "transition",
                "hover:bg-bg/50 hover:text-red-light",
              ].join(" ")}
            >
              <LogOut className="h-4 w-4" />

              {
                t.account
                  .logout
              }
            </button>
          </div>
        </div>
      </aside>

      {/* Application */}
      <div className="min-h-screen lg:pl-64">
        <header
          className={[
            "sticky top-0 z-30",
            "flex h-16 items-center justify-between",
            "border-b border-surface-elevated/40",
            "bg-bg/90",
            "px-4 backdrop-blur-md",
            "sm:px-6",
            "lg:h-20 lg:px-10",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 object-contain lg:hidden" />

            <p className="text-[10px] uppercase tracking-[0.25em] text-green-light sm:text-xs">
              {t.app.systemName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PreferencesMenu />

            <div
              className={[
                "flex h-10 w-10",
                "items-center justify-center",
                "rounded-lg",
                "border border-surface-elevated/60",
                "bg-surface/40",
                "text-sm font-medium",
              ].join(" ")}
            >
              {userInitial}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title={
                t.account.logout
              }
              aria-label={
                t.account.logout
              }
              className={[
                "flex h-10 w-10",
                "items-center justify-center",
                "rounded-lg",
                "border border-surface-elevated/60",
                "bg-surface/40",
                "text-text-subtle",
                "transition",
                "hover:text-red-light",
                "lg:hidden",
              ].join(" ")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile navigation */}
      <nav
        className={[
          "fixed inset-x-0 bottom-0 z-40",
          "border-t border-surface-elevated/50",
          "bg-bg-deep/95",
          "pb-[env(safe-area-inset-bottom)]",
          "backdrop-blur-md",
          "lg:hidden",
        ].join(" ")}
      >
        <div className="mx-auto flex h-16 max-w-md items-center justify-around">
          <NavLink
            to="/"
            end
            className={({
              isActive,
            }) =>
              [
                "flex flex-col",
                "items-center justify-center",
                "gap-1 rounded-lg",
                "px-6 py-2",
                "text-[10px]",
                isActive
                  ? "text-green-light"
                  : "text-text-subtle",
              ].join(" ")
            }
          >
            <LayoutDashboard className="h-5 w-5" />

            {
              t.navigation
                .dashboard
            }
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
