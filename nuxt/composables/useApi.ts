export function useApi() {
  function proxyPath(path: string) {
    return `/api/backend${path.startsWith("/") ? path : `/${path}`}`;
  }

  async function request<T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) {
    const requestHeaders = import.meta.server ? useRequestHeaders(["cookie"]) : {};

    const response = await $fetch<T | { data: T }>(proxyPath(path), {
      ...options,
      credentials: "include",
      headers: {
        ...requestHeaders,
        ...(options as { headers?: HeadersInit }).headers,
      },
    });

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data !== undefined
    ) {
      return response.data;
    }

    return response as T;
  }

  return { request };
}
