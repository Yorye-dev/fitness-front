import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/hooks/useTranslation";
import { trainingErrorMessage } from "../lib/errors";
import { saveRoutine } from "../services/training.service";
import type {
  RoutineExercise,
  RoutineInput,
  WorkoutRoutine,
} from "../types/training.types";
import { routineSchema } from "../validation/routine.schema";

const newExercise = (): RoutineExercise => ({
  name: "",
  modality: "strength",
  target_sets: 3,
  target_reps_min: 8,
  target_reps_max: 12,
  target_load_kg: null,
  target_duration_seconds: 60,
  rest_seconds: 90,
  notes: "",
});
const nullableNumber = (value: unknown) =>
  value === "" || value == null ? null : Number(value);

export function RoutineEditorDialog({
  id,
  routine,
  onClose,
  onSaved,
}: {
  id: string;
  routine?: WorkoutRoutine;
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useTranslation();
  const [busy, setBusy] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RoutineInput>({
    resolver: zodResolver(routineSchema(t)),
    mode: "onTouched",
    defaultValues: routine ?? {
      name: "",
      description: "",
      exercises: [newExercise()],
    },
  });
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "exercises",
  });
  const watched = useWatch({ control, name: "exercises" });
  const submit = async (values: RoutineInput) => {
    setBusy(true);
    clearErrors("root");
    try {
      await saveRoutine(id, {
        ...values,
        exercises: values.exercises.map((e) => ({
          ...e,
          target_reps_min: e.modality === "strength" ? e.target_reps_min : null,
          target_reps_max: e.modality === "strength" ? e.target_reps_max : null,
          target_load_kg: e.modality === "strength" ? e.target_load_kg : null,
          target_duration_seconds:
            e.modality === "strength" ? null : e.target_duration_seconds,
        })),
      });
      onSaved();
    } catch (error) {
      setError("root", { message: trainingErrorMessage(error, t) });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      title={routine ? t.training.editRoutine : t.training.newRoutine}
      busy={busy}
      onClose={onClose}
    >
      <form
        noValidate
        onSubmit={(event) => {
          void handleSubmit(submit)(event);
        }}
        className="space-y-5"
      >
        <fieldset disabled={busy} className="space-y-5">
          <Input
            label={t.training.routineName}
            placeholder={t.training.routinePlaceholder}
            required
            maxLength={200}
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label={t.training.descriptionLabel}
            maxLength={2000}
            {...register("description")}
            error={errors.description?.message}
          />
          <p className="text-xs leading-relaxed text-text-subtle">
            {t.training.targetsHint}
          </p>
          <div className="space-y-5">
            {fields.map((field, index) => {
              const e = errors.exercises?.[index];
              const strength =
                (watched[index]?.modality ?? field.modality) === "strength";
              return (
                <section
                  key={field.id}
                  className="space-y-4 rounded-xl border border-surface-elevated/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium">
                      {t.training.exercise} {index + 1}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="icon-button h-9 w-9"
                        aria-label={t.training.moveUp}
                        title={t.training.moveUp}
                        disabled={index === 0}
                        onClick={() => move(index, index - 1)}
                      >
                        <ArrowUp size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="icon-button h-9 w-9"
                        aria-label={t.training.moveDown}
                        title={t.training.moveDown}
                        disabled={index === fields.length - 1}
                        onClick={() => move(index, index + 1)}
                      >
                        <ArrowDown size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="icon-button h-9 w-9 hover:text-red-light"
                        aria-label={t.training.removeExercise}
                        title={t.training.removeExercise}
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <Input
                    label={t.training.exerciseName}
                    placeholder={t.training.exercisePlaceholder}
                    required
                    maxLength={200}
                    {...register(`exercises.${index}.name`)}
                    error={e?.name?.message}
                  />
                  <Select
                    label={t.training.modality}
                    {...register(`exercises.${index}.modality`)}
                  >
                    <option value="strength">
                      {t.training.modalities.strength}
                    </option>
                    <option value="cardio">
                      {t.training.modalities.cardio}
                    </option>
                    <option value="mobility">
                      {t.training.modalities.mobility}
                    </option>
                  </Select>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label={t.training.sets}
                      type="number"
                      min={1}
                      max={100}
                      step={1}
                      required
                      {...register(`exercises.${index}.target_sets`, {
                        valueAsNumber: true,
                      })}
                      error={e?.target_sets?.message}
                    />
                    <Input
                      label={t.training.rest}
                      type="number"
                      min={0}
                      max={3600}
                      step={1}
                      required
                      {...register(`exercises.${index}.rest_seconds`, {
                        valueAsNumber: true,
                      })}
                      error={e?.rest_seconds?.message}
                    />
                    {strength ? (
                      <>
                        <Input
                          label={t.training.repsMin}
                          type="number"
                          min={1}
                          max={1000}
                          step={1}
                          required
                          {...register(`exercises.${index}.target_reps_min`, {
                            setValueAs: nullableNumber,
                          })}
                          error={e?.target_reps_min?.message}
                        />
                        <Input
                          label={t.training.repsMax}
                          type="number"
                          min={1}
                          max={1000}
                          step={1}
                          required
                          {...register(`exercises.${index}.target_reps_max`, {
                            setValueAs: nullableNumber,
                          })}
                          error={e?.target_reps_max?.message}
                        />
                        <Input
                          label={t.training.load}
                          type="number"
                          min={0}
                          max={99999.999}
                          step="0.001"
                          inputMode="decimal"
                          hint={t.training.loadHint}
                          {...register(`exercises.${index}.target_load_kg`, {
                            setValueAs: nullableNumber,
                          })}
                          error={e?.target_load_kg?.message}
                        />
                      </>
                    ) : (
                      <Input
                        label={t.training.duration}
                        type="number"
                        min={1}
                        max={86400}
                        step={1}
                        required
                        {...register(
                          `exercises.${index}.target_duration_seconds`,
                          { setValueAs: nullableNumber },
                        )}
                        error={e?.target_duration_seconds?.message}
                      />
                    )}
                  </div>
                  <Input
                    label={t.training.notes}
                    maxLength={1000}
                    {...register(`exercises.${index}.notes`)}
                    error={e?.notes?.message}
                  />
                </section>
              );
            })}
          </div>
          {errors.exercises?.root?.message && (
            <p role="alert" className="form-error">
              {errors.exercises.root.message}
            </p>
          )}
          <button
            type="button"
            className="secondary-button gap-2"
            disabled={fields.length >= 50}
            onClick={() => append(newExercise())}
          >
            <Plus size={16} aria-hidden="true" />
            {t.training.addExercise}
          </button>
        </fieldset>
        {errors.root?.message && (
          <p role="alert" className="form-error">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" loading={busy} loadingLabel={t.training.saving}>
          {t.training.saveRoutine}
        </Button>
      </form>
    </Dialog>
  );
}
