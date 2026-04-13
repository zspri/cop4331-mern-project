import React, { useState, useEffect, useCallback } from "react";
import { Alert, Platform } from "react-native";
import { MealListScreen } from "./nutrition/MealListScreen";
import { MealDetailScreen } from "./nutrition/MealDetailScreen";
import { MealFormScreen } from "./nutrition/MealFormScreen";
import { NutritionProgressScreen } from "./nutrition/NutritionProgressScreen";
import { Meal, NutritionSubView, authHeaders } from "./nutrition/nutritionTypes";
import type { ThemeMode } from "../theme/colors";
import { resolveApiEndpoint } from "../config/api";

const API_URL = resolveApiEndpoint("/meals");

type Props = {
  token: string | null;
  currentUser: any;
  mode: ThemeMode;
  onToggleTheme: () => void;
};

export function NutritionScreen({ token, currentUser, mode, onToggleTheme }: Props) {
  const [subView, setSubView] = useState<NutritionSubView>("list");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);

  const [formName, setFormName] = useState("");
  const [formCalories, setFormCalories] = useState("");
  const [formProtein, setFormProtein] = useState("");
  const [formCarbs, setFormCarbs] = useState("");
  const [formFats, setFormFats] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchMeals = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: authHeaders(token) });
      const data = await res.json();
      if (res.ok) setMeals(data);
      else Alert.alert("Error", data.error || "Failed to load meals");
    } catch {
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (subView === "list") fetchMeals();
  }, [subView, fetchMeals]);

  const resetForm = () => {
    setFormName("");
    setFormCalories("");
    setFormProtein("");
    setFormCarbs("");
    setFormFats("");
    setFormDate(new Date().toISOString().split("T")[0]);
  };

  const openAdd = () => { resetForm(); setSubView("add"); };

  const openEdit = (m: Meal) => {
    setFormName(m.name);
    setFormCalories(String(m.calories));
    setFormProtein(String(m.proteinG));
    setFormCarbs(String(m.carbsG));
    setFormFats(String(m.fatsG));
    setFormDate(m.date);
    setSelectedMeal(m);
    setSubView("edit");
  };

  const openView = (m: Meal) => { setSelectedMeal(m); setSubView("view"); };

  const handleAdd = async () => {
    if (!formName.trim()) { Alert.alert("Error", "Meal name is required"); return; }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          name: formName.trim(),
          calories: parseFloat(formCalories) || 0,
          proteinG: parseFloat(formProtein) || 0,
          carbsG: parseFloat(formCarbs) || 0,
          fatsG: parseFloat(formFats) || 0,
          date: formDate,
        }),
      });
      const data = await res.json();
      if (res.ok) setSubView("list");
      else Alert.alert("Error", data.error || "Failed to add meal");
    } catch {
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedMeal || !formName.trim()) { Alert.alert("Error", "Meal name is required"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${selectedMeal._id}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify({
          name: formName.trim(),
          calories: parseFloat(formCalories) || 0,
          proteinG: parseFloat(formProtein) || 0,
          carbsG: parseFloat(formCarbs) || 0,
          fatsG: parseFloat(formFats) || 0,
          date: formDate,
        }),
      });
      const data = await res.json();
      if (res.ok) setSubView("list");
      else Alert.alert("Error", data.error || "Failed to update meal");
    } catch {
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (m: Meal) => {
    try {
      const res = await fetch(`${API_URL}/${m._id}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });
      if (res.ok) {
        setMeals((prev) => prev.filter((item) => item._id !== m._id));
        setSelectedMeal(null);
        setSubView("list");
      } else {
        const data = await res.json();
        Alert.alert("Error", data.error || "Failed to delete");
      }
    } catch {
      Alert.alert("Error", "Could not connect to server");
    }
  };

  if (subView === "list")
    return (
      <MealListScreen
        meals={meals}
        loading={loading}
        onAdd={openAdd}
        onView={openView}
        onEdit={openEdit}
        onProgress={() => setSubView("graph")}
        mode={mode}
        onToggleTheme={onToggleTheme}
      />
    );

  if (subView === "view" && selectedMeal)
    return (
      <MealDetailScreen
        meal={selectedMeal}
        onBack={() => setSubView("list")}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    );

  if (subView === "add" || subView === "edit")
    return (
      <MealFormScreen
        isEdit={subView === "edit"}
        loading={loading}
        formName={formName}
        formCalories={formCalories}
        formProtein={formProtein}
        formCarbs={formCarbs}
        formFats={formFats}
        formDate={formDate}
        onChangeName={setFormName}
        onChangeCalories={setFormCalories}
        onChangeProtein={setFormProtein}
        onChangeCarbs={setFormCarbs}
        onChangeFats={setFormFats}
        onChangeDate={setFormDate}
        onSubmit={subView === "edit" ? handleEdit : handleAdd}
        onBack={() => setSubView("list")}
      />
    );

  if (subView === "graph")
    return <NutritionProgressScreen meals={meals} onBack={() => setSubView("list")} />;

  return null;
}