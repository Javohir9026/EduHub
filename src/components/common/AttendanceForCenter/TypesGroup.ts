// =============================
// Learning Center
// =============================
export interface LearningCenter {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
}

// =============================
// Teacher
// =============================
export interface Teacher {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  lastName: string;
}

// =============================
// Student
// =============================
export interface Student {
  id: number;
  fullName: string;
}

// =============================
// Lesson
// =============================
export interface Lesson {
  id: number;
  name: string;
  attendances: Attendance[];
  lessonDate: string;
}

// =============================
// Group Student (optional)
// =============================
export interface GroupStudent {
  id: number;
}

// =============================
// Group
// =============================
export interface Group {
  id: number;
  created_at: string;
  updated_at: string;

  name: string;
  description: string;

  startDate: string;
  endDate: string;

  lessonDays: string;
  lessonTime: string;

  room: string;

  monthlyPrice: string;

  maxStudents: number;
  currentStudents: number;

  isActive: boolean;

  learningCenter: LearningCenter;
  teacher: Teacher;

  groupStudents: GroupStudent[];
  lessons: Lesson[];
}

// =============================
// Attendance
// =============================
export interface Attendance {
  id: number;

  date: string;
  status: "PRESENT" | "ABSENT";

  group: Group;
  student: Student;
  teacher: Teacher;
  lesson: Lesson;
}