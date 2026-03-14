import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Payment, PaymentFormData } from "@/lib/TypeForPayment";
import apiClient from "@/api/ApiClient";
import type { GroupDetail } from "@/lib/types";

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  editingPayment: Payment | null;
}

const defaultForm: any = {
  student_id: 0,
  group_id: 0,
  amount: 0,
  paidAmount: "",
  discount: "",
  month: "",
  description: "",
};

export function PaymentForm({
  open,
  onClose,
  onSubmit,
  editingPayment,
}: PaymentFormProps) {
  const [form, setForm] = useState(defaultForm);

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/,/g, ""));
  };
  const [groups, setGroups] = useState<GroupDetail[]>([]);
  const [loading, setloading] = useState(false);
  const fetchGroups = async () => {
    try {
      setloading(true);
      const api = import.meta.env.VITE_API_URL;
      const id = localStorage.getItem("id");
      const res = await apiClient.get(`${api}/groups/learning-center/${id}`);
      setGroups(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchGroups();
  }, []);
  useEffect(() => {
    if (editingPayment) {
      setForm({
        student_id: editingPayment.student.id,
        group_id: editingPayment.group?.id,
        amount: editingPayment.amount,
        paidAmount: formatCurrency(String(editingPayment.paidAmount)),
        discount: formatCurrency(String(editingPayment.discount)),
        month: editingPayment.month.slice(0, 7),
        description: editingPayment.description,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingPayment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.student_id || !form.group_id || !form.month) return;

    onSubmit({
      ...form,
      paidAmount: parseNumber(form.paidAmount),
      discount: parseNumber(form.discount),
      month: form.month + "-01",
    });
  };

  const field = (label: string, children: React.ReactNode) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
  const selectedGroup = groups.find((g) => g.id === form.group_id);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {editingPayment ? "To'lovni Yangilash" : "Yangi To'lov Kiritish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field(
              "Guruh",
              <Select
                value={form.group_id ? String(form.group_id) : ""}
                onValueChange={(v) => {
                  const group = groups.find((g) => g.id === Number(v));

                  setForm({
                    ...form,
                    group_id: Number(v),
                    student_id: 0,
                    amount: group?.monthlyPrice || 0,
                  });
                }}
              >
                <SelectTrigger className="rounded-xl w-full border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800">
                  <SelectValue placeholder="Guruhni tanlang" />
                </SelectTrigger>

                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>,
            )}

            {field(
              "O'quvchi",
              <Select
                disabled={!form.group_id}
                value={form.student_id ? String(form.student_id) : ""}
                onValueChange={(v) =>
                  setForm({ ...form, student_id: Number(v) })
                }
              >
                <SelectTrigger
                  disabled={!form.group_id}
                  className="rounded-xl w-full border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <SelectValue
                    placeholder={
                      form.group_id
                        ? "O'quvchini tanlang"
                        : "Avval guruh tanlang"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {selectedGroup?.groupStudents?.map((gs: any) => (
                    <SelectItem
                      key={gs.student.id}
                      value={String(gs.student.id)}
                    >
                      {gs.student.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>,
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {field(
              "Miqdor (UZS)",
              <Input
                readOnly
                value={
                  form.amount
                    ? `${Math.floor(Number(form.amount)).toLocaleString()} UZS`
                    : ""
                }
                className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
              />,
            )}

            {field(
              "To'lanadi (UZS)",
              <div className="relative">
                <Input
                  value={form.paidAmount}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    setForm({
                      ...form,
                      paidAmount: formatted,
                    });
                  }}
                  className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 pr-14"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  UZS
                </span>
              </div>,
            )}

            {field(
              "Chegirma (UZS)",
              <div className="relative">
                <Input
                  value={form.discount}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    setForm({
                      ...form,
                      discount: formatted,
                    });
                  }}
                  className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 pr-14"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  UZS
                </span>
              </div>,
            )}
          </div>

          {field(
            "Sana",
            <Input
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
            />,
          )}

          {field(
            "Qo'shimcha",
            <Textarea
              placeholder="Tolov izohi..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 resize-none"
            />,
          )}

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl cursor-pointer border-zinc-200 dark:border-zinc-700"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-xl cursor-pointer bg-violet-600 hover:bg-violet-700 text-white"
            >
              {editingPayment ? "Saqlash" : "Saqlash"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
