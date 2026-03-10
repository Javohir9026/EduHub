// ─── DATA TYPES ───────────────────────────────────────────────────────────────

import type { Student } from "@/lib/types";

export interface Lesson {
  id: number;
  name: string;
  time: string;
  groupName: string;
}

export interface Payment {
  id:number;
  student: Student;
  amount: number;
  paidAmount: number;
}

export interface Birthday {
  fullName: string;
  id: number;
  phone: string;
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