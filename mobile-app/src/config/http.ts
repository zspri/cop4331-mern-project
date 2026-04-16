type ApiResult<T = any> = {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
};

const DEFAULT_TIMEOUT_MS = 12000;

function buildTimeoutMessage(timeoutMs: number): string {
  return `Request timed out after ${Math.round(timeoutMs / 1000)}s. Please try again.`;
}

function extractErrorMessage(data: any, fallback: string): string {
  if (data && typeof data === "object") {
    if (typeof data.error === "string" && data.error.trim()) return data.error;
    if (typeof data.message === "string" && data.message.trim()) return data.message;
  }
  if (typeof data === "string" && data.trim()) return data;
  return fallback;
}

export async function apiRequest<T = any>(
  url: string,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") || "";
    let data: any = null;

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await response.text();
        data = text || null;
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data,
        error: extractErrorMessage(data, `Request failed (${response.status}).`),
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
      error: null,
    };
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return {
        ok: false,
        status: 0,
        data: null,
        error: buildTimeoutMessage(timeoutMs),
      };
    }

    return {
      ok: false,
      status: 0,
      data: null,
      error: "Could not connect to server. Please check your connection.",
    };
  } finally {
    clearTimeout(timer);
  }
}
