import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ label, value, hint }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4
  },
  label: {
    color: colors.mutetext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700"
  },
  hint: {
    color: colors.mutetext,
    fontSize: 12
  }
});
