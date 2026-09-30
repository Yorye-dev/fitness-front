import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useBlocker } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { User } from "@/features/auth/types/auth.types";
import { useTranslation } from "@/hooks/useTranslation";
import { profileDefaults } from "../lib/profile";
import { updateProfile } from "../services/profile.service";
import type { ProfileInput } from "../types/profile.types";
import { profileSchema } from "../validation/profile.schema";

export function ProfileForm({
  user,
  onSaved,
}: {
  user: User;
  onSaved: (user: User) => void;
}) {
  const t = useTranslation();
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema(t)),
    mode: "onTouched",
    defaultValues: profileDefaults(user),
  });
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (isDirty || isSubmitting) &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search),
  );
  useEffect(() => {
    if (!isDirty && !isSubmitting) return;
    const leave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [isDirty, isSubmitting]);
  useEffect(() => {
    if (blocker.state === "blocked" && !isDirty && !isSubmitting)
      blocker.proceed();
  }, [blocker, isDirty, isSubmitting]);
  const submit = async (values: ProfileInput) => {
    setSaved(false);
    clearErrors("root");
    try {
      const updated = await updateProfile(values);
      onSaved(updated);
      reset(profileDefaults(updated));
      setSaved(true);
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        [400, 422].includes(error.response?.status ?? 0)
          ? t.auth.invalidFields
          : t.profile.saveError;
      setError("root", { message });
    }
  };
  return (
    <section className="panel space-y-6">
      <div>
        <h2 className="text-lg font-medium">{t.profile.details}</h2>
        <p className="mt-2 text-sm text-text-subtle">{t.profile.detailsHint}</p>
      </div>
      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        onChange={() => setSaved(false)}
        aria-busy={isSubmitting}
        className="space-y-6"
      >
        <fieldset disabled={isSubmitting} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label={t.auth.weight}
              type="number"
              inputMode="decimal"
              min="0.001"
              max="300"
              step="0.001"
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
          <Select
            label={t.auth.activity}
            required
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
          <Select
            label={t.auth.goal}
            required
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
        </fieldset>
        <p className="rounded-xl border border-green/20 bg-green/5 px-4 py-3 text-xs leading-relaxed text-text-muted">
          {t.profile.goalsHint}
        </p>
        {errors.root?.message && (
          <p role="alert" className="form-error">
            {errors.root.message}
          </p>
        )}
        {saved && (
          <p role="status" className="text-sm text-green">
            {t.profile.saved}
          </p>
        )}
        <div className="flex flex-col gap-3 border-t border-surface-elevated/50 pt-5 sm:flex-row">
          <Button
            type="submit"
            className="sm:w-auto"
            disabled={!isDirty}
            loading={isSubmitting}
            loadingLabel={t.profile.saving}
          >
            {t.profile.save}
          </Button>
          {isDirty && (
            <button
              type="button"
              className="secondary-button"
              disabled={isSubmitting}
              onClick={() => {
                reset();
                setSaved(false);
              }}
            >
              {t.profile.reset}
            </button>
          )}
        </div>
      </form>
      {blocker.state === "blocked" && (
        <Dialog
          title={t.profile.unsavedTitle}
          busy={isSubmitting}
          onClose={() => blocker.reset()}
        >
          <p className="text-sm leading-relaxed text-text-subtle">
            {t.profile.unsavedHint}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="secondary-button"
              disabled={isSubmitting}
              onClick={() => blocker.reset()}
            >
              {t.profile.keepEditing}
            </button>
            <button
              type="button"
              className="secondary-button text-red-light"
              disabled={isSubmitting}
              onClick={() => blocker.proceed()}
            >
              {t.profile.discard}
            </button>
          </div>
        </Dialog>
      )}
    </section>
  );
}
