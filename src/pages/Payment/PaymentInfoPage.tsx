import apiClient from "@/api/ApiClient";
import {
  User,
  Users,
  CreditCard,
  Calendar,
  Tag,
  CheckCircle2,
  BadgeDollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Payment {
  id: number;
  amount: number;
  paidAmount: number;
  discount: number;
  month: string;
  student: { id: number; fullName: string };
  group: { id: number; name: string };
}

const mockPayment: Payment = {
  id: 1,
  amount: 500000,
  paidAmount: 500000,
  discount: 0,
  month: "2025-03-01",
  student: { id: 1, fullName: "Ali Valiyev" },
  group: { id: 2, name: "Backend N1" },
};

function formatCurrency(value: number): string {
  return value.toLocaleString("uz-UZ") + " UZS";
}

function formatMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uz-UZ", { year: "numeric", month: "long" });
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

interface AmountCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant: "total" | "paid" | "discount";
}

function AmountCard({ icon, label, value, variant }: AmountCardProps) {
  const styles = {
    total:
      "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg",
    paid: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg",
    discount:
      "bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg",
  };

  return (
    <div
      className={`rounded-2xl p-5 ${styles[variant]} hover:-translate-y-0.5 transition`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        {variant === "paid" && <CheckCircle2 className="w-5 h-5 text-white" />}
      </div>

      <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-xl font-bold">{formatCurrency(value)}</p>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="text-indigo-500 dark:text-indigo-400">{icon}</div>
        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">
          {title}
        </h3>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

export default function PaymentInfoPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<Payment>();
  const fetchData = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL;
      const res = await apiClient.get(`${api}/student-payments/${id}`);
      setPayment(res.data);
    } catch (error) {
      console.log(error);
    }finally{
        setLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return loading ? (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-background">
      <div className="w-full mx-auto px-4 sm:px-6 py-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
        </div>

        {/* Amount cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-700"></div>
        </div>

        {/* Sections skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-700"></div>
        </div>

        {/* Payment period skeleton */}
        <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-700"></div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-background">
      <div className="w-full mx-auto px-4 sm:px-6 py-8">
        {/* Sahifa nomi */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              To'lov Tafsilotlari
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              To'lov #{payment?.id}
            </p>
          </div>
        </div>

        {/* Amount Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <AmountCard
            icon={<BadgeDollarSign className="w-5 h-5" />}
            label="Umumiy summa"
            value={payment?.amount ?? 0}
            variant="total"
          />

          <AmountCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="To'langan summa"
            value={payment?.paidAmount ?? 0}
            variant="paid"
          />

          <AmountCard
            icon={<Tag className="w-5 h-5" />}
            label="Chegirma"
            value={payment?.discount ?? 0}
            variant="discount"
          />
        </div>

        {/* Student + Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Section title="O'quvchi" icon={<User className="w-4 h-4" />}>
            <InfoRow
              icon={<User className="w-4 h-4" />}
              label="Ism Familiya"
              value={payment?.student?.fullName ?? ""}
            />
          </Section>

          <Section title="Guruh" icon={<Users className="w-4 h-4" />}>
            <InfoRow
              icon={<Users className="w-4 h-4" />}
              label="Guruh nomi"
              value={payment?.group?.name ?? ""}
            />
          </Section>
        </div>

        {/* Payment Period */}
        <Section title="To'lov davri" icon={<Calendar className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Oy"
              value={formatMonth(payment?.month ?? "")}
            />

            <InfoRow
              icon={<CreditCard className="w-4 h-4" />}
              label="To'lov holati"
              value={
                (payment?.paidAmount ?? 0) >= (payment?.amount ?? 0)
                  ? "To'liq to'langan ✓"
                  : "Qisman to'langan"
              }
            />
          </div>
        </Section>
      </div>
    </div>
  );
}
