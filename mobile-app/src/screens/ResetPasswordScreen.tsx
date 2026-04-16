import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { AUTH_API_URL } from "../config/api";
import type { ThemeColors } from "../theme/colors";

type Props = {
  onNavigate: (screen: "login" | "register" | "verify" | "forgot-password" | "reset-password") => void;
};

export function ResetPasswordScreen({ onNavigate }: Props) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = (): string | null => {
    if (!pin.trim()) return "Please enter the 6-digit PIN from your email.";
    if (pin.trim().length !== 6) return "PIN must be exactly 6 digits.";
    if (!password) return "Please enter a new password.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim(), password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brand}>MuscleMeter+</Text>
        <Text style={styles.tagline}>Train smarter. Recover better.</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>

          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successTitle}>Password Updated!</Text>
              <Text style={styles.successBody}>
                Your password has been reset successfully. You can now log in with your new password.
              </Text>

              <Pressable
                style={({ hovered, pressed }: any) => [
                  styles.button,
                  (hovered || pressed) && styles.buttonInteractive
                ]}
                onPress={() => onNavigate("login")}
              >
                {({ hovered, pressed }: any) => (
                  <Text
                    style={[
                      styles.buttonText,
                      mode === "light" && (hovered || pressed) && styles.buttonTextLightInteractive
                    ]}
                  >
                    Go to Login →
                  </Text>
                )}
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.description}>
                Enter the 6-digit PIN we sent to your email and choose a new password.
              </Text>

              <Text style={styles.label}>Reset PIN</Text>
              <TextInput
                placeholder="6-digit PIN"
                placeholderTextColor={colors.mutetext}
                style={styles.input}
                value={pin}
                onChangeText={(v) => {
                  setPin(v.replace(/\D/g, "").slice(0, 6));
                  if (error) setError("");
                }}
                keyboardType="number-pad"
                maxLength={6}
                autoCorrect={false}
              />

              <Text style={styles.label}>New Password</Text>
              <TextInput
                placeholder="At least 8 characters"
                placeholderTextColor={colors.mutetext}
                style={styles.input}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (error) setError("");
                }}
                secureTextEntry
              />

              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                placeholder="Re-enter new password"
                placeholderTextColor={colors.mutetext}
                style={styles.input}
                value={confirmPassword}
                onChangeText={(v) => {
                  setConfirmPassword(v);
                  if (error) setError("");
                }}
                secureTextEntry
              />

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <Pressable
                style={({ hovered, pressed }: any) => [
                  styles.button,
                  (hovered || pressed) && styles.buttonInteractive,
                  loading && styles.buttonDisabled
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {({ hovered, pressed }: any) => {
                  const isInteractive = hovered || pressed;
                  const useLightInvert = mode === "light" && isInteractive;
                  return loading ? (
                    <ActivityIndicator color={useLightInvert ? colors.accent : "#fff"} />
                  ) : (
                    <Text
                      style={[
                        styles.buttonText,
                        useLightInvert && styles.buttonTextLightInteractive
                      ]}
                    >
                      Reset Password
                    </Text>
                  );
                }}
              </Pressable>
            </>
          )}

          {!success && (
            <Pressable
              style={({ hovered, pressed }: any) => [
                styles.linkButton,
                (hovered || pressed) && styles.linkButtonInteractive
              ]}
              onPress={() => onNavigate("forgot-password")}
            >
              <Text style={styles.link}>← Request a new PIN</Text>
            </Pressable>
          )}

          <Pressable
            style={({ hovered, pressed }: any) => [
              styles.linkButton,
              (hovered || pressed) && styles.linkButtonInteractive
            ]}
            onPress={() => onNavigate("login")}
          >
            <Text style={[styles.link, { opacity: 0.7 }]}>Back to login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      justifyContent: "center",
      alignItems: "center"
    },
    content: {
      width: "100%",
      maxWidth: 420,
      padding: 20,
      alignItems: "center"
    },
    brand: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.accent
    },
    tagline: {
      fontSize: 14,
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
      marginBottom: 8
    },
    description: {
      fontSize: 14,
      color: colors.mutetext,
      marginBottom: 16,
      lineHeight: 20
    },
    label: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.mutetext,
      marginBottom: 4
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
      color: "#DC2626",
      fontSize: 13,
      fontWeight: "600",
      marginTop: 4,
      marginBottom: 4,
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
      fontSize: 13
    },
    successBox: {
      alignItems: "center",
      paddingVertical: 8
    },
    successIcon: {
      fontSize: 40,
      marginBottom: 10
    },
    successTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8
    },
    successBody: {
      fontSize: 14,
      color: colors.mutetext,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 16
    }
  });
}
