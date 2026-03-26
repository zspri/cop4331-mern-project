import { MealEntry, RecoveryEntry, WorkoutEntry } from "../types/models";

export function getReadinessScore(recovery: RecoveryEntry | undefined): number {
  if (!recovery) return 50;

  const sleepComponent = Math.min(recovery.sleepHours / 8, 1) * 40;
  const sorenessPenalty = (recovery.soreness - 1) * 7;
  const stressPenalty = (recovery.stress - 1) * 6;

  return Math.max(0, Math.min(100, Math.round(sleepComponent + 60 - sorenessPenalty - stressPenalty)));
}

export function buildCoachTip(
  workoutsToday: WorkoutEntry[],
  mealsToday: MealEntry[],
  readinessScore: number
): string {
  const totalProtein = mealsToday.reduce((sum, meal) => sum + meal.proteinG, 0);

  if (readinessScore < 55) {
    return "Low readiness today. Swap heavy lifting for mobility + light cardio, then prioritize sleep.";
  }

  if (workoutsToday.length === 0) {
    return "Readiness is solid. Add a 30-45 min workout today to protect your weekly streak.";
  }

  if (totalProtein < 120) {
    return "Workout done. Increase protein in your next meal to support recovery.";
  }

  return "Strong day. Keep hydration high and plan tomorrow's session before bed.";
}
