import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/hooks/useTranslation";

import { useAuthStore } from "../stores/auth.store";

interface LoginFormData {
  username: string;
  password: string;
}

export function LoginForm() {
  const t = useTranslation();

  const navigate = useNavigate();

  const signIn = useAuthStore(
    (state) => state.signIn,
  );

  const loginSchema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(
            1,
            t.auth.usernameRequired,
          ),

        password: z
          .string()
          .min(
            1,
            t.auth.passwordRequired,
          ),
      }),
    [
      t.auth.usernameRequired,
      t.auth.passwordRequired,
    ],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormData,
  ) => {
    try {
      await signIn(data);

      navigate("/", {
        replace: true,
      });
    } catch {
      setError("root", {
        message:
          t.auth.invalidCredentials,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Input
        id="username"
        label={t.auth.username}
        placeholder={
          t.auth.usernamePlaceholder
        }
        autoComplete="username"
        {...register("username")}
        error={
          errors.username?.message
        }
      />

      <Input
        id="password"
        label={t.auth.password}
        type="password"
        placeholder={
          t.auth.passwordPlaceholder
        }
        autoComplete="current-password"
        {...register("password")}
        error={
          errors.password?.message
        }
      />

      {errors.root?.message && (
        <p className="rounded-lg border border-red-light/30 bg-red-light/5 px-3 py-2 text-sm text-red-light">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        loadingLabel={
          t.auth.authenticating
        }
      >
        {t.auth.login}
      </Button>
    </form>
  );
}
