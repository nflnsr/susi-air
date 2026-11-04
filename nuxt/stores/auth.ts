import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const username = ref("");
  const password = ref("");
  const remember = ref(false);
  const showPassword = ref(false);
  const errorMessage = ref("");
  const isSubmitting = ref(false);
  const isLoggingOut = ref(false);
  const { request } = useApi();
  const config = useRuntimeConfig();

  async function signIn() {
    errorMessage.value = "";
    isSubmitting.value = true;
    try {
      await request(config.public.apiEndpoints.login, {
        method: "POST",
        body: { username: username.value, password: password.value },
      });
      await navigateTo("/");
    } catch (error: unknown) {
      const response = error as { data?: { message?: string }; message?: string };
      errorMessage.value =
        response.data?.message || response.message || "Invalid username or password.";
    } finally {
      isSubmitting.value = false;
    }
  }

  async function logout() {
    isLoggingOut.value = true;
    try {
      await $fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      username.value = "";
      password.value = "";
      remember.value = false;
      errorMessage.value = "";
      await navigateTo("/signin");
    } finally {
      isLoggingOut.value = false;
    }
  }

  return {
    username,
    password,
    remember,
    showPassword,
    errorMessage,
    isSubmitting,
    isLoggingOut,
    signIn,
    logout,
  };
});
