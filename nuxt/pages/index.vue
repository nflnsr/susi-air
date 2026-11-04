<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="content">
      <DashboardHeader />
      <div id="overview" class="page-content">
        <p v-if="dashboard.isLoading" class="api-state">Loading dashboard data…</p>
        <p v-if="dashboard.apiError" class="api-state form-error" role="alert">
          {{ dashboard.apiError }}
        </p>
        <DashboardSummaryCards
          :limit-summary="dashboard.limitSummary"
        />
        <div class="dashboard-grid">
          <DashboardScheduleCard
            :month-label="dashboard.monthLabel"
            :filters="dashboard.filters"
            :selected-filter="dashboard.selectedFilter"
            :first-day="dashboard.firstDay"
            :calendar-days="dashboard.calendarDays"
            :legend="dashboard.scheduleData?.legend || []"
            @month-change="dashboard.changeMonth"
            @filter-change="dashboard.selectFilter"
            @date-select="dashboard.selectDate"
          />
          <DashboardDocumentsCard :documents="dashboard.documentsWithStatus" />
        </div>
        <DashboardFlightHoursCard
          :ranges="dashboard.ranges"
          :selected-range="dashboard.selectedRange"
          :range-config="dashboard.rangeConfig"
          :range-hours="dashboard.rangeHours"
          :chart-entries="dashboard.chartEntries"
          :today="dashboard.flightToday"
          @range-change="dashboard.selectRange"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const dashboard = useDashboardStore();
onMounted(() => dashboard.load());
</script>
