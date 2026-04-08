export type Meal = {
  _id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  date: string;
  createdAt: string;
};

export type NutritionSubView = "list" | "add" | "edit" | "view" | "graph";

export const PROTEIN_GOAL = 150;
export const CALORIES_GOAL = 2500;

import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001/api/meals"
    : "http://localhost:5001/api/meals";

export const authHeaders = (token: string | null): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
