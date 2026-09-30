import { ArrowLeft, SlidersHorizontal, UserRound } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { PreferencesFields } from "@/components/preferences/PreferencesFields";
import { getCurrentUser } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { User } from "@/features/auth/types/auth.types";
import { useTranslation } from "@/hooks/useTranslation";
import { ProfileForm } from "../components/ProfileForm";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; user: User };
export function ProfilePage() {
  const t = useTranslation();
  const currentUser = useAuthStore((s) => s.user);
  const replaceCurrentUser = useAuthStore((s) => s.replaceCurrentUser);
  const userId = currentUser?.id ?? "";
  const [revision, reload] = useReducer((n: number) => n + 1, 0);
  const key = `${userId}:${revision}`;
  const [result, setResult] = useState<{ key: string; state: State }>({
    key,
    state: { status: "loading" },
  });
  useEffect(() => {
    const controller = new AbortController();
    getCurrentUser(controller.signal)
      .then((user) => {
        if (!controller.signal.aborted) {
          replaceCurrentUser(user);
          setResult({ key, state: { status: "success", user } });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ key, state: { status: "error" } });
      });
    return () => controller.abort();
  }, [key, replaceCurrentUser]);
  const state: State =
    result.key === key ? result.state : { status: "loading" };
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <header>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-lg py-2 text-xs text-text-subtle hover:text-green"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {t.profile.back}
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {t.profile.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-subtle">
          {t.profile.description}
        </p>
      </header>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div>
          {state.status === "loading" && (
            <p role="status" className="panel text-sm text-text-subtle">
              {t.profile.loading}
            </p>
          )}
          {state.status === "error" && (
            <section role="alert" className="panel space-y-4">
              <p>{t.profile.loadError}</p>
              <button
                type="button"
                className="secondary-button"
                onClick={reload}
              >
                {t.common.retry}
              </button>
            </section>
          )}
          {state.status === "success" && (
            <ProfileForm
              key={state.user.id}
              user={state.user}
              onSaved={(user) => {
                replaceCurrentUser(user);
                setResult({ key, state: { status: "success", user } });
              }}
            />
          )}
        </div>
        <aside className="space-y-5">
          <section className="panel space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-medium">
              <UserRound size={17} className="text-green" aria-hidden="true" />
              {t.profile.identity}
            </h2>
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green/10 text-lg font-medium text-green"
                aria-hidden="true"
              >
                {currentUser?.username.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-text-subtle">{t.auth.username}</p>
                <p className="mt-1 break-words font-medium">
                  {currentUser?.username}
                </p>
              </div>
            </div>
            {currentUser && (
              <dl className="border-t border-surface-elevated/40 pt-4">
                <dt className="text-xs text-text-subtle">{t.auth.sex}</dt>
                <dd className="mt-1 text-sm">
                  {currentUser.sex.toLowerCase() === "male"
                    ? t.auth.male
                    : currentUser.sex.toLowerCase() === "female"
                      ? t.auth.female
                      : "—"}
                </dd>
              </dl>
            )}
          </section>
          <section className="panel space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal
                size={17}
                className="text-green"
                aria-hidden="true"
              />
              {t.profile.appearance}
            </h2>
            <PreferencesFields />
            <p className="text-xs leading-relaxed text-text-subtle">
              {t.profile.preferencesHint}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
