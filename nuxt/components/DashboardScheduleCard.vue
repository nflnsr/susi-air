<template>
  <section id="schedule" class="panel schedule-panel">
    <div class="panel-header">
      <div>
        <p class="eyebrow">Operations</p>
        <h2>Duty schedule</h2>
      </div>
      <div class="calendar-controls">
        <button class="round-button" aria-label="Previous month" @click="emit('month-change', -1)">
          ‹</button
        ><strong>{{ monthLabel }}</strong
        ><button class="round-button" aria-label="Next month" @click="emit('month-change', 1)">
          ›
        </button>
      </div>
    </div>
    <div class="filter-row">
      <button
        v-for="filter in filters"
        :key="filter"
        :class="{ selected: selectedFilter === filter }"
        class="filter-button"
        type="button"
        @click="emit('filter-change', filter)"
      >
        {{ filter }}
      </button>
    </div>
    <div class="calendar">
      <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
      <div v-for="blank in firstDay" :key="`blank-${blank}`" class="day-cell empty"></div>
      <button
        v-for="day in calendarDays"
        :key="day.date"
        :class="['day-cell', { today: day.isToday }]"
        type="button"
        @click="emit('date-select', day.date)"
      >
        <span class="day-number">{{ day.day }}</span
        ><span
          v-if="day.schedule"
          class="duty-pill"
          :style="{ '--duty-color': day.schedule.base_color }"
          ><span>{{ day.schedule.base_name }}</span
          ><span v-if="day.schedule.count_logbooks === day.schedule.count_schedules" class="check"
            >✓</span
          ><span v-else class="count">{{ day.schedule.count_schedules }}</span></span
        >
      </button>
    </div>
    <div class="legend">
      <span v-for="item in legend.slice(0, 6)" :key="item.code"
        ><i :style="{ backgroundColor: item.color }"></i>{{ item.label }}</span
      >
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CalendarDay, ScheduleLegend } from "~/types/dashboard";
defineProps<{
  monthLabel: string;
  filters: string[];
  selectedFilter: string;
  firstDay: number;
  calendarDays: CalendarDay[];
  legend: ScheduleLegend[];
}>();
const emit = defineEmits<{
  "month-change": [offset: number];
  "filter-change": [filter: string];
  "date-select": [date: string];
}>();
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
</script>
