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

export interface Group {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}