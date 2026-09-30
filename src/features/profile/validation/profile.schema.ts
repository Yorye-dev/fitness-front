import { z } from "zod";
import type { Translation } from "@/config/i18n";

export function profileSchema(t: Translation) {
  return z.object({
    weight: z
      .number({ error: t.auth.weightRange })
      .positive(t.auth.weightRange)
      .max(300, t.auth.weightRange)
      .refine(
        (n) => Math.abs(n * 1000 - Math.round(n * 1000)) < 0.000001,
        t.profile.weightPrecision,
      ),
    height: z
      .number({ error: t.auth.heightRange })
      .int(t.auth.heightRange)
      .min(1, t.auth.heightRange)
      .max(250, t.auth.heightRange),
    age: z
      .number({ error: t.auth.ageRange })
      .int(t.auth.ageRange)
      .min(1, t.auth.ageRange)
      .max(120, t.auth.ageRange),
    activity_level: z.enum(
      [
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
        "extra_active",
      ],
      { error: t.auth.selectRequired },
    ),
    goal: z.enum(["lose_weight", "maintain", "gain_muscle"], {
      error: t.auth.selectRequired,
    }),
  });
}
