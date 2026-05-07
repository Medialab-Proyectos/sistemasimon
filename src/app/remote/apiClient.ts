import type { GetAuthHeaders, ScadaModuleConfig } from "./contracts";

export interface ApiClient {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
  delete<T>(path: string, init?: RequestInit): Promise<T>;
}

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function resolveUrl(apiBaseUrl: string | null | undefined, path: string) {
  if (!apiBaseUrl) {
    return path;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return joinUrl(apiBaseUrl, path);
}

function resolveUrlFromConfig(config: ScadaModuleConfig | undefined, path: string) {
  if (!path) return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("ws://") ||
    path.startsWith("wss://")
  ) {
    return path;
  }
  if (config?.resolveApiUrl) {
    return config.resolveApiUrl(path);
  }
  return resolveUrl(config?.apiBaseUrl, path);
}

function withJsonHeaders(
  base: HeadersInit | undefined,
  extra: HeadersInit | undefined,
) {
  const headers = new Headers(base ?? {});
  new Headers(extra ?? {}).forEach((value, key) => headers.set(key, value));
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
}

async function fetchJsonOrThrow<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${text}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  const text = await response.text().catch(() => "");
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export function createApiClient(config?: ScadaModuleConfig): ApiClient {
  const getAuthHeaders: GetAuthHeaders | undefined = config?.getAuthHeaders;

  return {
    async get<T>(path: string, init?: RequestInit) {
      const url = resolveUrlFromConfig(config, path);
      const headers = withJsonHeaders(init?.headers, getAuthHeaders?.());
      return await fetchJsonOrThrow<T>(url, { ...init, method: "GET", headers });
    },
    async post<T>(path: string, body?: unknown, init?: RequestInit) {
      const url = resolveUrlFromConfig(config, path);
      const headers = withJsonHeaders(init?.headers, getAuthHeaders?.());
      return await fetchJsonOrThrow<T>(url, {
        ...init,
        method: "POST",
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    },
    async put<T>(path: string, body?: unknown, init?: RequestInit) {
      const url = resolveUrlFromConfig(config, path);
      const headers = withJsonHeaders(init?.headers, getAuthHeaders?.());
      return await fetchJsonOrThrow<T>(url, {
        ...init,
        method: "PUT",
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    },
    async delete<T>(path: string, init?: RequestInit) {
      const url = resolveUrlFromConfig(config, path);
      const headers = withJsonHeaders(init?.headers, getAuthHeaders?.());
      return await fetchJsonOrThrow<T>(url, { ...init, method: "DELETE", headers });
    },
  };
}

