export interface DailyGoalRequest {
  weight: number
  goal: string
}

export interface DailyGoalResponse {
  calories: number
  protein: number
  carbs: number
  fat: number
}
