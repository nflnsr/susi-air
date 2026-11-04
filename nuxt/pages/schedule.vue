<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow">Operations</p>
          <h1>My schedule</h1>
        </div>
        <div class="topbar-actions">
          <button class="icon-button" aria-label="Notifications">
            ♢<span class="notification-dot"></span></button
          ><a class="profile-button" href="/"
            ><span class="avatar small">JD</span><span class="profile-name">John Doe</span
            ><span>⌄</span></a
          >
        </div>
      </header>
      <div class="page-content schedule-page">
        <section class="schedule-hero">
          <div>
            <p class="eyebrow">Your roster</p>
            <h2>Keep your days in sight.</h2>
            <p>Review upcoming duties, training, and leave at a glance.</p>
          </div>
          <button class="export-button" type="button" @click="exportSchedule">
            ↓ Export schedule
          </button>
        </section>
        <p v-if="schedule.isLoading" class="api-state">Loading schedule…</p>
        <p v-if="schedule.apiError" class="api-state form-error" role="alert">
          {{ schedule.apiError }}
        </p>
        <section class="panel full-schedule">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Calendar</p>
              <h2>{{ schedule.monthLabel }}</h2>
            </div>
            <div class="calendar-controls">
              <button
                class="round-button"
                aria-label="Previous month"
                @click="schedule.changeMonth(-1)"
              >
                ‹</button
              ><button class="today-button" type="button" @click="schedule.goToday">Today</button
              ><button
                class="round-button"
                aria-label="Next month"
                @click="schedule.changeMonth(1)"
              >
                ›
              </button>
            </div>
          </div>
          <div class="filter-row">
            <button
              v-for="filter in schedule.filters"
              :key="filter"
              :class="{ selected: schedule.selectedFilter === filter }"
              class="filter-button"
              type="button"
              @click="schedule.selectedFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
          <div class="calendar large-calendar">
            <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
            <div
              v-for="blank in schedule.firstDay"
              :key="`blank-${blank}`"
              class="day-cell empty"
            ></div>
            <button
              v-for="day in schedule.calendarDays"
              :key="day.date"
              :class="[
                'day-cell',
                { today: day.isToday, picked: schedule.selectedDate === day.date },
              ]"
              type="button"
              @click="schedule.selectedDate = day.date"
            >
              <span class="day-number">{{ day.day }}</span
              ><span
                v-if="day.schedule"
                class="duty-pill"
                :style="{ '--duty-color': day.schedule.base_color }"
                ><span
                  >{{ day.schedule.base_name }} ·
                  {{ schedule.dutyLabel(day.schedule.duty_type) }}</span
                ><span
                  v-if="day.schedule.count_logbooks === day.schedule.count_schedules"
                  class="check"
                  >✓</span
                ><span v-else class="count">{{ day.schedule.count_schedules }}</span></span
              ><span v-if="day.schedule" class="day-meta"
                >{{ day.schedule.count_schedules }}
                {{ day.schedule.count_schedules === 1 ? "duty" : "duties" }}</span
              >
            </button>
          </div>
          <div class="legend">
            <span v-for="item in schedule.scheduleData?.legend || []" :key="item.code"
              ><i :style="{ backgroundColor: item.color }"></i>{{ item.label }}</span
            >
          </div>
        </section>
        <section v-if="schedule.selectedDate" class="panel selected-duty">
          <div>
            <p class="eyebrow">Selected date · {{ schedule.selectedDate }}</p>
            <h2>Detail page coming soon</h2>
            <p class="muted">The duty detail screen is not available yet.</p>
          </div>
          <span v-if="schedule.selectedSchedule" class="selected-duty-status"
            >{{ schedule.selectedSchedule.count_logbooks }}/{{
              schedule.selectedSchedule.count_schedules
            }}
            logged</span
          >
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const schedule = useScheduleStore();
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function exportSchedule() {
  window.print();
}
onMounted(() => schedule.loadSchedules());
watch(
  () => schedule.currentMonth.getTime(),
  () => schedule.loadSchedules(),
);
</script>
