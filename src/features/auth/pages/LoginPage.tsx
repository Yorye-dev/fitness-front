import { Link } from "react-router-dom";

import logo from "../../../assets/logos/logo-dark.svg";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center text-center">
        <img
          src={logo}
          alt="FitNess"
          className="mb-5 h-24 w-24 object-contain"
        />

        <h1 className="text-2xl font-semibold tracking-tight">
          FitNess
        </h1>

        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-text-subtle">
          Your body. Your data.
        </p>
      </div>

      <div className="rounded-xl border border-surface-elevated/70 bg-surface/40 p-6 shadow-2xl backdrop-blur-sm">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Welcome back
          </h2>

          <p className="mt-1 text-sm text-text-subtle">
            Sign in to continue your progress.
          </p>
        </div>

        <LoginForm />
      </div>

      <p className="text-center text-sm text-text-subtle">
        New to FitNess?{" "}
        <Link
          to="/register"
          className="font-medium text-yellow-light transition-colors hover:text-yellow"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
