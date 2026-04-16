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

import { resolveApiEndpoint } from "../../config/api";

export const API_URL = resolveApiEndpoint("/meals");

export const authHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
