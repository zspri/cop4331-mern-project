import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { ThemeColors } from "../../theme/colors";
import { Workout } from "./workoutTypes";

type Props = {
  workout: Workout;
  onBack: () => void;
  onEdit: (w: Workout) => void;
  onDelete: (w: Workout) => void;
};

function StatPill({ label, value, styles }: { label: string; value: string; styles: any }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statPillLabel}>{label}</Text>
      <Text style={styles.statPillValue}>{value}</Text>
    </View>
  );
}

export function WorkoutDetailScreen({ workout, onBack, onEdit, onDelete }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <Pressable onPress={onBack} style={({ hovered, pressed }: any) => [styles.backBtn, (hovered || pressed) && styles.backBtnInteractive]}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>{workout.name}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{workout.category || "General"}</Text>
          </View>
          <Text style={styles.metaDate}>
            {new Date(workout.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {!!workout.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          Exercises ({workout.exercises.length})
        </Text>

        {workout.exercises.length === 0 ? (
          <Text style={styles.emptySubtext}>No exercises logged</Text>
        ) : (
          workout.exercises.map((ex, idx) => (
            <View key={ex._id ?? idx} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{ex.exerciseName}</Text>
              <View style={styles.exerciseStats}>
                <StatPill label="Sets" value={String(ex.sets)} styles={styles} />
                <StatPill label="Reps" value={String(ex.reps)} styles={styles} />
                <StatPill label="Weight" value={`${ex.weight}kg`} styles={styles} />
                <StatPill label="Rest" value={`${ex.restTime}s`} styles={styles} />
              </View>
            </View>
          ))
        )}

        <View style={styles.actionRow}>
          <Pressable style={({ hovered, pressed }: any) => [styles.editActionBtn, hovered && styles.editActionBtnHover, pressed && styles.editActionBtnPressed]} onPress={() => onEdit(workout)}>
            <Text style={styles.editActionText}>Edit Workout</Text>
          </Pressable>
          <Pressable style={({ hovered, pressed }: any) => [styles.deleteActionBtn, hovered && styles.deleteActionBtnHover, pressed && styles.deleteActionBtnPressed]} onPress={() => onDelete(workout)}>
            <Text style={styles.deleteActionText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollContainer: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, flexGrow: 1 },
    content: { width: "100%", maxWidth: 900, alignSelf: "center", flex: 1 },
    backBtn: { marginBottom: 12 },
    backBtnInteractive: { opacity: 0.75 },
    backBtnText: { color: colors.accent, fontSize: 15, fontWeight: "700" },
    title: { fontSize: 24, fontWeight: "800", color: colors.text },
    badgeRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6, marginBottom: 14 },
    badge: { backgroundColor: colors.accentSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { color: colors.accent, fontWeight: "700", fontSize: 13 },
    metaDate: { fontSize: 12, color: colors.mutetext },
    notesCard: { backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
    notesLabel: { fontSize: 12, fontWeight: "700", color: colors.mutetext, textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.4 },
    notesText: { fontSize: 15, color: colors.text, lineHeight: 22 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 10 },
    emptySubtext: { fontSize: 14, color: colors.mutetext },
    exerciseCard: { backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
    exerciseName: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 10 },
    exerciseStats: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    statPill: { backgroundColor: colors.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
    statPillLabel: { fontSize: 10, color: colors.mutetext, fontWeight: "600", textTransform: "uppercase" },
    statPillValue: { fontSize: 14, fontWeight: "800", color: colors.text },
    actionRow: { flexDirection: "row", gap: 12, marginTop: 24 },
    editActionBtn: { flex: 1, backgroundColor: colors.accentSoft, paddingVertical: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: colors.accent + "40" },
    editActionBtnHover: { backgroundColor: colors.tileHover, borderColor: colors.accent + "55" },
    editActionBtnPressed: { backgroundColor: colors.tilePress, borderColor: colors.accent + "70" },
    editActionText: { color: colors.accent, fontWeight: "700", fontSize: 15 },
    deleteActionBtn: { backgroundColor: "#FFF1F2", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "#FECDD3" },
    deleteActionBtnHover: { backgroundColor: "#FFE4E8", borderColor: "#FDA4AF" },
    deleteActionBtnPressed: { backgroundColor: "#FFD5DD", borderColor: "#FB7185" },
    deleteActionText: { color: "#E11D48", fontWeight: "700", fontSize: 15 },
  });
}
