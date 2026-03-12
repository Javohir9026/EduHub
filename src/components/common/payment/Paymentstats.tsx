import { DollarSign, CheckCircle, Tag } from "lucide-react";
import { formatCurrency, } from "./mockData";
import type { Payment } from "@/lib/types";

interface PaymentStatsProps {
  payments: Payment[];
}

export function PaymentStats({ payments }: PaymentStatsProps) {
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalDiscount = payments.reduce((sum, p) => sum + p.discount, 0);

  const stats = [
    {
      title: "Total Amount",
      value: formatCurrency(totalAmount),
      icon: DollarSign,
      color: "text-violet-500",
      bg: "bg-violet-500/10 dark:bg-violet-500/15",
      border: "border-violet-200/60 dark:border-violet-500/20",
      badge: `${payments.length} payments`,
    },
    {
      title: "Total Paid",
      value: formatCurrency(totalPaid),
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      border: "border-emerald-200/60 dark:border-emerald-500/20",
      badge: `${Math.round((totalPaid / totalAmount) * 100)}% collected`,
    },
    {
      title: "Total Discount",
      value: formatCurrency(totalDiscount),
      icon: Tag,
      color: "text-amber-500",
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      border: "border-amber-200/60 dark:border-amber-500/20",
      badge: `${payments.filter((p) => p.discount > 0).length} with discount`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className={`relative rounded-2xl border ${stat.border} bg-white dark:bg-zinc-900 p-5 shadow-sm overflow-hidden transition-all hover:shadow-md`}
          >
            {/* Subtle background glow */}
            <div
              className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl`}
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 truncate">
                  {stat.value}
                </p>
                <span className="inline-block mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {stat.badge}
                </span>
              </div>
              <div className={`shrink-0 p-2.5 rounded-xl ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}