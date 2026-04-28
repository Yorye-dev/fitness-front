import { DailyGoalRequest, DailyGoalResponse } from "../types"

const API_URL = "http://localhost:3000"

export async function getDailyGoal(
  data: DailyGoalRequest
): Promise<DailyGoalResponse> {
  const res = await fetch(`${API_URL}/daily-goal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Error al calcular calorías")
  }

  return res.json()
}
