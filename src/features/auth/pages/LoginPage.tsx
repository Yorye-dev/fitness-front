import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  const t = useTranslation();
  const location = useLocation();
  return (
    <div className="auth-card mx-auto max-w-md">
      <h1 className="text-lg font-medium">{t.auth.welcomeBack}</h1>
      <p className="mb-6 mt-1 text-sm leading-relaxed text-text-subtle">
        {t.auth.description}
      </p>
      {location.state?.registered && (
        <p
          role="status"
          className="mb-5 rounded-xl bg-green/10 p-4 text-sm text-green"
        >
          {t.auth.accountCreated}
        </p>
      )}
      <LoginForm />
      <div className="mt-6 border-t border-surface-elevated/50 pt-5 text-center">
        <p className="mb-2 text-xs text-text-subtle">{t.auth.noAccount}</p>
        <Link
          to="/register"
          state={location.state}
          className="secondary-button w-full rounded-lg border-green/30 text-green"
        >
          {t.auth.register}
        </Link>
      </div>
    </div>
  );
}
