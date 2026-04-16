import { resolveApiEndpoint } from "../../config/api";

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

export const API_URL = resolveApiEndpoint("");

export const authHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
