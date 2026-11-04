<template>
  <section class="summary-grid" aria-label="Flight hour limits">
    <article
      v-for="(item, index) in limitSummary"
      :key="item.key"
      :class="['summary-card', `accent-${accents[index]}`, { 'is-over-limit': item.percentage > 100 }]"
    >
      <div class="card-label">{{ item.label }}</div>
      <div class="metric-row">
        <strong>{{ item.hours.toFixed(1) }}</strong
        ><span>hrs</span>
      </div>
      <p class="muted">of {{ item.limit }} hrs · {{ item.window }}</p>
      <div class="progress-track">
        <span :style="{ width: `${Math.min(item.percentage, 100)}%` }"></span>
      </div>
      <p :class="item.percentage > 100 ? 'warning' : 'positive'">
        {{ item.percentage.toFixed(0) }}% used
      </p>
    </article>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  limitSummary: {
    key: string;
    label: string;
    hours: number;
    limit: number;
    window: string;
    percentage: number;
  }[];
}>();
const accents = ["green", "blue", "orange", "purple"];
</script>
