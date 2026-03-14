import { useEffect, useState } from "react";
import { Plus, CreditCard, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentForm } from "@/components/common/payment/Paymentform";
import { PaymentStats } from "@/components/common/payment/Paymentstats";
import apiClient from "@/api/ApiClient";
import { toast } from "sonner";
import { PaymentTable } from "@/components/common/payment/Paymenttable";

// ─── TYPES ─────────────────────────────────────────────────────────────────
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

interface PaymentFormData {
  student_id: number;
  group_id: number;
  amount: number;
  paidAmount: number;
  discount: number;
  month: string;
  description?: string;
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  // Fetch Payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL;
      const id = localStorage.getItem("id");
      const res = await apiClient.get(`${api}/learning-centers/${id}/payments`);
      setPayments(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingPayment(null);
    setFormOpen(true);
  };

  // Edit Payment
  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormOpen(true);
  };

  // Delete Payment
  const handleDelete = (id: number) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    toast.success("To'lov muvaffaqiyatli o'chirildi!");
  };

  // Create Payment API Call
  const CreatePayment = async (data: PaymentFormData) => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("access_token");
      const res = await apiClient.post(
        `${api}/student-payments`,
        { ...data, learninglearningCenterId: localStorage.getItem("id") },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const UpdatePayment = async (data: PaymentFormData, id: number) => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("access_token");
      const res = await apiClient.patch(`${api}/student-payments/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Submit from Form
  const handleSubmit = (data: PaymentFormData) => {
    const student = {
      id: data.student_id,
      fullName: `Student ${data.student_id}`,
    };
    const group = { id: data.group_id, name: `Group ${data.group_id}` };
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
            : p,
        ),
      );
      UpdatePayment(data, editingPayment.id);
      toast.success("To'lov muvaffaqiyatli yangilandi!");
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
      CreatePayment(data);
      toast.success("To'lov muvaffaqiyatli qo'shildi");
    }

    setFormOpen(false);
    setEditingPayment(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-background font-sans">
      <div className="max-w-7xl mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <CreditCard className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                To'lovlar
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {payments.length} ta to'lov umumiy
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenAdd}
            className="bg-violet-600 cursor-pointer hover:bg-violet-700 text-white rounded-xl shadow-lg gap-1.5"
          >
            <Plus className="w-4 h-4" /> To'lov kiritish
          </Button>
        </div>

        <PaymentStats payments={payments} loading={loading} />

        <div className="bg-white dark:bg-fullbg rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Umumiy To'lovlar
            </h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg font-medium">
              {payments.length} ta to'lovlar
            </span>
          </div>
          <div className="p-4 md:p-0">
            <PaymentTable
              loading={loading}
              payments={payments}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <PaymentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPayment(null);
        }}
        onSubmit={handleSubmit}
        editingPayment={editingPayment}
      />
    </div>
  );
}
