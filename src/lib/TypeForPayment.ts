export type Student = {
  id: number;
  fullName: string;
};

export type Group = {
  id: number;
  name: string;
};

export type Payment = {
  id: number;
  amount: number;
  paidAmount: number;
  discount?: number;

  month: string;
  paymentDate?: string;
  description?: string;

  student: Student;
  group?: Group;
};

export type PaymentFormData = {
  student_id: number;
  group_id: number;

  amount: number;
  paidAmount: number;
  discount: number;

  month: string;
  description?: string;
};