import { defineStore } from "pinia";
import type {
  CalendarDay,
  DocumentsResponse,
  FlightData,
  RangeKey,
  ScheduleResponse,
} from "~/types/dashboard";

const filters = ["All", "On Duty", "Leave", "Training"];
const ranges: RangeKey[] = ["1w", "1m", "3m", "6m", "1y"];

export const useDashboardStore = defineStore("dashboard", () => {
  const config = useRuntimeConfig();
  const { request } = useApi();
  const flightData = ref<FlightData | null>(null);
  const scheduleData = ref<ScheduleResponse | null>(null);
  const documentsData = ref<DocumentsResponse | null>(null);
  const apiError = ref("");
  const isLoading = ref(true);
  const selectedFilter = ref("All");
  const selectedDate = ref("");
  const selectedRange = ref<RangeKey>("1w");
  const currentMonth = ref(new Date("2026-05-15T00:00:00"));

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
  const nextDuty = computed(
    () =>
      (scheduleData.value?.schedules || []).find(
        (item) => item.duty_date >= (scheduleData.value?.today || "") && item.status === 1,
      ) ||
      (scheduleData.value?.schedules || []).find(
        (item) => item.duty_date >= (scheduleData.value?.today || ""),
      ),
  );
  const documentsWithStatus = computed(() =>
    (documentsData.value?.documents || []).map((document) => {
      const days = Math.ceil(
        (new Date(`${document.expiryDate}T00:00:00`).getTime() -
          new Date(`${documentsData.value?.today}T00:00:00`).getTime()) /
          86400000,
      );
      const status =
        document.status ||
        (days <= 0
          ? "expired"
          : days <= (documentsData.value?.thresholds.warningDays || 30)
            ? "soon"
            : "safe");
      return {
        ...document,
        status,
        statusLabel:
          status === "expired" ? "Expired" : status === "soon" ? `${days} days left` : "Valid",
      };
    }),
  );
  const documentSummary = computed(() => ({
    safe: documentsWithStatus.value.filter((item) => item.status === "safe").length,
    attention: documentsWithStatus.value.filter((item) => item.status !== "safe").length,
  }));
  const monthHours = computed(() =>
    (flightData.value?.flightHours || [])
      .filter((item) =>
        item.date.startsWith(
          `${currentMonth.value.getFullYear()}-${String(currentMonth.value.getMonth() + 1).padStart(2, "0")}`,
        ),
      )
      .reduce((total, item) => total + item.hours, 0),
  );
  const flightToday = computed(() => {
    if (flightData.value?.today) return flightData.value.today;
    const dates = (flightData.value?.flightHours || []).map((item) => item.date).sort();
    return dates.at(-1) || scheduleData.value?.today || "";
  });
  const flightHoursByDate = computed(
    () => new Map((flightData.value?.flightHours || []).map((item) => [item.date, item.hours])),
  );
  function addDays(value: string, offset: number) {
    const date = new Date(`${value}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  }
  function rollingHours(endDate: string, windowDays: number) {
    return Array.from({ length: windowDays }, (_, index) =>
      flightHoursByDate.value.get(addDays(endDate, -index)) || 0,
    ).reduce((total, hours) => total + hours, 0);
  }
  const limitSummary = computed(() => {
    const today = flightToday.value;
    const definitions = [
      { key: "daily", label: "Daily", windowDays: 1, window: "Today only" },
      { key: "weekly", label: "Weekly", windowDays: 7, window: "Rolling 7 days" },
      { key: "monthly", label: "Monthly", windowDays: 30, window: "Rolling 30 days" },
      { key: "annual", label: "Annual", windowDays: 365, window: "Rolling 365 days" },
    ];
    return definitions.map((item) => {
      const limit = flightData.value?.limits[item.key] || 0;
      const hours = today ? rollingHours(today, item.windowDays) : 0;
      return {
        ...item,
        hours,
        limit,
        percentage: limit ? (hours / limit) * 100 : 0,
      };
    });
  });
  const rangeConfig = computed(
    () =>
      flightData.value?.chartBounds[selectedRange.value] || {
        limit: 0,
        max: 1,
        windowDays: 0,
        displayRangeDays: 0,
      },
  );
  const chartEntries = computed(() => {
    const today = flightToday.value;
    if (!today) return [];
    return Array.from({ length: 15 }, (_, index) => {
      const date = addDays(today, index - 7);
      return {
        date,
        hours: rollingHours(date, rangeConfig.value.windowDays),
      };
    });
  });
  const rangeHours = computed(() => {
    const todayEntry = chartEntries.value.find((entry) => entry.date === flightToday.value);
    return todayEntry?.hours || 0;
  });

  function changeMonth(offset: number) {
    currentMonth.value = new Date(
      currentMonth.value.getFullYear(),
      currentMonth.value.getMonth() + offset,
      1,
    );
  }
  function selectFilter(filter: string) {
    selectedFilter.value = filter;
  }
  function selectRange(range: RangeKey) {
    selectedRange.value = range;
  }
  function selectDate(date: string) {
    selectedDate.value = date;
  }

  async function load() {
    isLoading.value = true;
    apiError.value = "";
    try {
      const [profile, hours, schedules, documents] = await Promise.allSettled([
        request<FlightData["pilot"]>(config.public.apiEndpoints.profile),
        request<FlightData>(config.public.apiEndpoints.flightHours),
        request<ScheduleResponse>(
          `${config.public.apiEndpoints.schedules}?year=${currentMonth.value.getFullYear()}&month=${String(currentMonth.value.getMonth() + 1).padStart(2, "0")}`,
        ),
        request<DocumentsResponse>(config.public.apiEndpoints.documents),
      ]);

      const errors: string[] = [];
      if (profile.status === "fulfilled" && hours.status === "fulfilled") {
        flightData.value = { ...hours.value, pilot: profile.value };
      } else {
        errors.push("Unable to load flight data from the API.");
      }
      if (schedules.status === "fulfilled") {
        scheduleData.value = schedules.value;
      } else {
        errors.push("Unable to load schedule data from the API.");
      }
      if (documents.status === "fulfilled") {
        documentsData.value = normalizeDocumentsResponse(documents.value);
      } else {
        errors.push("Unable to load document data from the API.");
      }
      apiError.value = errors.join(" ");
    } catch (error: unknown) {
      const response = error as { data?: { message?: string }; message?: string };
      apiError.value =
        response.data?.message || response.message || "Unable to load dashboard data from the API.";
    } finally {
      isLoading.value = false;
    }

    function normalizeDocumentsResponse(
      response: DocumentsResponse | { data?: DocumentsResponse },
    ): DocumentsResponse {
      const payload =
        "data" in response && response.data && !("documents" in response)
          ? response.data
          : response;

      if (!payload || !Array.isArray(payload.documents)) {
        throw new Error("Documents API returned an invalid response.");
      }

      return payload;
    }
  }

  return {
    flightData,
    scheduleData,
    documentsWithStatus,
    documentSummary,
    nextDuty,
    monthHours,
    rangeConfig,
    limitSummary,
    flightToday,
    chartEntries,
    rangeHours,
    calendarDays,
    firstDay,
    monthLabel,
    apiError,
    isLoading,
    selectedFilter,
    selectedDate,
    selectedRange,
    currentMonth,
    filters,
    ranges,
    changeMonth,
    selectFilter,
    selectRange,
    selectDate,
    load,
  };
});
