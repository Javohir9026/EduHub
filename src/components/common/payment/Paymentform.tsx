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
  return today.toISOString().slice(0, 7);
};

const defaultForm = {
  student_id: 0,
  group_id: 0,
  amount: 0,
  paidAmount: "",
  discount: "",
  month: getCurrentMonth(),
  description: "",
};

// "1,234,567" → 1234567
const parseNumber = (value: string): number => {
  if (!value) return 0;
  const cleaned = String(value).replace(/,/g, "").replace(/\s/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed);
};

// 1234567 → "1,234,567"
const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  const [groups, setGroups] = useState<GroupDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // Validation: paidAmount + discount <= amount
  useEffect(() => {
    const paid = parseNumber(String(form.paidAmount));
    const discount = parseNumber(String(form.discount));
    const amount = Math.round(parseFloat(String(form.amount)) || 0);
    const total = paid + discount;

    if (amount > 0 && total > amount) {
      setError("To'langan summa va chegirma jami miqdordan oshib ketdi!");
    } else {
      setError("");
    }
  }, [form.paidAmount, form.discount, form.amount]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL;
      const id = localStorage.getItem("id");
      const res = await apiClient.get(`${api}/groups/learning-center/${id}`);
      setGroups(res.data.data);
    } catch (err) {
      console.error("Groups fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const getOnePayment = async (id: string) => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL;
      const res = await apiClient.get(`${api}/student-payments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = res.data.data;
      setForm({
        student_id: data.student?.id ?? 0,
        group_id: data.group?.id ?? 0,
        // amount ni number ga o'tkazamiz, Math.round bilan
        amount: Math.round(parseFloat(String(data.amount)) || 0),
        paidAmount: formatCurrency(
          String(Math.round(parseFloat(String(data.paidAmount)) || 0)),
        ),
        discount: formatCurrency(
          String(Math.round(parseFloat(String(data.discount)) || 0)),
        ),
        month: data.month?.slice(0, 7) ?? getCurrentMonth(),
        description: data.description ?? "",
      });
    } catch (err) {
      console.error("Payment fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Dialog ochilganda / editingPayment o'zgarganda
  useEffect(() => {
    if (!open) return;
    if (editingPayment) {
      getOnePayment(String(editingPayment.id));
    } else {
      setForm({ ...defaultForm, month: getCurrentMonth() });
      setError("");
    }
  }, [editingPayment, open]);

  // groups keyin kelsa va edit rejimida bo'lsak — qayta fetch
  useEffect(() => {
    if (editingPayment && groups.length > 0) {
      getOnePayment(String(editingPayment.id));
    }
  }, [groups]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (error) return;

    if (form.group_id === 0) {
      setError("Guruhni tanlang!");
      return;
    }
    if (form.student_id === 0) {
      setError("O'quvchini tanlang!");
      return;
    }
    if (!form.month) {
      setError("Sanani tanlang!");
      return;
    }

    const payload: PaymentFormData = {
      ...form,
      // amount ni aniq number qilib yuboramiz
      amount: Math.round(parseFloat(String(form.amount)) || 0),
      paidAmount: parseNumber(String(form.paidAmount)),
      discount: parseNumber(String(form.discount)),
      month: form.month + "-01",
    };

    onSubmit(payload);
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
      <DialogContent className="sm:max-w-lg bg-white dark:bg-background border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {editingPayment ? "To'lovni Yangilash" : "Yangi To'lov Kiritish"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
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
                      // monthlyPrice ni ham round qilamiz
                      amount: Math.round(
                        parseFloat(String(group?.monthlyPrice ?? 0)) || 0,
                      ),
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
                    className="rounded-xl w-full border-zinc-200 dark:border-zinc-700"
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
                      ? `${Math.round(Number(form.amount)).toLocaleString()} UZS`
                      : ""
                  }
                  className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
                />,
              )}

              {field(
                "To'lanadi (UZS)",
                <div className="relative">
                  <Input
                    value={form.paidAmount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paidAmount: formatCurrency(e.target.value),
                      })
                    }
                    placeholder="0"
                    className="rounded-xl border-zinc-200 dark:border-zinc-700 pr-14"
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
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discount: formatCurrency(e.target.value),
                      })
                    }
                    placeholder="0"
                    className="rounded-xl border-zinc-200 dark:border-zinc-700 pr-14"
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
                className="rounded-xl border-zinc-200 dark:border-zinc-700"
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
                className="rounded-xl border-zinc-200 dark:border-zinc-700 resize-none"
              />,
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              
                className="rounded-xl cursor-pointer border-zinc-200 dark:border-zinc-700"
              >
                Bekor qilish
              </Button>

              <Button
                type="submit"
                disabled={loadingMain || !!error}
                className="rounded-xl cursor-pointer bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2"
              >
                {loadingMain && <Loader2 className="w-4 h-4 animate-spin" />}
                {loadingMain ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
