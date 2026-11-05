export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();
  const { request } = useApi();

  const isSigninPage = to.path === "/signin";

  try {
    const user = await request<Record<string, unknown>>(config.public.apiEndpoints.profile);

    if (isSigninPage) {
      return navigateTo("/");
    }

    const authStore = useAuthStore();
    authStore.user = user;
  } catch {
    if (!isSigninPage) {
      return navigateTo("/signin");
    }
  }
});
