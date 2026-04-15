import Constants from "expo-constants";
import { Platform } from "react-native";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function normalizeHost(hostUri: string): string {
  const withoutProtocol = hostUri.replace(/^https?:\/\//, "");
  const firstSegment = withoutProtocol.split("/")[0] || "";

  // Handle bracketed IPv6 host, e.g. [::1]:8081
  if (firstSegment.startsWith("[")) {
    const end = firstSegment.indexOf("]");
    if (end > 0) {
      return firstSegment.slice(1, end);
    }
  }

  return firstSegment.split(":")[0] || "";
}

function isLoopbackHost(host: string): boolean {
  const normalized = host.toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "::1";
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

  const host = normalizeHost(hostUri);
  if (!host) {
    return null;
  }

  // Android emulator cannot reach localhost on the dev machine directly.
  if (Platform.OS === "android" && isLoopbackHost(host)) {
    return "http://10.0.2.2:5001";
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

/**
 * `path` should be the URL path, e.g. `/auth`.
 * returns the full endpoint URL, e.g. http://localhost:5001/api/auth.
 */
export function resolveApiEndpoint(path: string): string {
  return `${resolveApiBaseUrl()}/api${path}`
}

export const API_BASE_URL = resolveApiBaseUrl();
export const AUTH_API_URL = resolveApiEndpoint('/auth');
