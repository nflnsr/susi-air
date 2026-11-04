<template>
  <main class="signin-page">
    <section class="signin-visual">
      <div class="signin-brand">
        <img
          class="brand-logo"
          src="https://www.susiair.com/_nuxt/icons/icon_512x512.ba1a46.png"
          alt="Susi Air"
        /><strong>SUSI AIR</strong>
      </div>
      <div class="visual-copy">
        <p class="eyebrow">Pilot operations portal</p>
        <h1>Fly with confidence.</h1>
        <p>Everything you need to stay flight-ready, in one place.</p>
      </div>
      <div class="flight-path"><span class="plane">✈</span><i></i><i></i><i></i></div>
      <span class="visual-code">SUSI / OPS / 01</span>
    </section>
    <section class="signin-form-wrap">
      <div class="signin-form">
        <div class="mobile-brand">
          <img
            class="brand-logo"
            src="https://www.susiair.com/_nuxt/icons/icon_512x512.ba1a46.png"
            alt="Susi Air"
          /><strong>SUSI AIR</strong>
        </div>
        <p class="eyebrow">Welcome back</p>
        <h2>Sign in to your account</h2>
        <p class="signin-subtitle">Access your schedules, flight hours, and documents.</p>
        <form @submit.prevent="auth.signIn">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="auth.username"
            type="text"
            placeholder="Enter your username"
            required
          />
          <div class="label-row">
            <label for="password">Password</label><a href="#">Forgot password?</a>
          </div>
          <div class="password-field">
            <input
              id="password"
              v-model="auth.password"
              :type="auth.showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              required
            /><button
              type="button"
              aria-label="Toggle password visibility"
              @click="auth.showPassword = !auth.showPassword"
            >
              {{ auth.showPassword ? "Hide" : "Show" }}
            </button>
          </div>
          <label class="remember"
            ><input v-model="auth.remember" type="checkbox" /><span>Remember me</span></label
          >
          <p v-if="auth.errorMessage" class="form-error" role="alert">{{ auth.errorMessage }}</p>
          <button class="signin-button" type="submit" :disabled="auth.isSubmitting">
            {{ auth.isSubmitting ? "Signing in…" : "Sign in" }}
            <span v-if="!auth.isSubmitting">→</span>
          </button>
        </form>
        <p class="signin-help">Need help? <a href="#">Contact operations support</a></p>
      </div>
      <p class="legal">© 2026 Susi Air · Internal use only</p>
    </section>
  </main>
</template>

<script setup lang="ts">
const auth = useAuthStore();
</script>
