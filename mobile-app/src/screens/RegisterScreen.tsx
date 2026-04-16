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
import { apiRequest } from "../config/http";
import type { ThemeColors } from "../theme/colors";

type Props = {
  onNavigate: (screen: "login" | "register" | "verify") => void;
};

export function RegisterScreen({ onNavigate }: Props) {
  const { colors, mode } = useTheme();
  const { width, height } = useWindowDimensions();
  const isWideLayout = width >= 900;
  const isMobileLandscape = Platform.OS !== "web" && width > height;
  const isMobilePortrait = Platform.OS !== "web" && height >= width;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const styles = useMemo(
    () => createStyles(colors, isWideLayout, isMobileLandscape, isMobilePortrait),
    [colors, isWideLayout, isMobileLandscape, isMobilePortrait]
  );

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setRegisterSuccess(false);
    setLoading(true);
    try {
      const result = await apiRequest(`${AUTH_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      if (!result.ok) {
        throw new Error(result.error || "Failed to register");
      }

      setRegisterSuccess(true);
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
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
            <Text style={styles.title}>Create your account</Text>

            <TextInput
              placeholder="First name"
              placeholderTextColor={colors.mutetext}
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />

            <TextInput
              placeholder="Last name"
              placeholderTextColor={colors.mutetext}
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.mutetext}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.mutetext}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              style={({ hovered, pressed }: any) => [
                styles.button,
                (hovered || pressed) && styles.buttonInteractive,
                loading && styles.buttonDisabled
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {({ hovered, pressed }: any) => {
                const isInteractive = hovered || pressed;
                const useLightInvert = mode === "light" && isInteractive;
                return loading ? (
                  <ActivityIndicator color={useLightInvert ? colors.accent : "#fff"} />
                ) : (
                  <Text style={[styles.buttonText, useLightInvert && styles.buttonTextLightInteractive]}>Create Account</Text>
                );
              }}
            </Pressable>

            {registerSuccess && (
              <Text style={styles.successText}>
                Account created! Please check your email and verify your account before logging in.
              </Text>
            )}

            <Pressable
              style={({ hovered, pressed }: any) => [styles.linkButton, (hovered || pressed) && styles.linkButtonInteractive]}
              onPress={() => onNavigate("login")}
            >
              <Text style={styles.link}>Already have an account? Login</Text>
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
    successText: {
      marginTop: 8,
      color: colors.text,
      fontSize: 14,
      fontWeight: "500",
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
    }
  });
}