import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import type { Payment } from "@/lib/types";

import { formatCurrency, formatDate, formatMonthName } from "./mockData";

interface PaymentTableProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (id: number) => void;
}

export function PaymentTable({
  payments,
  onEdit,
  onDelete,
}: PaymentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full">
          {/* HEADER */}

          <TableHeader>
            <TableRow className="text-center">
              <TableCell
                isHeader
                className="px-4 py-4 whitespace-nowrap text-center"
              >
                O'quvchi
              </TableCell>

              <TableCell
                isHeader
                className="hidden sm:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                Guruh
              </TableCell>

              <TableCell
                isHeader
                className="hidden md:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                Miqdor
              </TableCell>

              <TableCell
                isHeader
                className="hidden md:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                To'langan
              </TableCell>

              <TableCell
                isHeader
                className="hidden xl:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                chegirma
              </TableCell>

              <TableCell
                isHeader
                className="hidden xl:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                Oy
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-4 whitespace-nowrap text-center"
              >
                To'lov Sanasi
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-4 whitespace-nowrap text-center"
              >
                Qo'shimcha
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* BODY */}

          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
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
                  {/* Student */}

                  <TableCell className="px-5 py-4 whitespace-nowrap">
                    {payment.student.fullName}
                  </TableCell>

                  {/* Group */}

                  <TableCell className="hidden sm:table-cell px-5 py-4">
                    {payment.group?.name}
                  </TableCell>

                  {/* Amount */}

                  <TableCell className="hidden md:table-cell px-5 py-4">
                    {formatCurrency(payment.amount)}
                  </TableCell>

                  {/* Paid */}

                  <TableCell className="hidden md:table-cell px-5 py-4">
                    {formatCurrency(payment.paidAmount)}
                  </TableCell>

                  {/* Discount */}

                  <TableCell className="hidden xl:table-cell px-5 py-4">
                    {payment.discount > 0
                      ? formatCurrency(payment.discount)
                      : "—"}
                  </TableCell>

                  {/* Month */}

                  <TableCell className="hidden xl:table-cell px-5 py-4">
                    {formatMonthName(payment.month)}
                  </TableCell>

                  {/* Date */}

                  <TableCell className="px-5 py-4">
                    {formatDate(payment.paymentDate)}
                  </TableCell>

                  {/* Actions */}

                  <TableCell className="px-5 py-4">
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
