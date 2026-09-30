import { z } from "zod";
import type { Translation } from "@/config/i18n";

export function routineSchema(t: Translation) {
  const optionalNumber = z.number({ error: t.training.numberError }).nullable();
  const exercise = z
    .object({
      name: z
        .string()
        .trim()
        .min(1, t.training.nameError)
        .refine((v) => Array.from(v).length <= 200, t.training.nameError),
      modality: z.enum(["strength", "cardio", "mobility"]),
      target_sets: z
        .number({ error: t.training.setsError })
        .int(t.training.setsError)
        .min(1, t.training.setsError)
        .max(100, t.training.setsError),
      target_reps_min: optionalNumber,
      target_reps_max: optionalNumber,
      target_load_kg: optionalNumber,
      target_duration_seconds: optionalNumber,
      rest_seconds: z
        .number({ error: t.training.restError })
        .int(t.training.restError)
        .min(0, t.training.restError)
        .max(3600, t.training.restError),
      notes: z
        .string()
        .trim()
        .refine((v) => Array.from(v).length <= 1000, t.training.notesError),
    })
    .superRefine((value, context) => {
      const error = (path: string, message: string) =>
        context.addIssue({ code: "custom", path: [path], message });
      if (value.modality === "strength") {
        const min = value.target_reps_min,
          max = value.target_reps_max;
        if (min === null || !Number.isInteger(min) || min < 1 || min > 1000)
          error("target_reps_min", t.training.repsError);
        if (
          max === null ||
          !Number.isInteger(max) ||
          max < 1 ||
          max > 1000 ||
          (min !== null && max < min)
        )
          error("target_reps_max", t.training.repsError);
        const load = value.target_load_kg;
        if (
          load !== null &&
          (load < 0 ||
            load >= 100000 ||
            Math.abs(load * 1000 - Math.round(load * 1000)) >= 0.000001)
        )
          error("target_load_kg", t.training.loadError);
      } else {
        const duration = value.target_duration_seconds;
        if (
          duration === null ||
          !Number.isInteger(duration) ||
          duration < 1 ||
          duration > 86400
        )
          error("target_duration_seconds", t.training.durationError);
      }
    });
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t.training.nameError)
      .refine((v) => Array.from(v).length <= 200, t.training.nameError),
    description: z
      .string()
      .trim()
      .refine((v) => Array.from(v).length <= 2000, t.training.descriptionError),
    exercises: z
      .array(exercise)
      .min(1, t.training.exerciseCountError)
      .max(50, t.training.exerciseCountError),
  });
}
