import { defineStore } from "pinia";
import type { CalendarDay, ScheduleResponse } from "~/types/dashboard";

export const useScheduleStore = defineStore("schedule", () => {
  const config = useRuntimeConfig();
  const { request } = useApi();
  const scheduleData = ref<ScheduleResponse | null>(null);
  const isLoading = ref(true);
  const apiError = ref("");
  const selectedFilter = ref("All");
  const selectedDate = ref("");
  const currentMonth = ref(new Date("2026-05-15T00:00:00"));
  const filters = ["All", "On Duty", "Leave", "Training"];
  const monthLabel = computed(() =>
    currentMonth.value.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  );
  const monthSchedules = computed(() =>
    (scheduleData.value?.schedules || []).filter((item) => {
      const date = new Date(`${item.duty_date}T00:00:00`);
      const typeMatches =
        selectedFilter.value === "All" ||
        (selectedFilter.value === "On Duty"
          ? item.duty_type === "DTY"
          : selectedFilter.value === "Leave"
            ? ["RLV", "ULV"].includes(item.duty_type)
            : item.duty_type === "TRX");
      return (
        date.getMonth() === currentMonth.value.getMonth() &&
        date.getFullYear() === currentMonth.value.getFullYear() &&
        typeMatches
      );
    }),
  );
  const scheduleByDate = computed(
    () => new Map(monthSchedules.value.map((item) => [item.duty_date, item])),
  );
  const firstDay = computed(() =>
    new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1).getDay(),
  );
  const calendarDays = computed<CalendarDay[]>(() => {
    const total = new Date(
      currentMonth.value.getFullYear(),
      currentMonth.value.getMonth() + 1,
      0,
    ).getDate();
    return Array.from({ length: total }, (_, index) => {
      const date = `${currentMonth.value.getFullYear()}-${String(currentMonth.value.getMonth() + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`;
      return {
        day: index + 1,
        date,
        isToday: date === scheduleData.value?.today,
        schedule: scheduleByDate.value.get(date),
      };
    });
  });
  const selectedSchedule = computed(() =>
    scheduleData.value?.schedules.find((item) => item.duty_date === selectedDate.value),
  );

  function changeMonth(offset: number) {
    currentMonth.value = new Date(
      currentMonth.value.getFullYear(),
      currentMonth.value.getMonth() + offset,
      1,
    );
  }
  function goToday() {
    if (scheduleData.value?.today) {
      currentMonth.value = new Date(`${scheduleData.value.today}T00:00:00`);
      selectedDate.value = scheduleData.value.today;
    }
  }
  function dutyLabel(code: string) {
    return scheduleData.value?.legend.find((item) => item.code === code)?.label || code;
  }
  async function loadSchedules() {
    isLoading.value = true;
    apiError.value = "";
    try {
      scheduleData.value = await request<ScheduleResponse>(
        `${config.public.apiEndpoints.schedules}?year=${currentMonth.value.getFullYear()}&month=${String(currentMonth.value.getMonth() + 1).padStart(2, "0")}`,
      );
    } catch (error: unknown) {
      const response = error as { data?: { message?: string }; message?: string };
      apiError.value =
        response.data?.message || response.message || "Unable to load schedule data from the API.";
    } finally {
      isLoading.value = false;
    }
  }
  return {
    scheduleData,
    isLoading,
    apiError,
    selectedFilter,
    selectedDate,
    currentMonth,
    filters,
    monthLabel,
    calendarDays,
    firstDay,
    selectedSchedule,
    changeMonth,
    goToday,
    dutyLabel,
    loadSchedules,
  };
});
