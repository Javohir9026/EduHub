// ─── EduHub Calendar — Public API ────────────────────────────────────────────
//
// Import from this file in your app:
//
//   import CalendarPage from "@/features/calendar";
//   import { mockData } from "@/features/calendar";
//   import type { DayData, DataMap } from "@/features/calendar";
//

// Default export: the top-level page component
export { default } from "./components/CalendarBody";

// Named component exports (for embedding individual pieces)
export { default as CalendarPage } from "./components/CalendarBody";
export { default as CalendarGrid } from "./components/CalendarGrid";
export { default as CalendarDay } from "./components/CalendarDay";
export { default as DayDetailsDrawer } from "./components/DayDetails";
export { default as StatsBar } from "./components/Statsbar";
export { default as EventPill } from "./components/Eventpill";
export { default as Legend } from "./components/Legend";

// Icons
export * from "./icons";

// Data

// Utils / constants
export {
  getDaysInMonth,
  getFirstDayOfMonth,
  toDateStr,
  MONTH_NAMES,
  DAY_LABELS,
} from "./utils/dateHelpers";

// Types
export type {
  Lesson,
  Payment,
  Birthday,
  DayData,
  DataMap,
  EventType,
  PillItem,
  StatItem,
} from "./types";
