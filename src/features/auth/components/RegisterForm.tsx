import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Circle } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/hooks/useTranslation";
import { authErrorMessage } from "@/lib/api/auth-errors";
import { safeReturnPath } from "../lib/redirect";
import { RegistrationCreatedError, useAuthStore } from "../stores/auth.store";
import {
  passwordHasMinimumLength,
  registrationSchema,
  type RegistrationValues,
} from "../validation/auth.schemas";

export function RegisterForm() {
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const signUp = useAuthStore((state) => state.signUp);
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema(t)),
    mode: "onTouched",
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });
  const [password, confirmation] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  });
  const requirements = [
    { label: t.auth.passwordLength, met: passwordHasMinimumLength(password) },
    {
      label: t.auth.passwordsMatch,
      met: !!confirmation && password === confirmation,
    },
  ];
  const onSubmit = async ({
    password: plain_password,
    confirmPassword: _confirmation,
    ...profile
  }: RegistrationValues) => {
    clearErrors("root");
    try {
      await signUp({ ...profile, plain_password });
      navigate(safeReturnPath(location.state), { replace: true });
    } catch (error) {
      if (error instanceof RegistrationCreatedError) {
        navigate("/login", {
          replace: true,
          state: { registered: true, username: profile.username },
        });
        return;
      }
      setError("root", { message: authErrorMessage(error, t, true) });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-7"
      aria-busy={isSubmitting}
    >
      <fieldset disabled={isSubmitting} className="space-y-4">
        <legend className="mb-4 text-xs font-semibold uppercase tracking-widest text-green">
          01 · {t.auth.credentials}
        </legend>
        <Input
          label={t.auth.username}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          hint={t.auth.usernameRules}
          required
          {...register("username")}
          error={errors.username?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordInput
            label={t.auth.password}
            autoComplete="new-password"
            required
            aria-describedby="password-requirements"
            {...register("password")}
            error={errors.password?.message}
          />
          <PasswordInput
            label={t.auth.confirmPassword}
            autoComplete="new-password"
            required
            aria-describedby="password-requirements"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>
        <div
          id="password-requirements"
          className="rounded-xl bg-bg-deep/60 p-3 text-xs"
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {requirements.map(({ label, met }) => (
              <li
                key={label}
                className={`flex items-center gap-2 ${met ? "text-green" : "text-text-subtle"}`}
              >
                {met ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <Circle size={12} aria-hidden="true" />
                )}
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-text-subtle">{t.auth.passwordAdvice}</p>
        </div>
      </fieldset>

      <fieldset
        disabled={isSubmitting}
        className="space-y-4 border-t border-surface-elevated/50 pt-5"
      >
        <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-green">
          02 · {t.auth.profile}
        </legend>
        <p className="text-xs leading-relaxed text-text-subtle">
          {t.auth.profileHint}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label={t.auth.weight}
            type="number"
            inputMode="decimal"
            min="0.001"
            max="300"
            step="any"
            required
            {...register("weight", { valueAsNumber: true })}
            error={errors.weight?.message}
          />
          <Input
            label={t.auth.height}
            type="number"
            inputMode="numeric"
            min="1"
            max="250"
            step="1"
            required
            {...register("height", { valueAsNumber: true })}
            error={errors.height?.message}
          />
          <Input
            label={t.auth.age}
            type="number"
            inputMode="numeric"
            min="1"
            max="120"
            step="1"
            required
            {...register("age", { valueAsNumber: true })}
            error={errors.age?.message}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label={t.auth.sex}
            required
            defaultValue=""
            {...register("sex")}
            error={errors.sex?.message}
          >
            <option value="" disabled>
              {t.auth.selectOption}
            </option>
            <option value="male">{t.auth.male}</option>
            <option value="female">{t.auth.female}</option>
          </Select>
          <Select
            label={t.auth.goal}
            required
            defaultValue=""
            {...register("goal")}
            error={errors.goal?.message}
          >
            <option value="" disabled>
              {t.auth.selectOption}
            </option>
            <option value="lose_weight">{t.goals.loseWeight}</option>
            <option value="maintain">{t.goals.maintainWeight}</option>
            <option value="gain_muscle">{t.goals.gainMuscle}</option>
          </Select>
        </div>
        <Select
          label={t.auth.activity}
          required
          defaultValue=""
          {...register("activity_level")}
          error={errors.activity_level?.message}
        >
          <option value="" disabled>
            {t.auth.selectOption}
          </option>
          <option value="sedentary">{t.auth.sedentary}</option>
          <option value="lightly_active">{t.auth.lightlyActive}</option>
          <option value="moderately_active">{t.auth.moderatelyActive}</option>
          <option value="very_active">{t.auth.veryActive}</option>
          <option value="extra_active">{t.auth.extraActive}</option>
        </Select>
      </fieldset>
      {errors.root?.message && (
        <p role="alert" className="form-error">
          {errors.root.message}
        </p>
      )}
      <Button
        type="submit"
        loading={isSubmitting}
        loadingLabel={t.auth.registering}
      >
        {t.auth.register}
      </Button>
    </form>
  );
}
