import { useState } from "react"
import { getDailyGoal } from "./services/caloriesApi"
import { DailyGoalResponse } from "./types"

export function useCalories() {
  const [result, setResult] = useState<DailyGoalResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const calculate = async (data: any) => {
    setLoading(true)
    try {
      const res = await getDailyGoal(data)
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, calculate }
}
