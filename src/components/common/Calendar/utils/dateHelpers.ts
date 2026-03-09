// ─── DATE HELPERS ─────────────────────────────────────────────────────────────

/** Returns the number of days in a given month. */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns the weekday index (0 = Sunday) that the 1st of the month falls on. */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Formats year/month/day into "YYYY-MM-DD" string used as DataMap keys. */
export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const MONTH_NAMES: string[] = [
  "Yanvar", "Fevral", "Mart", "Aprel",
  "May", "Iyun", "Iyul", "Avgust",
  "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

export const DAY_LABELS: string[] = ["Yak", "Du", "Se", "Cho", "Pay", "Ju", "Sha"];