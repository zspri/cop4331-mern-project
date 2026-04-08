import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { colors } from "../theme/colors";

type Props = {
    onNavigate: (screen: "login" | "register" | "forgot" | "reset") => void;
};

// Use 10.0.2.2 for Android emulator localhost, otherwise localhost
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001/api/auth' : 'http://localhost:5001/api/auth';

export function RegisterScreen({onNavigate}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      Alert.alert("Success", "Account created successfully! You can now login.", [
        { text: "OK", onPress: () => onNavigate("login") }
      ]);
      
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
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

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

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
    fontSize: 13
  }
});