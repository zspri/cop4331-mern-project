import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { WorkoutListScreen } from "./workouts/WorkoutListScreen";
import { WorkoutDetailScreen } from "./workouts/WorkoutDetailScreen";
import { WorkoutFormScreen } from "./workouts/WorkoutFormScreen";
import { WorkoutProgressScreen } from "./workouts/WorkoutProgressScreen";
import { Workout, WorkoutSubView, Exercise, authHeaders } from "./workouts/workoutTypes";
import type { ThemeMode } from "../theme/colors";
import { resolveApiEndpoint } from "../config/api";
import { apiRequest } from "../config/http";

const API_URL = resolveApiEndpoint("/workouts");

type Props = {
  token: string | null;
  currentUser: any;
  mode: ThemeMode;
  onToggleTheme: () => void;
};

export function WorkoutsScreen({ token, currentUser, mode, onToggleTheme }: Props) {
  const [subView, setSubView] = useState<WorkoutSubView>("list");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(false);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("General");
  const [formNotes, setFormNotes] = useState("");
  const [formExercises, setFormExercises] = useState<Exercise[]>([]);

  const fetchWorkouts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await apiRequest<Workout[]>(API_URL, { headers: authHeaders(token) });
      if (result.ok && Array.isArray(result.data)) {
        setWorkouts(result.data);
      } else {
        Alert.alert("Error", result.error || "Failed to load workouts");
      }
    } catch {
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (subView === "list") fetchWorkouts();
  }, [subView, fetchWorkouts]);

  const resetForm = () => {
    setFormName("");
    setFormCategory("General");
    setFormNotes("");
    setFormExercises([]);
  };

  const openAdd = () => { resetForm(); setSubView("add"); };

  const openEdit = (w: Workout) => {
    setFormName(w.name);
    setFormCategory(w.category || "General");
    setFormNotes(w.notes || "");
    setFormExercises(
      w.exercises.map((e) => ({
        _id: e._id,
        exerciseName: e.exerciseName,
        sets: String(e.sets),
        reps: String(e.reps),
        weight: String(e.weight ?? 0),
        restTime: String(e.restTime ?? 60),
      }))
    );
    setSelectedWorkout(w);
    setSubView("edit");
  };

  const openView = (w: Workout) => { setSelectedWorkout(w); setSubView("view"); };

  const handleAdd = async () => {
    if (!formName.trim()) { Alert.alert("Error", "Workout name is required"); return; }
    setLoading(true);
    try {
      const result = await apiRequest(API_URL, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          name: formName.trim(),
          category: formCategory.trim(),
          notes: formNotes.trim(),
          exercises: formExercises
            .filter((e) => e.exerciseName.trim())
            .map((e) => ({
              exerciseName: e.exerciseName,
              sets: parseInt(e.sets) || 1,
              reps: parseInt(e.reps) || 1,
              weight: parseFloat(e.weight) || 0,
              restTime: parseInt(e.restTime) || 60,
            })),
        }),
      });
      if (result.ok) { setSubView("list"); }
      else Alert.alert("Error", result.error || "Failed to add workout");
    } catch {
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedWorkout || !formName.trim()) { Alert.alert("Error", "Workout name is required"); return; }
    setLoading(true);
    try {
      const result = await apiRequest(`${API_URL}/${selectedWorkout._id}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify({
          name: formName.trim(),
          category: formCategory.trim(),
          notes: formNotes.trim(),
          exercises: formExercises
            .filter((e) => e.exerciseName.trim())
            .map((e) => ({
              ...(e._id ? { _id: e._id } : {}),
              exerciseName: e.exerciseName,
              sets: parseInt(e.sets) || 1,
              reps: parseInt(e.reps) || 1,
              weight: parseFloat(e.weight) || 0,
              restTime: parseInt(e.restTime) || 60,
            })),
        }),
      });
      if (result.ok) { setSubView("list"); }
      else Alert.alert("Error", result.error || "Failed to update workout");
    } catch {
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (w: Workout) => {
    try {
      const result = await apiRequest(`${API_URL}/${w._id}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });
      if (result.ok) {
        setWorkouts((prev) => prev.filter((item) => item._id !== w._id));
        setSelectedWorkout(null);
        setSubView("list");
      } else {
        Alert.alert("Error", result.error || "Failed to delete");
      }
    } catch {
      Alert.alert("Error", "Could not connect to server");
    }
  };

  const addExerciseRow = () =>
    setFormExercises((prev) => [
      ...prev,
      { exerciseName: "", sets: "3", reps: "10", weight: "0", restTime: "60" },
    ]);

  const updateExerciseRow = (idx: number, field: keyof Exercise, value: string) =>
    setFormExercises((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));

  const removeExerciseRow = (idx: number) =>
    setFormExercises((prev) => prev.filter((_, i) => i !== idx));

  if (subView === "list")
    return (
      <WorkoutListScreen
        workouts={workouts}
        loading={loading}
        onAdd={openAdd}
        onView={openView}
        onEdit={openEdit}
        onProgress={() => setSubView("graph")}
        mode={mode}
        onToggleTheme={onToggleTheme}
      />
    );

  if (subView === "view" && selectedWorkout)
    return (
      <WorkoutDetailScreen
        workout={selectedWorkout}
        onBack={() => setSubView("list")}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    );

  if (subView === "add" || subView === "edit")
    return (
      <WorkoutFormScreen
        isEdit={subView === "edit"}
        loading={loading}
        formName={formName}
        formCategory={formCategory}
        formNotes={formNotes}
        formExercises={formExercises}
        onChangeName={setFormName}
        onChangeCategory={setFormCategory}
        onChangeNotes={setFormNotes}
        onUpdateExercise={updateExerciseRow}
        onAddExercise={addExerciseRow}
        onRemoveExercise={removeExerciseRow}
        onSubmit={subView === "edit" ? handleEdit : handleAdd}
        onBack={() => setSubView("list")}
      />
    );

  if (subView === "graph")
    return (
      <WorkoutProgressScreen
        workouts={workouts}
        onBack={() => setSubView("list")}
        token={token}
      />
    );

  return null;
}