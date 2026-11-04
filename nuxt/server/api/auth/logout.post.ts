import { defineEventHandler, getRequestProtocol, setCookie } from "h3";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);

  setCookie(event, config.authCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: getRequestProtocol(event) === "https",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return { success: true };
});
