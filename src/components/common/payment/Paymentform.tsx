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
import { STUDENTS, GROUPS } from "./mockData";
import type { Payment, PaymentFormData } from "@/lib/types";

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  editingPayment: Payment | null;
}

const defaultForm: PaymentFormData = {
  student_id: 0,
  group_id: 0,
  amount: 0,
  paidAmount: 0,
  discount: 0,
  month: "",
  description: "",
};

export function PaymentForm({
  open,
  onClose,
  onSubmit,
  editingPayment,
}: PaymentFormProps) {
  const [form, setForm] = useState<PaymentFormData>(defaultForm);

  useEffect(() => {
    if (editingPayment) {
      setForm({
        student_id: editingPayment.student.id,
        group_id: editingPayment.group.id,
        amount: editingPayment.amount,
        paidAmount: editingPayment.paidAmount,
        discount: editingPayment.discount,
        month: editingPayment.month.slice(0, 7), // yyyy-MM
        description: editingPayment.description,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingPayment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_id || !form.group_id || !form.month) return;
    onSubmit({ ...form, month: form.month + "-01" });
  };

  const field = (label: string, children: React.ReactNode) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {editingPayment ? "To'lovni Yangilash" : "Yangi To'lov Kiritish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field(
              "O'quvchi",
              <Select
                value={form.student_id ? String(form.student_id) : ""}
                onValueChange={(v) =>
                  setForm({ ...form, student_id: Number(v) })
                }
              >
                <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800">
                  <SelectValue placeholder="O'quvchini Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {STUDENTS.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>,
            )}

            {field(
              "Guruh",
              <Select
                value={form.group_id ? String(form.group_id) : ""}
                onValueChange={(v) => setForm({ ...form, group_id: Number(v) })}
              >
                <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800">
                  <SelectValue placeholder="Guruhni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {GROUPS.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>,
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {field(
              "Miqdor (UZS)",
              <Input
                type="number"
                placeholder="500000 UZS"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
                className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
              />,
            )}
            {field(
              "To'lanadi (UZS)",
              <Input
                type="number"
                placeholder="500000 UZS"
                value={form.paidAmount || ""}
                onChange={(e) =>
                  setForm({ ...form, paidAmount: Number(e.target.value) })
                }
                className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
              />,
            )}
            {field(
              "Chegirma (UZS)",
              <Input
                type="number"
                placeholder="0"
                value={form.discount || ""}
                onChange={(e) =>
                  setForm({ ...form, discount: Number(e.target.value) })
                }
                className="rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
              />,
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
              className="rounded-xl border-zinc-200 dark:border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white"
            >
              {editingPayment ? "Save Changes" : "Add Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
