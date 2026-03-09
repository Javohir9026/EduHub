// ─── DATA TYPES ───────────────────────────────────────────────────────────────

export interface Lesson {
  name: string;
  time: string;
}

export interface Payment {
  student: string;
  amount: number;
}

export interface Birthday {
  name: string;
}

export interface DayData {
  date: string;
  lessons: Lesson[];
  payments: Payment[];
  birthdays: Birthday[];
}

export type DataMap = Record<string, DayData>;

// ─── UI TYPES ─────────────────────────────────────────────────────────────────

export type EventType = "lesson" | "payment" | "birthday";

export interface PillItem {
  type: EventType;
  label: string;
}

export interface StatItem {
  label: string;
  value: number | string;
  color: string;
  bg: string;
}