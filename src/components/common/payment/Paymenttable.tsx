import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// ─── TYPES ───────────────────────────────────────────────────────────────
interface Student {
  id: number;
  fullName: string;
  phone?: string;
  parentPhone?: string;
  birthDate?: string;
  address?: string;
}

interface Group {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  lessonDays?: string[];
  [key: string]: any; // boshqa maydonlar uchun
}

export interface Payment {
  id: number;
  amount: number | string;
  paidAmount: number | string;
  discount?: number | string;
  month?: string;
  paymentDate: string;
  description?: string;
  student: Student;
  group?: Group;
}

interface PaymentTableProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (id: number) => void;
}

// ─── FORMAT FUNCTIONS ───────────────────────────────────────────────────
const formatCurrency = (value: number | string) => {
  if (!value) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("en-US");
};

const formatMonthName = (month?: string) => {
  if (!month) return "—";
  const date = new Date(month);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

// ─── COMPONENT ──────────────────────────────────────────────────────────
export function PaymentTable({
  payments,
  onEdit,
  onDelete,
}: PaymentTableProps) {
  console.log(payments);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-fullbg">
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full">
          {/* HEADER */}
          <TableHeader>
            <TableRow className="text-center">
              <TableCell isHeader>O'quvchi</TableCell>
              <TableCell isHeader className="hidden md:table-cell py-3">
                Miqdor
              </TableCell>
              <TableCell isHeader className="hidden md:table-cell py-3">
                To'langan
              </TableCell>
              <TableCell isHeader className="hidden xl:table-cell py-3">
                Chegirma
              </TableCell>

              <TableCell isHeader>To'lov Sanasi</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-gray-400"
                >
                  To'lovlar Mavjud Emas
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, idx) => {
                const amount =
                  typeof payment.amount === "string"
                    ? parseFloat(payment.amount)
                    : payment.amount;
                const paidAmount =
                  typeof payment.paidAmount === "string"
                    ? parseFloat(payment.paidAmount)
                    : payment.paidAmount;
                const discount = payment.discount
                  ? typeof payment.discount === "string"
                    ? parseFloat(payment.discount)
                    : payment.discount
                  : 0;

                return (
                  <TableRow
                    key={payment.id}
                    className={`text-center border-b border-gray-200 dark:border-white/[0.05] last:border-b-0
                      ${idx % 2 === 0 ? "bg-gray-50 dark:bg-white/5" : "bg-white dark:bg-white/0"}
                      hover:bg-gray-100 dark:hover:bg-white/10`}
                  >
                    <TableCell className="py-3">{payment.student.fullName}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatCurrency(amount)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatCurrency(paidAmount)}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {discount > 0 ? formatCurrency(discount) : "—"}
                    </TableCell>

                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(payment)}
                          className="hover:bg-blue-100 dark:hover:bg-blue-500/20"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete(payment.id)}
                          className="hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
