export interface Student {
  id: number;
  fullName: string;
}

export interface Group {
  id: number;
  name: string;
}
export interface Payment {
  id: number;
  student: Student;
  group: Group;
  amount: number;
  paidAmount: number;
  discount: number;
  month: string;
  paymentDate: string;
  description: string;
}

export const STUDENTS: Student[] = [
  { id: 1, fullName: "Ali Valiyev" },
  { id: 2, fullName: "Malika Yusupova" },
  { id: 3, fullName: "Jasur Toshmatov" },
  { id: 4, fullName: "Nilufar Karimova" },
  { id: 5, fullName: "Bobur Hasanov" },
  { id: 6, fullName: "Zulfiya Rашidova" },
];

export const GROUPS: Group[] = [
  { id: 1, name: "Frontend N1" },
  { id: 2, name: "Backend N1" },
  { id: 3, name: "Flutter N2" },
  { id: 4, name: "Python N3" },
  { id: 5, name: "DevOps N1" },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 1,
    student: { id: 1, fullName: "Ali Valiyev" },
    group: { id: 2, name: "Backend N1" },
    amount: 500000,
    paidAmount: 500000,
    discount: 0,
    month: "2025-03-01",
    paymentDate: "2025-03-08",
    description: "Mart oyi uchun tolov",
  },
  {
    id: 2,
    student: { id: 2, fullName: "Malika Yusupova" },
    group: { id: 1, name: "Frontend N1" },
    amount: 450000,
    paidAmount: 400000,
    discount: 50000,
    month: "2025-03-01",
    paymentDate: "2025-03-05",
    description: "Mart oyi, chegirma bilan",
  },
  {
    id: 3,
    student: { id: 3, fullName: "Jasur Toshmatov" },
    group: { id: 3, name: "Flutter N2" },
    amount: 600000,
    paidAmount: 600000,
    discount: 0,
    month: "2025-02-01",
    paymentDate: "2025-02-10",
    description: "Fevral oyi uchun tolov",
  },
  {
    id: 4,
    student: { id: 4, fullName: "Nilufar Karimova" },
    group: { id: 4, name: "Python N3" },
    amount: 480000,
    paidAmount: 480000,
    discount: 20000,
    month: "2025-03-01",
    paymentDate: "2025-03-12",
    description: "Mart oyi",
  },
  {
    id: 5,
    student: { id: 5, fullName: "Bobur Hasanov" },
    group: { id: 2, name: "Backend N1" },
    amount: 500000,
    paidAmount: 250000,
    discount: 0,
    month: "2025-03-01",
    paymentDate: "2025-03-15",
    description: "Qisman tolov",
  },
  {
    id: 6,
    student: { id: 6, fullName: "Zulfiya Rashidova" },
    group: { id: 5, name: "DevOps N1" },
    amount: 700000,
    paidAmount: 700000,
    discount: 100000,
    month: "2025-02-01",
    paymentDate: "2025-02-20",
    description: "Fevral, loyiha chegirmasi",
  },
];

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("uz-UZ").replace(/,/g, " ") + " UZS";
}

export function formatMonthName(monthStr: string): string {
  const date = new Date(monthStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
