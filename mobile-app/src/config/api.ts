import Constants from "expo-constants";
import { Platform } from "react-native";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function getExpoHostBaseUrl(): string | null {
  const constantsAny = Constants as any;
  const hostUri =
    constantsAny?.expoConfig?.hostUri ||
    constantsAny?.manifest2?.extra?.expoClient?.hostUri ||
    constantsAny?.manifest?.debuggerHost ||
    constantsAny?.manifest2?.extra?.expoGo?.debuggerHost;

  if (!hostUri || typeof hostUri !== "string") {
    return null;
  }

  const host = hostUri.split(":")[0];
  if (!host) {
    return null;
  }

  return `http://${host}:5001`;
}

function resolveApiBaseUrl(): string {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envBaseUrl) {
    return trimTrailingSlash(envBaseUrl);
  }

  if (Platform.OS === "web") {
    return "http://localhost:5001";
  }

  const expoBaseUrl = getExpoHostBaseUrl();
  if (expoBaseUrl) {
    return expoBaseUrl;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5001";
  }

  return "http://localhost:5001";
}

export const API_BASE_URL = resolveApiBaseUrl();
export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
