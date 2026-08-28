import { Logo } from "@/components/ui/Logo";
import { useTranslation } from "@/hooks/useTranslation";

import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  const t = useTranslation();

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col items-center text-center">
        <Logo className="mb-5 h-24 w-24 object-contain" />

        <h1 className="text-2xl font-semibold tracking-tight">
          {t.app.name}
        </h1>

        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-text-subtle">
          {t.app.tagline}
        </p>
      </div>

      <div className="rounded-2xl border border-surface-elevated/70 bg-surface/35 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            {t.auth.welcomeBack}
          </h2>

          <p className="mt-1 text-sm text-text-subtle">
            {t.auth.description}
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
