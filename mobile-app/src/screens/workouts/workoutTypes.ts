export type Exercise = {
  _id?: string;
  exerciseName: string;
  sets: string;
  reps: string;
  weight: string;
  restTime: string;
};

export type Workout = {
  _id: string;
  name: string;
  category: string;
  notes: string;
  exercises: Exercise[];
  createdAt: string;
};

export type WorkoutSubView = "list" | "add" | "edit" | "view" | "graph";

export const API_URL =
  typeof navigator !== "undefined" && navigator.product === "ReactNative"
    ? "http://10.0.2.2:5001/api"
    : "http://localhost:5001/api";

export const authHeaders = (token: string | null): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
