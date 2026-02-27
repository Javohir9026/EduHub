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
  group: Groupforstudent;
}

export interface Groupforstudent {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}
export interface LearningCenter {
  id: number;
  name: string;
}
export interface Group {
  id: number;
  name: string;
  lessonDays: number;
  lessonTime: string;
  currentStudents: number;
  learningCenter: LearningCenter;
}
