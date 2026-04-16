import { Platform } from "react-native";

const DEFAULT_HOSTED_API_BASE_URL = "https://cop4331mern.zachspri.ng";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function mapLoopbackForAndroid(rawBaseUrl: string): string {
  if (Platform.OS !== "android") {
    return rawBaseUrl;
  }

  try {
    const parsed = new URL(rawBaseUrl);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "::1") {
      parsed.hostname = "10.0.2.2";
      return parsed.toString();
    }
    return rawBaseUrl;
  } catch {
    return rawBaseUrl;
  }
}

function resolveApiBaseUrl(): string {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envBaseUrl) {
    return trimTrailingSlash(mapLoopbackForAndroid(envBaseUrl));
  }

  // Hosted API is the default so demos run without a local backend.
  return DEFAULT_HOSTED_API_BASE_URL;
}

/**
 * `path` should be the URL path, e.g. `/auth`.
 * returns the full endpoint URL, e.g. https://cop4331mern.zachspri.ng/api/auth.
 */
export function resolveApiEndpoint(path: string): string {
  return `${resolveApiBaseUrl()}/api${path}`;
}

export const API_BASE_URL = resolveApiBaseUrl();
export const AUTH_API_URL = resolveApiEndpoint('/auth');
