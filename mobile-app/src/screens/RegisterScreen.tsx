import React, { useMemo } from "react";
import { Platform, Pressable, View, Text, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

type Props = {
    onNavigate: (screen: "login" | "register" | "forgot" | "reset") => void;
  onRegisterSuccess: () => void;
};

export function RegisterScreen({ onNavigate, onRegisterSuccess }: Props) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const isWideLayout = width >= 900;
  const isMobileLandscape = Platform.OS !== "web" && width > height;
  const isMobilePortrait = Platform.OS !== "web" && height >= width;

  const styles = useMemo(
    () => createStyles(colors, isWideLayout, isMobileLandscape, isMobilePortrait),
    [colors, isWideLayout, isMobileLandscape, isMobilePortrait]
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isWideLayout ? (
          <View style={styles.heroPane}>
            <Text style={styles.heroBrand}>MuscleMeter+</Text>
            <Text style={styles.heroTagline}>Train smarter. Recover better.</Text>
          </View>
        ) : (
          <View style={styles.heroCompact}>
            <Text style={styles.brand}>MuscleMeter+</Text>
            <Text style={styles.tagline}>Train smarter. Recover better.</Text>
          </View>
        )}

        <View style={styles.formPane}>
          <View style={styles.card}>
            <Text style={styles.title}>Create your account</Text>

          <TextInput
            placeholder="First name"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
          />

          <TextInput
            placeholder="Last name"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.mutetext}
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            style={({ hovered, pressed }) => [
              styles.button,
              (hovered || pressed) && styles.buttonInteractive
            ]}
            onPress={onRegisterSuccess}
          >
            {({ hovered, pressed }) => (
              <Text style={[styles.buttonText, (hovered || pressed) && styles.buttonTextInteractive]}>
                Create Account
              </Text>
            )}
          </Pressable>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => onNavigate("login")}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

function createStyles(
  colors: ThemeColors,
  isWideLayout: boolean,
  isMobileLandscape: boolean,
  isMobilePortrait: boolean
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      justifyContent: "center",
      alignItems: "center"
    },
    content: {
      width: "100%",
      maxWidth: isWideLayout ? 1180 : 420,
      paddingHorizontal: 20,
      paddingVertical: isWideLayout ? 28 : 20,
      flexDirection: isWideLayout ? "row" : "column",
      alignItems: isWideLayout ? "stretch" : "center",
      columnGap: isWideLayout ? 28 : 0
    },
    heroPane: {
      flex: 1,
      justifyContent: "center",
      paddingRight: 14
    },
    heroCompact: {
      alignItems: "center"
    },
    formPane: {
      width: isWideLayout ? 430 : "100%",
      justifyContent: "center"
    },
    brand: {
      fontSize: isMobilePortrait ? 50 : 28,
      fontWeight: "800",
      color: colors.accent
    },
    heroBrand: {
      fontSize: isMobileLandscape ? 55 : 84,
      fontWeight: "900",
      color: colors.accent,
      letterSpacing: -0.7
    },
    heroTagline: {
      marginTop: 8,
      fontSize: isMobileLandscape ? 27 : 42,
      color: colors.mutetext
    },
    tagline: {
      fontSize: isMobilePortrait ? 25 : 14,
      color: colors.mutetext,
      marginBottom: 30
    },
    card: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 16
    },
    input: {
      backgroundColor: colors.bg,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text
    },
    button: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8
    },
    buttonInteractive: {
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.accent
    },
    buttonText: {
      color: "#fff",
      fontWeight: "700"
    },
    buttonTextInteractive: {
      color: colors.accent
    },
    linkButton: {
      marginTop: 12
    },
    link: {
      color: colors.accent,
      textAlign: "center",
      fontSize: 13
    }
  });
}