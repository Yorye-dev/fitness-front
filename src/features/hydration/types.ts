export interface DailyWater {
  date: string;
  goal_ml: number;
  total_ml: number;
  entries: { id: string; amount_ml: number }[];
}
