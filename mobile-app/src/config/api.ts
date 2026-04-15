const DEFAULT_HOSTED_API_BASE_URL = "https://cop4331mern.zachspri.ng";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl(): string {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envBaseUrl) {
    return trimTrailingSlash(envBaseUrl);
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
