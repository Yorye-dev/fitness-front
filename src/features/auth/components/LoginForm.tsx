import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useTranslation } from "@/hooks/useTranslation";
import { authErrorMessage } from "@/lib/api/auth-errors";
import { safeReturnPath } from "../lib/redirect";
import { useAuthStore } from "../stores/auth.store";
import type { LoginRequest } from "../types/auth.types";
import { loginSchema } from "../validation/auth.schemas";

export function LoginForm() {
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((state) => state.signIn);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema(t)),
    mode: "onTouched",
    defaultValues: { username: location.state?.username ?? "", password: "" },
  });

  const onSubmit = async (data: LoginRequest) => {
    clearErrors("root");
    try {
      await signIn(data);
      navigate(safeReturnPath(location.state), { replace: true });
    } catch (error) {
      setError("root", { message: authErrorMessage(error, t) });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      aria-busy={isSubmitting}
    >
      <fieldset disabled={isSubmitting} className="space-y-5">
        <Input
          label={t.auth.username}
          placeholder={t.auth.usernamePlaceholder}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          {...register("username")}
          error={errors.username?.message}
        />
        <PasswordInput
          label={t.auth.password}
          placeholder={t.auth.passwordPlaceholder}
          autoComplete="current-password"
          required
          {...register("password")}
          error={errors.password?.message}
        />
      </fieldset>
      {errors.root?.message && (
        <p role="alert" className="form-error">
          {errors.root.message}
        </p>
      )}
      <Button
        type="submit"
        loading={isSubmitting}
        loadingLabel={t.auth.authenticating}
      >
        {t.auth.login}
      </Button>
    </form>
  );
}
