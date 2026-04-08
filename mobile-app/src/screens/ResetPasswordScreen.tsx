import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { colors } from "../theme/colors";

type Props = {
    onNavigate: (screen: "login" | "register" | "forgot" | "reset") => void;
};

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001/api/auth' : 'http://localhost:5001/api/auth';

export function ResetPasswordScreen({onNavigate}: Props) {
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!pin || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      Alert.alert("Success", "Password reset successfully! You can now login.", [
        { text: "OK", onPress: () => onNavigate("login") }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Invalid or expired PIN.");
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
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.description}>
            Enter your 6-digit PIN and your new password below.
          </Text>

          <TextInput
            placeholder="6-Digit PIN"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={6}
          />

          <TextInput
            placeholder="New password"
            placeholderTextColor={colors.mutetext}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirm new password"
            placeholderTextColor={colors.mutetext}
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => onNavigate("login")}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  linkButton: {
    marginTop: 12
  },
  link: {
    color: colors.accent,
    textAlign: "center",
    fontSize: 13,
    opacity: 0.85
  }
});