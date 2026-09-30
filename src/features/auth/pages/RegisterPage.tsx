import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  const t = useTranslation();
  const location = useLocation();
  return (
    <div className="auth-card mx-auto max-w-2xl">
      <h1 className="text-lg font-medium">{t.auth.registerTitle}</h1>
      <p className="mb-6 mt-1 text-sm leading-relaxed text-text-subtle">
        {t.auth.registerDescription}
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-text-subtle">
        {t.auth.hasAccount}{" "}
        <Link
          to="/login"
          state={location.state}
          className="font-semibold text-green underline-offset-4 hover:underline"
        >
          {t.auth.login}
        </Link>
      </p>
    </div>
  );
}
