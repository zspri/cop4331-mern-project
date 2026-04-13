import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { AUTH_API_URL } from "../config/api";
import type { ThemeColors } from "../theme/colors";

type Props = {
  onNavigate: (screen: "login" | "register" | "forgot" | "reset") => void;
};

export function ForgotPasswordScreen({ onNavigate }: Props) {
  const { colors, mode } = useTheme();
  const { width, height } = useWindowDimensions();
  const isWideLayout = width >= 900;
  const isMobileLandscape = Platform.OS !== "web" && width > height;
  const isMobilePortrait = Platform.OS !== "web" && height >= width;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const styles = useMemo(
    () => createStyles(colors, isWideLayout, isMobileLandscape, isMobilePortrait),
    [colors, isWideLayout, isMobileLandscape, isMobilePortrait]
  );

  const handleForgot = async () => {
    if (!email) {
      setForgotError("Invalid Email");
      return;
    }

    setForgotError("");
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset link");
      }

      Alert.alert("PIN Sent", "Check your email for a 6-digit reset PIN.", [
        { text: "OK", onPress: () => onNavigate("reset") }
      ]);
    } catch (error: any) {
      setForgotError("Invalid Email");
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>Forgot password</Text>
            <Text style={styles.description}>
              Enter your email and we will send you a 6-digit reset PIN.
            </Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.mutetext}
              style={styles.input}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (forgotError) setForgotError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Pressable
              style={({ hovered, pressed }: any) => [
                styles.button,
                (hovered || pressed) && styles.buttonInteractive,
                loading && styles.buttonDisabled
              ]}
              onPress={handleForgot}
              disabled={loading}
            >
              {({ hovered, pressed }: any) => {
                const isInteractive = hovered || pressed;
                const useLightInvert = mode === "light" && isInteractive;
                return loading ? (
                  <ActivityIndicator color={useLightInvert ? colors.accent : "#fff"} />
                ) : (
                  <Text style={[styles.buttonText, useLightInvert && styles.buttonTextLightInteractive]}>Send Reset PIN</Text>
                );
              }}
            </Pressable>

            {!!forgotError && <Text style={styles.errorText}>{forgotError}</Text>}

            <Pressable
              style={({ hovered, pressed }: any) => [styles.linkButton, (hovered || pressed) && styles.linkButtonInteractive]}
              onPress={() => onNavigate("login")}
            >
              <Text style={styles.link}>Back to login</Text>
            </Pressable>
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
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8
    },
    description: {
      fontSize: 14,
      color: colors.mutetext,
      marginBottom: 16,
      lineHeight: 20
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
      marginTop: 12
    },
    buttonInteractive: {
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.accent
    },
    buttonDisabled: {
      opacity: 0.7
    },
    buttonText: {
      color: "#fff",
      fontWeight: "700"
    },
    buttonTextLightInteractive: {
      color: colors.accent
    },
    errorText: {
      marginTop: 8,
      color: "#DC2626",
      fontSize: 13,
      fontWeight: "600",
      textAlign: "center"
    },
    linkButton: {
      marginTop: 12
    },
    linkButtonInteractive: {
      opacity: 0.75
    },
    link: {
      color: colors.accent,
      textAlign: "center",
      fontSize: 13,
      opacity: 0.85
    }
  });
}