import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { ThemeColors } from "../../theme/colors";
import { Exercise } from "./workoutTypes";

type Props = {
  isEdit: boolean;
  loading: boolean;
  formName: string;
  formCategory: string;
  formNotes: string;
  formExercises: Exercise[];
  onChangeName: (v: string) => void;
  onChangeCategory: (v: string) => void;
  onChangeNotes: (v: string) => void;
  onUpdateExercise: (idx: number, field: keyof Exercise, value: string) => void;
  onAddExercise: () => void;
  onRemoveExercise: (idx: number) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function WorkoutFormScreen({
  isEdit, loading, formName, formCategory, formNotes, formExercises,
  onChangeName, onChangeCategory, onChangeNotes,
  onUpdateExercise, onAddExercise, onRemoveExercise, onSubmit, onBack,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{isEdit ? "Edit Workout" : "New Workout"}</Text>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Workout Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Monday Push Day"
            placeholderTextColor={colors.mutetext}
            value={formName}
            onChangeText={onChangeName}
          />
          <Text style={styles.fieldLabel}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Strength, Cardio, HIIT"
            placeholderTextColor={colors.mutetext}
            value={formCategory}
            onChangeText={onChangeCategory}
          />
          <Text style={styles.fieldLabel}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional notes..."
            placeholderTextColor={colors.mutetext}
            value={formNotes}
            onChangeText={onChangeNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <Text style={styles.sectionTitle}>Exercises</Text>

        {formExercises.map((ex, idx) => (
          <View key={idx} style={styles.exerciseFormCard}>
            <View style={styles.exerciseFormHeader}>
              <Text style={styles.exerciseFormTitle}>Exercise {idx + 1}</Text>
              <TouchableOpacity onPress={() => onRemoveExercise(idx)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Exercise name"
              placeholderTextColor={colors.mutetext}
              value={ex.exerciseName}
              onChangeText={(v) => onUpdateExercise(idx, "exerciseName", v)}
            />
            <View style={styles.exerciseFormRow}>
              {(["sets", "reps", "weight", "restTime"] as (keyof Exercise)[]).map((field) => (
                <View key={field} style={styles.exerciseFormField}>
                  <Text style={styles.fieldLabel}>
                    {field === "restTime" ? "Rest (s)" : field === "weight" ? "Weight (kg)" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholderTextColor={colors.mutetext}
                    value={String(ex[field])}
                    onChangeText={(v) => onUpdateExercise(idx, field, v)}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addExerciseBtn} onPress={onAddExercise}>
          <Text style={styles.addExerciseBtnText}>+ Add Exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>{isEdit ? "Save Changes" : "Create Workout"}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollContainer: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, flexGrow: 1 },
    content: { width: "100%", maxWidth: 900, alignSelf: "center", flex: 1 },
    backBtn: { marginBottom: 12 },
    backBtnText: { color: colors.accent, fontSize: 15, fontWeight: "700" },
    title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 10 },
    formCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
    fieldLabel: { fontSize: 13, fontWeight: "600", color: colors.mutetext, marginBottom: 4, marginTop: 8 },
    input: { backgroundColor: colors.bg, borderRadius: 10, padding: 12, marginBottom: 4, borderWidth: 1, borderColor: colors.border, color: colors.text, fontSize: 15 },
    textArea: { minHeight: 72, textAlignVertical: "top" },
    exerciseFormCard: { backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
    exerciseFormHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    exerciseFormTitle: { fontWeight: "700", color: colors.text, fontSize: 15 },
    removeText: { color: "#E11D48", fontWeight: "600", fontSize: 13 },
    exerciseFormRow: { flexDirection: "row", gap: 8 },
    exerciseFormField: { flex: 1 },
    addExerciseBtn: { backgroundColor: colors.accentSoft, paddingVertical: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: colors.accent + "40", marginTop: 4, marginBottom: 12 },
    addExerciseBtnText: { color: colors.accent, fontWeight: "700", fontSize: 15 },
    submitBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
    submitBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  });
}
