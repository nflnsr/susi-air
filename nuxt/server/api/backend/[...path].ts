import {
  createError,
  defineEventHandler,
  getCookie,
  getQuery,
  getRequestHeader,
  getRequestProtocol,
  getRouterParam,
  readBody,
  setCookie,
} from "h3";

type LoginResponse = {
  data?: {
    token?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const path = getRouterParam(event, "path");

  if (!path) {
    throw createError({ statusCode: 400, statusMessage: "API path is required." });
  }

  const isLoginRequest = event.method === "POST" && path === "auth/login";
  const token = getCookie(event, config.authCookieName);
  const headers: Record<string, string> = {};
  const contentType = getRequestHeader(event, "content-type");

  if (contentType) {
    headers["content-type"] = contentType;
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await $fetch<LoginResponse>(`/${path}`, {
    baseURL: config.apiBaseUrl,
    method: event.method,
    query: getQuery(event),
    body: ["GET", "HEAD"].includes(event.method) ? undefined : await readBody(event),
    headers,
  });

  if (!isLoginRequest) {
    return response;
  }

  const responseToken = response.data?.token;
  if (!responseToken) {
    throw createError({
      statusCode: 502,
      statusMessage: "Login response did not contain data.token.",
    });
  }

  setCookie(event, config.authCookieName, responseToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: getRequestProtocol(event) === "https",
    path: "/",
  });

  const { token: _token, ...safeData } = response.data || {};
  return { ...response, data: safeData };
});
