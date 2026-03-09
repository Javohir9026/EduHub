import type { DayData } from "../types";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Replace this with real API calls in production.

export const mockData: DayData[] = [
  {
    date: "2026-03-02",
    lessons: [{ name: "Mathematics V01", time: "09:00 – 12:00" }],
    payments: [],
    birthdays: [{ name: "Kamola Yusupova" }],
  },
  {
    date: "2026-03-04",
    lessons: [
      { name: "Physics V02", time: "10:00 – 12:00" },
      { name: "Chemistry V01", time: "14:00 – 16:00" },
    ],
    payments: [{ student: "Bobur Toshmatov", amount: 85 }],
    birthdays: [],
  },
  {
    date: "2026-03-08",
    lessons: [{ name: "Mathematics V01", time: "09:00 – 12:00" }],
    payments: [{ student: "Ali Valiyev", amount: 120 }],
    birthdays: [{ name: "Abdulaziz" }],
  },
  {
    date: "2026-03-10",
    lessons: [
      { name: "English Advanced", time: "11:00 – 13:00" },
      { name: "IELTS Prep", time: "15:00 – 17:00" },
    ],
    payments: [],
    birthdays: [],
  },
  {
    date: "2026-03-12",
    lessons: [],
    payments: [
      { student: "Dilnoza Rahimova", amount: 200 },
      { student: "Jasur Mirzayev", amount: 150 },
    ],
    birthdays: [],
  },
  {
    date: "2026-03-15",
    lessons: [{ name: "Biology V03", time: "09:00 – 11:00" }],
    payments: [{ student: "Nodira Karimova", amount: 95 }],
    birthdays: [{ name: "Sherzod" }, { name: "Malika" }],
  },
  {
    date: "2026-03-17",
    lessons: [
      { name: "Mathematics V02", time: "10:00 – 13:00" },
      { name: "Physics V01", time: "14:00 – 16:00" },
    ],
    payments: [],
    birthdays: [],
  },
  {
    date: "2026-03-19",
    lessons: [{ name: "Chemistry V02", time: "11:00 – 13:00" }],
    payments: [{ student: "Temur Nazarov", amount: 110 }],
    birthdays: [{ name: "Feruza" }],
  },
  {
    date: "2026-03-22",
    lessons: [
      { name: "English Beginner", time: "09:00 – 10:30" },
      { name: "Math Olympiad", time: "14:00 – 17:00" },
    ],
    payments: [{ student: "Umid Xolmatov", amount: 180 }],
    birthdays: [],
  },
  {
    date: "2026-03-25",
    lessons: [{ name: "IELTS Prep", time: "10:00 – 12:00" }],
    payments: [],
    birthdays: [{ name: "Zulfiya" }, { name: "Rustam" }],
  },
  {
    date: "2026-03-28",
    lessons: [{ name: "Physics V03", time: "13:00 – 15:00" }],
    payments: [
      { student: "Sarvar Qodirov", amount: 75 },
      { student: "Barno Aliyeva", amount: 130 },
    ],
    birthdays: [{ name: "Zulfiya" }, { name: "Rustam" },{ name: "Zulfiya" }, { name: "Rustam" },{ name: "Zulfiya" }, { name: "Rustam" }],
  },
  {
    date: "2026-03-31",
    lessons: [{ name: "Mathematics V01", time: "09:00 – 12:00" }],
    payments: [],
    birthdays: [{ name: "Otabek" }],
  },
];