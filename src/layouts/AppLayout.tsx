import { LogOut } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PreferencesMenu } from "@/components/preferences/PreferencesMenu";
import { Logo } from "@/components/ui/Logo";
import { navigationItems } from "@/config/navigation";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTranslation } from "@/hooks/useTranslation";

export function AppLayout() {
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentSection = navigationItems.find((item) =>
    item.end
      ? location.pathname === item.to
      : location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`),
  );
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const userInitial = user?.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-bg text-text">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-xl bg-bg px-5 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.common.skipToContent}
      </a>
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-surface-elevated/50 bg-bg-deep lg:flex">
        <div className="flex h-24 items-center gap-3 px-7">
          <Logo className="h-10 w-10" />
          <span className="text-lg font-semibold tracking-tight">
            {t.app.name}
          </span>
        </div>
        <nav aria-label={t.app.name} className="flex-1 space-y-2 px-4 py-5">
          {navigationItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-green/10 text-green" : "text-text-subtle hover:bg-surface/50"}`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {t.navigation[label]}
            </NavLink>
          ))}
        </nav>
        <div className="mx-5 mb-6 border-t border-surface-elevated/50 pt-5">
          <p className="text-xs text-text-subtle">{t.account.signedInAs}</p>
          <p className="mt-1 truncate text-sm font-semibold">
            {user?.username}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm text-text-subtle hover:bg-surface/50 hover:text-red-light"
          >
            <LogOut size={16} aria-hidden="true" />
            {t.account.logout}
          </button>
        </div>
      </aside>
      <div className="min-h-screen lg:pl-60">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-surface-elevated/40 bg-bg/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 lg:hidden" />
            <p className="text-sm font-medium text-text-subtle">
              {location.pathname === "/profile"
                ? t.profile.title
                : currentSection
                  ? t.navigation[currentSection.label]
                  : t.app.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PreferencesMenu />
            <NavLink
              to="/profile"
              title={t.profile.open}
              aria-label={`${t.profile.open}: ${user?.username ?? ""}`}
              className={({ isActive }) =>
                `flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-green/10 text-sm font-semibold text-green transition hover:bg-green/15 ${isActive ? "border-green/40" : "border-transparent"}`
              }
            >
              {userInitial}
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              title={t.account.logout}
              aria-label={t.account.logout}
              className="icon-button lg:hidden"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="px-5 py-8 pb-28 outline-none sm:px-8 lg:px-10 lg:pb-10"
        >
          <Outlet />
        </main>
      </div>
      <nav
        aria-label={t.app.name}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-elevated/50 bg-bg-deep/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto flex h-16 max-w-md items-center justify-around">
          {navigationItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] sm:text-xs ${isActive ? "text-green" : "text-text-subtle"}`
              }
            >
              <Icon size={19} aria-hidden="true" />
              {t.navigation[label]}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
