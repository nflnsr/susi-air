<template>
  <aside class="sidebar">
    <NuxtLink class="brand" to="/" aria-label="Susi Air home">
      <img
        class="brand-logo"
        src="https://www.susiair.com/_nuxt/icons/icon_512x512.ba1a46.png"
        alt="Susi Air"
      />
      <span class="brand-copy">
        <strong>SUSI AIR</strong>
        <small>Flight operations</small>
      </span>
    </NuxtLink>

    <nav class="main-nav" aria-label="Main navigation">
      <NuxtLink
        v-for="item in navigation"
        :key="item.label"
        :to="item.to"
        :class="['nav-item', { active: isActive(item.to) }]"
      >
        <span class="nav-icon" aria-hidden="true">
          <svg v-if="item.icon === 'home'" viewBox="0 0 24 24" fill="none">
            <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9Z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M8 3v4M16 3v4M4 10h16" />
          </svg>
        </span>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
    <button
      class="nav-item logout-button"
      type="button"
      aria-label="Sign out"
      :disabled="auth.isLoggingOut"
      @click="auth.logout"
    >
      <span class="nav-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
          <path d="m14 8 4 4-4 4M9 12h9" />
        </svg>
      </span>
      <span>{{ auth.isLoggingOut ? "Signing out…" : "Sign out" }}</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const route = useRoute();
const navigation = [
  { label: "Home", to: "/", icon: "home" },
  { label: "Schedule", to: "/schedule", icon: "schedule" },
];

function isActive(path: string) {
  return path === "/" ? route.path === "/" : route.path === path;
}
</script>
