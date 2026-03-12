import { useState, useCallback } from "react";
import { Plus, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PaymentStats } from "@/components/common/payment/Paymentstats";
import { PaymentTable } from "@/components/common/payment/Paymenttable";
import { PaymentForm } from "@/components/common/payment/Paymentform";

import {
  MOCK_PAYMENTS,
  STUDENTS,
  GROUPS,
} from "@/components/common/payment/mockData";

import type {
  Payment,
  PaymentFormData,
} from "@/lib/types";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

let toastId = 0;

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

  const [formOpen, setFormOpen] = useState<boolean>(false);

  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = ++toastId;

      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const handleOpenAdd = () => {
    setEditingPayment(null);
    setFormOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    showToast("Payment deleted successfully");
  };

  const handleSubmit = (data: PaymentFormData) => {
    const student = STUDENTS.find((s) => s.id === data.student_id)!;

    const group = GROUPS.find((g) => g.id === data.group_id)!;

    const today = new Date().toISOString().slice(0, 10);

    if (editingPayment) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editingPayment.id
            ? {
                ...p,
                student,
                group,
                amount: data.amount,
                paidAmount: data.paidAmount,
                discount: data.discount,
                month: data.month,
                description: data.description,
              }
            : p
        )
      );

      showToast("Payment updated successfully");
    } else {
      const newPayment: Payment = {
        id: Math.max(0, ...payments.map((p) => p.id)) + 1,
        student,
        group,
        amount: data.amount,
        paidAmount: data.paidAmount,
        discount: data.discount,
        month: data.month,
        paymentDate: today,
        description: data.description,
      };

      setPayments((prev) => [newPayment, ...prev]);

      showToast("Payment added successfully");
    }

    setFormOpen(false);
    setEditingPayment(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <CreditCard className="w-[18px] h-[18px] text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                Payments
              </h1>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {payments.length} total records
              </p>
            </div>
          </div>

          <Button
            onClick={handleOpenAdd}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-500/20 gap-1.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />

            <span className="hidden sm:inline">Add Payment</span>

            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Stats */}

        <PaymentStats payments={payments} />

        {/* Table */}

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              All Payments
            </h2>

            <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg font-medium">
              {payments.length} records
            </span>
          </div>

          <div className="p-4 md:p-0">
            <PaymentTable
              payments={payments}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Modal */}

      <PaymentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPayment(null);
        }}
        onSubmit={handleSubmit}
        editingPayment={editingPayment}
      />

      {/* Toast */}

      <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-2 fade-in duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 shrink-0" />
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}