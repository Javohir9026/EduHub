import type { Attendance } from "@/lib/types";

type Group = {
  id: number;
  name: string;
};

type Teacher = {
  id: number;
  name: string;
  lastName: string;
};

export type Lesson = {
  id: number;
  name: string;
  description: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  group: Group;
  teacher: Teacher;

  // 👇 agar backendda keyinchalik kelsa qo‘shiladi
  attendances?: Attendance[];
};