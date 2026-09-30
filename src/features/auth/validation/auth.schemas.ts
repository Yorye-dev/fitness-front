import { z } from "zod";
import type { Translation } from "@/config/i18n";

export const MIN_PASSWORD_LENGTH = 8;
export const passwordHasMinimumLength = (value: string) =>
  Array.from(value).length >= MIN_PASSWORD_LENGTH;

export function loginSchema(t: Translation) {
  // Sign-in must continue accepting existing credentials; creation rules belong to registration.
  return z.object({
    username: z.string().trim().min(1, t.auth.usernameRequired),
    password: z.string().min(1, t.auth.passwordRequired),
  });
}

export function registrationSchema(t: Translation) {
  return z
    .object({
      username: z
        .string()
        .trim()
        .refine((value) => {
          const length = Array.from(value).length;
          return length >= 3 && length <= 50 && /^[\p{L}\p{N}_]+$/u.test(value);
        }, t.auth.usernameRules),
      password: z
        .string()
        .refine(passwordHasMinimumLength, t.auth.passwordLength),
      confirmPassword: z.string().min(1, t.auth.passwordRequired),
      weight: z
        .number({ error: t.auth.weightRange })
        .positive(t.auth.weightRange)
        .max(300, t.auth.weightRange),
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
      sex: z.enum(["male", "female"], { error: t.auth.selectRequired }),
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
    })
    .refine((value) => value.password === value.confirmPassword, {
      path: ["confirmPassword"],
      message: t.auth.passwordMismatch,
    });
}

export type RegistrationValues = z.infer<ReturnType<typeof registrationSchema>>;
