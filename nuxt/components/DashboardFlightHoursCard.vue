<template>
  <section id="flight-hours" class="panel hours-panel">
    <div class="panel-header">
      <div>
        <p class="eyebrow">Performance</p>
        <h2>Flight hours</h2>
      </div>
      <div class="range-tabs">
        <button
          v-for="range in ranges"
          :key="range"
          :class="{ selected: selectedRange === range }"
          type="button"
          @click="emit('range-change', range)"
        >
          {{ range }}
        </button>
      </div>
    </div>
    <div class="hours-content">
      <div class="hours-total">
        <strong>{{ rangeConfig.limit }}</strong
        ><span>hrs limit</span>
        <div class="limit-bar">
          <span
            :style="{ width: `${Math.min((rangeHours / (rangeConfig.limit || 1)) * 100, 100)}%` }"
          ></span>
        </div>
        <small>{{ rangeHours.toFixed(1) }} hours logged</small>
      </div>
      <div class="bar-chart" aria-label="Flight hours chart">
        <div class="chart-y">
          <span>{{ rangeConfig.max }}</span
          ><span>{{ Math.round(rangeConfig.max * 0.66) }}</span
          ><span>{{ Math.round(rangeConfig.max * 0.33) }}</span
          ><span>0</span>
        </div>
        <div class="bars">
          <span
            class="limit-line"
            :style="{ bottom: `${(rangeConfig.limit / (rangeConfig.max || 1)) * 100}%` }"
            ><i>Limit</i></span
          >
          <div
            v-for="entry in chartEntries"
            :key="entry.date"
            :class="['bar-group', { today: entry.date === today }]"
          >
            <div
              class="bar"
              :class="{ today: entry.date === today }"
              :style="{ height: `${Math.min(Math.max((entry.hours / (rangeConfig.max || 1)) * 100, 2), 100)}%` }"
              :title="`${entry.hours.toFixed(1)} rolling hours on ${entry.date}`"
            ></div>
            <small>{{ chartDate(entry.date) }}</small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RangeKey } from "~/types/dashboard";
defineProps<{
  ranges: RangeKey[];
  selectedRange: RangeKey;
  rangeConfig: { limit: number; max: number };
  rangeHours: number;
  chartEntries: { date: string; hours: number }[];
  today: string;
}>();
const emit = defineEmits<{ "range-change": [range: RangeKey] }>();
function chartDate(value: string) {
  return new Date(`${value}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .replace(",", "");
}
</script>
