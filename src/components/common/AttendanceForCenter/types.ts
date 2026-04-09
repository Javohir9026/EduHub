export interface Attendance {
  id: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE"; // kerak bo‘lsa kengaytirasan
  group: GroupForAttendance;
  lesson: Lesson;
  student: Student;
  teacher: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface GroupForAttendance {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  fullName: string;
}
export interface Groups {
  id: number;
  name: string;
  lessonDays: string;
  lessonTime: string;
  monthlyPrice: number;
  currentStudents: number;
}
export interface Teacher {
  id: number;
  fullName: string;
}
export interface Lesson {
  id: number;
  name: string;
  description: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  group: GroupForAttendance;
  teacher: TeacherForLesson;
}

export interface TeacherForLesson {
  id: number;
  firstName: string;
  lastName: string;
}
