import { Info, Pencil, Trash, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────
interface Student {
  id: number;
  fullName: string;
}

interface Group {
  id: number;
  name: string;
}

interface Payment {
  id: number;
  amount: number;
  paidAmount: number;
  discount: number;
  month: string;
  paymentDate: string;
  description?: string;
  student: Student;
  group?: Group;
}

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  deleteLoading: boolean;
  onEdit: (payment: Payment) => void;
  onDelete: (id: number) => void;
}

// ─── FORMAT FUNCTIONS ───────────────────────────────────────────────────
const formatCurrency = (value: number | string) => {
  if (!value) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("en-US");
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

// ─── SKELETON COMPONENT ─────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow
          key={i}
          className="animate-pulse border-b border-gray-200 dark:border-white/[0.05]"
        >
          <TableCell className="py-3 flex items-center justify-center">
            <div className="h-4 w-30 bg-gray-200 dark:bg-zinc-700 rounded" />
          </TableCell>

          <TableCell className="hidden md:table-cell items-center justify-center">
            <div className="h-4 w-30 bg-gray-200 dark:bg-zinc-700 rounded mx-auto" />
          </TableCell>

          <TableCell className="hidden md:table-cell items-center justify-center">
            <div className="h-4 w-30 bg-gray-200 dark:bg-zinc-700 rounded mx-auto" />
          </TableCell>

          <TableCell className="hidden xl:table-cell items-center justify-center">
            <div className="h-4 w-30 bg-gray-200 dark:bg-zinc-700 rounded mx-auto" />
          </TableCell>

          <TableCell className="hidden sm:table-cell items-center justify-center">
            <div className="h-4 w-30 bg-gray-200 dark:bg-zinc-700 rounded mx-auto" />
          </TableCell>

          <TableCell>
            <div className="flex justify-center gap-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-700 rounded-lg" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-700 rounded-lg" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-700 rounded-lg hidden sm:block" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ─── COMPONENT ──────────────────────────────────────────────────────────
export function PaymentTable({
  payments,
  deleteLoading,
  loading,
  onEdit,
  onDelete,
}: PaymentTableProps) {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<number | null>(null);
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
              <TableCell
                isHeader
                className="text-center hidden sm:table-cell py-3"
              >
                Sana
              </TableCell>
              <TableCell isHeader>Qo'shimcha</TableCell>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-400"
                >
                  To'lovlar Mavjud Emas
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, idx) => (
                <TableRow
                  key={payment.id}
                  className={`text-center border-b border-gray-200 dark:border-white/[0.05] last:border-b-0
                  ${
                    idx % 2 === 0
                      ? "bg-gray-50 dark:bg-white/5"
                      : "bg-white dark:bg-white/0"
                  }
                  hover:bg-gray-100 dark:hover:bg-white/10`}
                >
                  <TableCell className="py-3">
                    {payment.student.fullName}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(payment.amount)} UZS
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(payment.paidAmount)} UZS
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    {payment.discount > 0
                      ? formatCurrency(payment.discount) + " UZS"
                      : "—"}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {formatDate(payment.paymentDate)}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-1 sm:gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(payment)}
                        className="bg-blue-500 hidden sm:flex dark:hover:bg-blue-400 cursor-pointer  hover:bg-blue-400 hover:text-white text-white rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/payment-info/${payment.id}`)}
                        className="bg-blue-500 sm:flex dark:hover:bg-blue-400 cursor-pointer  hover:bg-blue-400 hover:text-white text-white rounded-lg"
                      >
                        <Info className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer text-white rounded-lg flex items-center justify-center gap-2">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              O'chirishni tasdiqlaysizmi?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Haqiqatdan ham ishonchingiz komilmi?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Bekor qilish
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={deleteLoading}
                              onClick={(e) => {
                                e.preventDefault();
                                onDelete(payment.id);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                            >
                              {deleteLoading
                                ? "O'chirilmoqda..."
                                : "Ha, O'chirish"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
