import type { User } from "@/features/auth/types/auth.types";
import type { ProfileInput } from "../types/profile.types";

const activities: Record<string, ProfileInput["activity_level"]> = {
  sedentary: "sedentary",
  lightlyactive: "lightly_active",
  moderatelyactive: "moderately_active",
  veryactive: "very_active",
  extraactive: "extra_active",
};
const goals: Record<string, ProfileInput["goal"]> = {
  loseweight: "lose_weight",
  maintain: "maintain",
  gainmuscle: "gain_muscle",
};
const key = (value: string) => value.replaceAll("_", "").toLowerCase();

// Read responses use PascalCase; write requests require snake_case.
export function profileDefaults(user: User): Partial<ProfileInput> {
  return {
    weight: Number(user.weight.toFixed(3)),
    height: user.height,
    age: user.age,
    activity_level: activities[key(user.activity_level)],
    goal: goals[key(user.goal)],
  };
}
