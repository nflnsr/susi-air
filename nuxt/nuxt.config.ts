export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },

  css: ["~/assets/scss/main.scss"],

  modules: ["@pinia/nuxt"],

  runtimeConfig: {
    apiBaseUrl: "",
    authCookieName: "susi_auth_token",
    public: {
      apiEndpoints: {
        login: "/auth/login",
        profile: "/user/pilot/me",
        flightHours: "/flight-hours/summary",
        documents: "/documents",
        schedules: "/schedules",
      },
    },
  },
});
