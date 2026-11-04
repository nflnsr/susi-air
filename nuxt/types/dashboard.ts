export type RangeKey = "1w" | "1m" | "3m" | "6m" | "1y";

export type Schedule = {
  duty_date: string;
  status: number;
  base_name: string;
  base_color: string;
  duty_type: string;
  count_schedules: number;
  count_logbooks: number;
};

export type ScheduleLegend = { code: string; label: string; color: string };

export type ScheduleResponse = {
  today: string;
  legend: ScheduleLegend[];
  schedules: Schedule[];
};

export type Document = {
  id: string;
  label: string;
  expiryDate: string;
  status?: string;
  statusLabel?: string;
};

export type DocumentsResponse = {
  today: string;
  thresholds: { warningDays: number };
  documents: Document[];
};

export type FlightData = {
  pilot: { name: string; totalFlightHours: number };
  today?: string;
  limits: Record<string, number>;
  chartBounds: Record<
    RangeKey,
    { limit: number; max: number; windowDays: number; displayRangeDays: number }
  >;
  flightHours: { date: string; hours: number }[];
};

export type CalendarDay = {
  day: number;
  date: string;
  isToday: boolean;
  schedule?: Schedule;
};
