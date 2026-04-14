export type WorkoutType = "strength" | "cardio" | "mobility";

export interface WorkoutEntry {
  id: string;
  date: string; // ISO date
  type: WorkoutType;
  title: string;
  durationMin: number;
  caloriesBurned?: number;
  perceivedEffort: 1 | 2 | 3 | 4 | 5;
}

export interface MealEntry {
  id: string;
  date: string; // ISO date
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  qualityScore: 1 | 2 | 3 | 4 | 5;
}

export interface RecoveryEntry {
  date: string; // ISO date
  sleepHours: number;
  soreness: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
}

export interface UserProfile {
  id: string;
  name: string;
  targetCalories: number;
  targetProteinG: number;
  weeklyWorkoutGoal: number;
}
