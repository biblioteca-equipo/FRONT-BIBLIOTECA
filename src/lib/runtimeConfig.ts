const DEFAULT_API_URL = "http://127.0.0.1:8003"

function normalizedUrl(value: string | undefined): string | undefined {
  const normalized = value?.trim().replace(/\/+$/, "")
  return normalized || undefined
}

export function resolveApiBaseUrl(
  runtimeUrl = window.__APP_CONFIG__?.API_URL,
  buildUrl = import.meta.env.VITE_API_URL,
): string {
  return normalizedUrl(runtimeUrl) ?? normalizedUrl(buildUrl) ?? DEFAULT_API_URL
}
