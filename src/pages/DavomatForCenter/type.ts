export interface Attendance {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  created_at: string;
  updated_at: string;
  fullName: string;
  phone: string;
}

export interface GroupStudent {
  id: number;
  created_at: string;
  updated_at: string;
  joinedAt: string;
  leftAt: string | null;
  status: "ACTIVE" | "INACTIVE";
  student: Student;
}

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
  maxStudents: number;
  currentStudents: number;
  monthlyPrice: string;
  isActive: boolean;
  groupStudents: GroupStudent[];
}

export interface Teacher {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  lastName: string;
  email: string;
  login: string;
  password: string;
  phone: string;
  role: "TEACHER" | string;
  salary: string;
  subject: string;
  isActive: boolean;
}

export interface Lesson {
  id: number;
  name: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;

  attendances: Attendance[];
  group: Group;
  teacher: Teacher;
}

export interface LessonResponse {
  message: string;
  statusCode: number;
  data: Lesson;
}
