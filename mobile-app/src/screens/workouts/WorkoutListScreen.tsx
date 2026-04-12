import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Workout, WorkoutSubView } from "./workoutTypes";
import { useTheme } from "../../theme/ThemeContext";
import type { ThemeColors } from "../../theme/colors";

type Props = {
  workouts: Workout[];
  loading: boolean;
  onAdd: () => void;
  onView: (w: Workout) => void;
  onEdit: (w: Workout) => void;
  onProgress: () => void;
};

export function WorkoutListScreen({ workouts, loading, onAdd, onView, onEdit, onProgress }: Props) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const sideGutter = isLandscape ? 96 : 16;
  const contentMaxWidth = isLandscape ? Math.max(1200, width - sideGutter * 2) : 900;

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, sideGutter, contentMaxWidth), [colors, sideGutter, contentMaxWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Workouts</Text>
            <Text style={styles.subtitle}>Your training sessions</Text>
          </View>
          <TouchableOpacity style={styles.graphBtn} onPress={onProgress}>
            <Text style={styles.graphBtnText}>Progress</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Tap "+ Add Workout" to get started</Text>
          </View>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
               <TouchableOpacity style={styles.itemCard} onPress={() => onView(item)}>
                <View style={styles.itemCardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.meta}>
                      {item.category} • {item.exercises.length} exercise
                      {item.exercises.length !== 1 ? "s" : ""}
                    </Text>
                    <Text style={styles.metaDate}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={onAdd}>
          <Text style={styles.fabText}>+ Add Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, sideGutter: number, contentMaxWidth: number) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: sideGutter, paddingTop: 8, paddingBottom: 24 },
    content: { width: "100%", maxWidth: contentMaxWidth, alignSelf: "center", flex: 1 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    title: { fontSize: 24, fontWeight: "800", color: colors.text },
    subtitle: { marginTop: 4, fontSize: 15, color: colors.mutetext },
    graphBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.accent + "40" },
    graphBtnText: { color: colors.accent, fontWeight: "700", fontSize: 14 },
    emptyState: { alignItems: "center", marginTop: 60, gap: 8 },
    emptyText: { fontSize: 18, fontWeight: "700", color: colors.text },
    emptySubtext: { fontSize: 14, color: colors.mutetext, textAlign: "center" },
    list: { gap: 14, paddingBottom: 80 },
    itemCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 16, paddingHorizontal: 18, borderLeftWidth: 4, borderLeftColor: colors.accent },
    itemCardRow: { flexDirection: "row", alignItems: "center" },
    itemTitle: { fontSize: 18, color: colors.text, fontWeight: "800" },
    meta: { fontSize: 13, color: colors.mutetext, marginTop: 4 },
    metaDate: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
    editBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: colors.accent + "40" },
    editBtnText: { color: colors.accent, fontWeight: "700", fontSize: 13 },
    fab: { position: "absolute", bottom: 16, right: 0, left: 0, backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    fabText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  });
}
