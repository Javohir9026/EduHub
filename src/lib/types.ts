export interface Student {
  id: number;
  fullName: string;
  phone: string;
  parentPhone: string;
  birthDate: string;
  address: string;
  isActive: boolean;
  learningCenterId: number;
  created_at: string;
  updated_at: string;
  groupId?: number | null;

  learningCenter: LearningCenter;
  groupStudents: GroupStudent[];
}

export interface LearningCenter {
  id: number;
  name: string;
  email: string;
  phone: string;
  login: string;
  password: string;
  role: string;
  image: string | null;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupStudent {
  id: number;
  created_at: string;
  updated_at: string;
  joinedAt: string;
  group: Group;
}

export interface Groupforstudent {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}
export type Teacher = {
  id: number;
  name: string;
  email:string;
  lastName: string;
  login:string;
  phone: string;
  subject: string;
  salary: number;
  role: "TEACHER";
  learningCenterId: number;
  isActive: boolean;
  createdAt: string;
};
export interface Student {
  id: number;
  fullName: string;
  birthDate: string;
  address: string;
  created_at: string;
  attendances: Attendance[];
  groupStudents: GroupStudent[];
}

export interface Attendance {
  id: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  created_at: string;
  updated_at: string;
}

export interface GroupStudent {
  id: number;
  joinedAt: string;
  leftAt: string | null;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
  group: Group;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  lessonDays: number;
  lessonTime: string;
  room: string;
  maxStudents: number;
  currentStudents: number;
  monthlyPrice: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}
export interface GetGroupResponse {
  statusCode: number;
  message: string;
  data: GroupDetail;
}

export interface GroupDetail {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  lessonDays: number;
  lessonTime: string;
  monthlyPrice: number;
  isActive: boolean;
  maxStudents: number;
  room: string;
  description: string;
  currentStudents: number;
  createdAt: string;
  updatedAt: string;
  teacher: Teacher;
  learningCenter: LearningCenter;
  groupStudents: GroupStudent[];
}

export interface LearningCenter {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface GroupStudent {
  id: number;
  joinedAt: string;
  student: StudentShort;
}

export interface StudentShort {
  id: number;
  firstName: string;
  lastName: string;
  fullName:string;
  phone: string;
}