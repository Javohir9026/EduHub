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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  loadingMain: boolean;
  editingPayment: Payment | null;
}

const getCurrentMonth = () => {
  const today = new Date();
  return today.toISOString().slice(0, 7); // YYYY-MM
};

const defaultForm: any = {
  student_id: 0,
  group_id: 0,
  amount: 0,
  paidAmount: "",
  discount: "",
  month: getCurrentMonth(),
  description: "",
};
export function PaymentForm({
  open,
  onClose,
  onSubmit,
  loadingMain,
  editingPayment,
}: PaymentFormProps) {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
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
  useEffect(() => {
    const paid = parseNumber(form.paidAmount || "0");
    const discount = parseNumber(form.discount || "0");
    const total = paid + discount;

    if (total > Number(form.amount)) {
      setError("To'langan summa va chegirma jami miqdordan oshib ketdi!");
    } else {
      setError("");
    }
  }, [form.paidAmount, form.discount, form.amount]);
  const fetchGroups = async () => {
    try {
      setloading(true);
      const api = import.meta.env.VITE_API_URL;
      const id = localStorage.getItem("id");
      const res = await apiClient.get(`${api}/groups/learning-center/${id}`);
      setGroups(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchGroups();
  }, []);
  const GetOnePayment = async (id: string) => {
    try {
      setloading(true);
      const api = import.meta.env.VITE_API_URL;
      const res = await apiClient.get(`${api}/student-payments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setForm({
        student_id: res.data.data.student.id,
        group_id: res.data.data.group?.id,
        amount: res.data.data.amount,
        paidAmount: formatCurrency(String(Number(res.data.data.paidAmount))),
        discount: formatCurrency(String(Number(res.data.data.discount))),
        month: res.data.data?.month?.slice(0, 7),
        description: res.data.data?.description,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    if (editingPayment) {
      GetOnePayment(String(editingPayment.id));
    } else {
      setForm({
        ...defaultForm,
        month: new Date().toISOString().slice(0, 7),
      });
    }
  }, [editingPayment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (error) return;

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
  useEffect(() => {
    if (editingPayment && groups.length) {
      GetOnePayment(String(editingPayment.id));
    }
  }, [editingPayment, groups]);
  const selectedGroup = groups.find((g) => g.id === form.group_id);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-background border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {editingPayment ? "To'lovni Yangilash" : "Yangi To'lov Kiritish"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            {/* Guruh + O'quvchi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            {/* Miqdor / Tolandi / Chegirma */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            {/* Sana */}
            <Skeleton className="h-10 w-full rounded-xl" />

            {/* Description */}
            <Skeleton className="h-20 w-full rounded-xl" />

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field(
                "Guruh",
                <Select
                  disabled={!!editingPayment}
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
                  <SelectTrigger className="rounded-xl w-full border-zinc-200 dark:border-zinc-700">
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
                  disabled={!form.group_id || !!editingPayment}
                  value={form.student_id ? String(form.student_id) : undefined}
                  onValueChange={(v) =>
                    setForm({ ...form, student_id: Number(v) })
                  }
                >
                  <SelectTrigger
                    disabled={!form.group_id || !!editingPayment}
                    className="rounded-xl w-full border-zinc-200 dark:border-zinc-700 "
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
                  className="rounded-xl border-zinc-200 dark:border-zinc-700 "
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
                    className="rounded-xl border-zinc-200 dark:border-zinc-700  pr-14"
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
                    className="rounded-xl border-zinc-200 dark:border-zinc-700  pr-14"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                    UZS
                  </span>
                </div>,
              )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            {field(
              "Sana",
              <Input
                disabled={!!editingPayment}
                type="month"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                className="rounded-xl border-zinc-200 dark:border-zinc-700 "
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
                className="rounded-xl border-zinc-200 dark:border-zinc-700  resize-none"
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
                disabled={loadingMain}
                className="rounded-xl cursor-pointer bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2"
              >
                {loadingMain && <Loader2 className="w-4 h-4 animate-spin" />}

                {loadingMain
                  ? "Saqlanmoqda..."
                  : editingPayment
                    ? "Saqlash"
                    : "Saqlash"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
