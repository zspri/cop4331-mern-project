import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { colors } from "../theme/colors";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001/api/meals"
    : "http://localhost:5001/api/meals";

const PROTEIN_GOAL = 150;
const CALORIES_GOAL = 2500;

type Meal = {
  _id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  date: string;
  createdAt: string;
};

type SubView = "list" | "add" | "edit" | "view" | "graph";

type Props = {
  token: string | null;
  currentUser: any;
};

const authHeaders = (token: string | null): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export function NutritionScreen({ token, currentUser }: Props) {
  const [subView, setSubView] = useState<SubView>("list");
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

  if (subView === "list") {
    const today = new Date().toISOString().split("T")[0];
    const todaysMeals = meals.filter((m) => m.date === today);
    const totalCals = todaysMeals.reduce((s, m) => s + m.calories, 0);
    const totalProtein = todaysMeals.reduce((s, m) => s + m.proteinG, 0);

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Nutrition</Text>
              <Text style={styles.subtitle}>Meals and macros</Text>
            </View>
            <TouchableOpacity style={styles.graphBtn} onPress={() => setSubView("graph")}>
              <Text style={styles.graphBtnText}>Progress</Text>
            </TouchableOpacity>
          </View>

          {todaysMeals.length > 0 && (
            <View style={styles.todaySummary}>
              <Text style={styles.todayLabel}>Today</Text>
              <View style={styles.macroRow}>
                <MacroPill label="Calories" value={`${totalCals}`} unit="kcal" />
                <MacroPill label="Protein" value={`${totalProtein}g`} unit={`/ ${PROTEIN_GOAL}g`} />
              </View>
            </View>
          )}

          {loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
          ) : meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No meals logged yet</Text>
              <Text style={styles.emptySubtext}>Tap "+ Log Meal" to get started</Text>
            </View>
          ) : (
            <FlatList
              data={meals}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.itemCard} onPress={() => openView(item)}>
                  <View style={styles.itemCardRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.name}</Text>
                      <Text style={styles.meta}>{item.calories} kcal</Text>
                      <Text style={styles.metaSecondary}>
                        P {item.proteinG}g · C {item.carbsG}g · F {item.fatsG}g
                      </Text>
                      <Text style={styles.metaDate}>{item.date}</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity style={styles.fab} onPress={openAdd}>
            <Text style={styles.fabText}>+ Log Meal</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (subView === "view" && selectedMeal) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setSubView("list")} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedMeal.name}</Text>
          <Text style={styles.metaDate}>{selectedMeal.date}</Text>

          <View style={styles.macroGrid}>
            <MacroCard label="Calories" value={`${selectedMeal.calories}`} unit="kcal" />
            <MacroCard label="Protein" value={`${selectedMeal.proteinG}g`} unit="" />
            <MacroCard label="Carbs" value={`${selectedMeal.carbsG}g`} unit="" />
            <MacroCard label="Fats" value={`${selectedMeal.fatsG}g`} unit="" />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editActionBtn} onPress={() => openEdit(selectedMeal)}>
              <Text style={styles.editActionText}>Edit Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteActionBtn} onPress={() => handleDelete(selectedMeal)}>
              <Text style={styles.deleteActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (subView === "add" || subView === "edit") {
    const isEdit = subView === "edit";
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setSubView("list")} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{isEdit ? "Edit Meal" : "Log Meal"}</Text>

          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Meal Name *</Text>
            <TextInput style={styles.input} placeholder="e.g. Chicken and Rice" placeholderTextColor={colors.mutetext} value={formName} onChangeText={setFormName} />

            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={colors.mutetext} value={formDate} onChangeText={setFormDate} />

            <View style={styles.macroInputRow}>
              <View style={styles.macroInputField}>
                <Text style={styles.fieldLabel}>Calories</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.mutetext} value={formCalories} onChangeText={setFormCalories} />
              </View>
              <View style={styles.macroInputField}>
                <Text style={styles.fieldLabel}>Protein (g)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.mutetext} value={formProtein} onChangeText={setFormProtein} />
              </View>
            </View>
            <View style={styles.macroInputRow}>
              <View style={styles.macroInputField}>
                <Text style={styles.fieldLabel}>Carbs (g)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.mutetext} value={formCarbs} onChangeText={setFormCarbs} />
              </View>
              <View style={styles.macroInputField}>
                <Text style={styles.fieldLabel}>Fats (g)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.mutetext} value={formFats} onChangeText={setFormFats} />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={isEdit ? handleEdit : handleAdd} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>{isEdit ? "Save Changes" : "Log Meal"}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (subView === "graph") {
    return <NutritionProgressGraph meals={meals} onBack={() => setSubView("list")} />;
  }

  return null;
}

function NutritionProgressGraph({ meals, onBack }: { meals: Meal[]; onBack: () => void }) {
  const BAR_MAX_HEIGHT = 120;
  const now = new Date();

  const weeks: { label: string; cals: number; protein: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const weekMeals = meals.filter((m) => {
      const d = new Date(m.date);
      return d >= weekStart && d < weekEnd;
    });
    weeks.push({
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      cals: Math.round(weekMeals.reduce((s, m) => s + m.calories, 0) / 7),
      protein: Math.round(weekMeals.reduce((s, m) => s + m.proteinG, 0) / 7),
    });
  }

  const maxCals = Math.max(...weeks.map((w) => w.cals), CALORIES_GOAL, 1);
  const maxProtein = Math.max(...weeks.map((w) => w.protein), PROTEIN_GOAL, 1);
  const totalMeals = meals.length;
  const avgProtein = meals.length > 0 ? Math.round(meals.reduce((s, m) => s + m.proteinG, 0) / meals.length) : 0;
  const avgCals = meals.length > 0 ? Math.round(meals.reduce((s, m) => s + m.calories, 0) / meals.length) : 0;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nutrition Progress</Text>
        <Text style={styles.subtitle}>Daily averages per week</Text>

        {[
          { title: "Avg. Daily Calories", key: "cals" as const, goal: CALORIES_GOAL, max: maxCals },
          { title: "Avg. Daily Protein (g)", key: "protein" as const, goal: PROTEIN_GOAL, max: maxProtein },
        ].map(({ title, key, goal, max }) => (
          <View key={key} style={styles.graphCard}>
            <Text style={styles.graphTitle}>{title}</Text>
            <View style={styles.goalLabelRow}>
              <View style={styles.goalDash} />
              <Text style={styles.goalLabelText}>Goal: {goal}/day</Text>
            </View>
            <View style={styles.chartArea}>
              <View style={styles.yAxis}>
                {[max, Math.ceil(max / 2), 0].map((v, i) => (
                  <Text key={i} style={styles.yLabel}>{v}</Text>
                ))}
              </View>
              <View style={styles.barsArea}>
                <View style={[styles.goalLine, { bottom: (goal / max) * BAR_MAX_HEIGHT + 24 }]} />
                <View style={styles.barsRow}>
                  {weeks.map((week, idx) => {
                    const count = week[key];
                    const barHeight = (count / max) * BAR_MAX_HEIGHT;
                    const isGoalMet = count >= goal;
                    return (
                      <View key={idx} style={styles.barWrapper}>
                        <Text style={styles.barCount}>{count > 0 ? count : ""}</Text>
                        <View style={[styles.bar, { height: Math.max(barHeight, count > 0 ? 6 : 0), backgroundColor: isGoalMet ? colors.accent : colors.warning }]} />
                        <Text style={styles.barLabel}>{week.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>Goal met</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
                <Text style={styles.legendText}>Below goal</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalMeals}</Text>
            <Text style={styles.statLabel}>Meals Logged</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{avgCals}</Text>
            <Text style={styles.statLabel}>Avg Kcal/Meal</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{avgProtein}g</Text>
            <Text style={styles.statLabel}>Avg Protein</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function MacroPill({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.macroPill}>
      <Text style={styles.macroPillLabel}>{label}</Text>
      <Text style={styles.macroPillValue}>{value} <Text style={styles.macroPillUnit}>{unit}</Text></Text>
    </View>
  );
}

function MacroCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.macroCard}>
      <Text style={styles.macroCardLabel}>{label}</Text>
      <Text style={styles.macroCardValue}>{value}</Text>
      {!!unit && <Text style={styles.macroCardUnit}>{unit}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  scrollContainer: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  content: { width: "100%", maxWidth: 760, alignSelf: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  subtitle: { marginTop: 4, fontSize: 15, color: colors.mutetext, marginBottom: 8 },
  graphBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.accent + "40" },
  graphBtnText: { color: colors.accent, fontWeight: "700", fontSize: 14 },
  todaySummary: { backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  todayLabel: { fontSize: 12, fontWeight: "700", color: colors.mutetext, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 },
  macroRow: { flexDirection: "row", gap: 10 },
  macroPill: { flex: 1, backgroundColor: colors.accentSoft, borderRadius: 10, padding: 10, alignItems: "center" },
  macroPillLabel: { fontSize: 11, color: colors.mutetext, fontWeight: "600", textTransform: "uppercase" },
  macroPillValue: { fontSize: 16, fontWeight: "800", color: colors.accent, marginTop: 2 },
  macroPillUnit: { fontSize: 12, fontWeight: "400", color: colors.mutetext },
  emptyState: { alignItems: "center", marginTop: 60, gap: 8 },
  emptyText: { fontSize: 18, fontWeight: "700", color: colors.text },
  emptySubtext: { fontSize: 14, color: colors.mutetext, textAlign: "center" },
  list: { gap: 14, paddingBottom: 80 },
  itemCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 16, paddingHorizontal: 18, borderLeftWidth: 4, borderLeftColor: colors.accent },
  itemCardRow: { flexDirection: "row", alignItems: "center" },
  itemTitle: { fontSize: 18, color: colors.text, fontWeight: "800" },
  meta: { fontSize: 13, color: colors.mutetext, marginTop: 4 },
  metaSecondary: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
  metaDate: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
  editBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: colors.accent + "40" },
  editBtnText: { color: colors.accent, fontWeight: "700", fontSize: 13 },
  fab: { position: "absolute", bottom: 16, right: 0, left: 0, backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  fabText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  backBtn: { marginBottom: 12 },
  backBtnText: { color: colors.accent, fontSize: 15, fontWeight: "700" },
  macroGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16, marginBottom: 8 },
  macroCard: { width: "47%", backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  macroCardLabel: { fontSize: 12, fontWeight: "700", color: colors.mutetext, textTransform: "uppercase", letterSpacing: 0.4 },
  macroCardValue: { fontSize: 24, fontWeight: "800", color: colors.accent, marginTop: 4 },
  macroCardUnit: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  editActionBtn: { flex: 1, backgroundColor: colors.accentSoft, paddingVertical: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: colors.accent + "40" },
  editActionText: { color: colors.accent, fontWeight: "700", fontSize: 15 },
  deleteActionBtn: { backgroundColor: "#FFF1F2", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "#FECDD3" },
  deleteActionText: { color: "#E11D48", fontWeight: "700", fontSize: 15 },
  formCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: colors.mutetext, marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: colors.bg, borderRadius: 10, padding: 12, marginBottom: 4, borderWidth: 1, borderColor: colors.border, color: colors.text, fontSize: 15 },
  macroInputRow: { flexDirection: "row", gap: 10 },
  macroInputField: { flex: 1 },
  submitBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  submitBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  graphCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  graphTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 8 },
  goalLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  goalDash: { width: 24, height: 2, backgroundColor: colors.warning },
  goalLabelText: { fontSize: 13, color: colors.mutetext, fontWeight: "600" },
  chartArea: { flexDirection: "row", height: 170, alignItems: "flex-end" },
  yAxis: { width: 36, height: 150, justifyContent: "space-between", alignItems: "flex-end", paddingRight: 4 },
  yLabel: { fontSize: 10, color: colors.mutetext },
  barsArea: { flex: 1, position: "relative", height: 150, justifyContent: "flex-end" },
  goalLine: { position: "absolute", left: 0, right: 0, height: 2, backgroundColor: colors.warning, opacity: 0.6, zIndex: 1 },
  barsRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", height: 150, zIndex: 2 },
  barWrapper: { alignItems: "center", flex: 1, gap: 4, justifyContent: "flex-end", paddingBottom: 24 },
  barCount: { fontSize: 10, fontWeight: "700", color: colors.text, marginBottom: 2 },
  bar: { width: 26, borderRadius: 6 },
  barLabel: { fontSize: 9, color: colors.mutetext, position: "absolute", bottom: 4 },
  legend: { flexDirection: "row", gap: 16, marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.mutetext },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 24, fontWeight: "800", color: colors.accent },
  statLabel: { fontSize: 11, color: colors.mutetext, marginTop: 4, textAlign: "center", fontWeight: "600" },
});