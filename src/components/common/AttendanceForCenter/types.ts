export interface Attendance {
  id: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE"; // kerak bo‘lsa kengaytirasan
  group: Group;
  lesson: Lesson;
  student: Student;
  teacher: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  fullName: string;
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
  group: Group;
  teacher: TeacherForLesson;
}

export interface TeacherForLesson {
  id: number;
  firstName: string;
  lastName: string;
}
