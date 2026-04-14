import { MealEntry, RecoveryEntry, UserProfile, WorkoutEntry } from "../types/models";

export const user: UserProfile = {
  id: "u1",
  name: "David",
  targetCalories: 2500,
  targetProteinG: 180,
  weeklyWorkoutGoal: 5
};

export const workouts: WorkoutEntry[] = [
  {
    id: "w1",
    date: "2026-03-26",
    type: "strength",
    title: "Upper Body Push",
    durationMin: 65,
    caloriesBurned: 420,
    perceivedEffort: 4
  },
  {
    id: "w2",
    date: "2026-03-25",
    type: "cardio",
    title: "Incline Walk",
    durationMin: 30,
    caloriesBurned: 220,
    perceivedEffort: 3
  }
];

export const meals: MealEntry[] = [
  {
    id: "m1",
    date: "2026-03-26",
    name: "Chicken Bowl",
    calories: 710,
    proteinG: 56,
    carbsG: 62,
    fatsG: 21,
    qualityScore: 4
  },
  {
    id: "m2",
    date: "2026-03-26",
    name: "Greek Yogurt + Berries",
    calories: 280,
    proteinG: 27,
    carbsG: 30,
    fatsG: 6,
    qualityScore: 5
  }
];

export const recovery: RecoveryEntry[] = [
  {
    date: "2026-03-26",
    sleepHours: 7.2,
    soreness: 3,
    stress: 2
  }
];
