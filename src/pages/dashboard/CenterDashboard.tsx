import apiClient from "@/api/ApiClient";
import { GroupCreateModal } from "@/components/common/Group/GroupCreateModal";
import { StudentCreateModal } from "@/components/common/student/StudentCreateModal";
import { TeacherCreateModal } from "@/components/common/teacher/TeacherCreateModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Coins,
  CreditCard,
  FolderKanban,
  GraduationCap,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type DashboardStatsResponse = {
  teacherCount?: number;
  studentCount?: number;
  totalPayments?: number;
};

type TeacherItem = {
  id: number;
  name: string;
  lastName: string;
  subject: string;
  phone: string;
  createdAt?: string;
  created_at?: string;
};

type GroupItem = {
  id: number;
  name: string;
  lessonDays: string;
  lessonTime: string;
  room: string;
  isActive: boolean;
  currentStudents?: number;
  maxStudents?: number;
  groupStudents?: Array<unknown>;
  createdAt?: string;
  created_at?: string;
};

type PaymentItem = {
  id: number;
  amount: number | string;
  paidAmount: number | string;
  discount: number | string;
  paymentDate: string;
  month: string;
  student: {
    id: number;
    fullName: string;
  };
  group?: {
    id: number;
    name: string;
  };
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("uz-UZ").format(value);

const formatCurrency = (value: number) =>
  `${new Intl.NumberFormat("uz-UZ").format(value)} so'm`;

const formatDate = (value?: string) => {
  if (!value) return "Noma'lum";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Noma'lum";

  return date.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getNumeric = (value: number | string | undefined) => {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getTimestamp = (value?: string) => {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const LESSON_DAY_NUMBER: Record<string, number> = {
  DUSHANBA: 1,
  SESHANBA: 2,
  CHORSHANBA: 3,
  PAYSHANBA: 4,
  JUMA: 5,
  SHANBA: 6,
  YAKSHANBA: 7,
};

const formatLessonDaysCompact = (value?: string) => {
  if (!value) return "--";

  return value
    .split(",")
    .map((day) => LESSON_DAY_NUMBER[day.trim().toUpperCase()])
    .filter((day): day is number => typeof day === "number")
    .sort((a, b) => a - b)
    .map(String)
    .join(" • ");
};

const CenterDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);

  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const centerId = localStorage.getItem("id");

  const requestConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const fetchDashboardData = useCallback(async () => {
    if (!centerId) {
      setError("Learning center ID topilmadi.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const [statisticsRes, teachersRes, studentsRes, groupsRes, paymentsRes] =
        await Promise.all([
          apiClient.get<{ data: DashboardStatsResponse }>(
            `${api}/learning-centers/${centerId}/statistics`,
            requestConfig
          ),
          apiClient.get<{ data: TeacherItem[] }>(
            `${api}/learning-centers/${centerId}/teachers`,
            requestConfig
          ),
          apiClient.get<{ data: Array<{ id: number; fullName: string }> }>(
            `${api}/learning-centers/${centerId}/students`,
            requestConfig
          ),
          apiClient.get<{ data: GroupItem[] }>(
            `${api}/groups/learning-center/${centerId}`,
            requestConfig
          ),
          apiClient.get<{ data: PaymentItem[] }>(
            `${api}/student-payments/learning-center/${centerId}`,
            requestConfig
          ),
        ]);

      const statistics = statisticsRes.data.data ?? {};
      const nextTeachers = teachersRes.data.data ?? [];
      const nextStudents = studentsRes.data.data ?? [];
      const nextGroups = groupsRes.data.data ?? [];
      const nextPayments = paymentsRes.data.data ?? [];

      const paidFromPayments = nextPayments.reduce(
        (sum, payment) => sum + getNumeric(payment.paidAmount),
        0
      );

      setTeachers(nextTeachers);
      setGroups(nextGroups);
      setPayments(nextPayments);
      setTeachersCount(statistics.teacherCount ?? nextTeachers.length);
      setStudentsCount(statistics.studentCount ?? nextStudents.length);
      setTotalPaid(statistics.totalPayments ?? paidFromPayments);
    } catch (fetchError) {
      console.log(fetchError);
      setError("Dashboard ma'lumotlarini yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }, [api, centerId, requestConfig]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalExpected = payments.reduce(
    (sum, payment) => sum + getNumeric(payment.amount),
    0
  );
  const totalDiscount = payments.reduce(
    (sum, payment) => sum + getNumeric(payment.discount),
    0
  );
  const collectionRate =
    totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;
  const activeGroups = groups.filter((group) => group.isActive).length;
  const teacherLoad =
    teachersCount > 0 ? Math.ceil(studentsCount / teachersCount) : 0;

  const latestTeachers = [...teachers]
    .sort(
      (a, b) =>
        getTimestamp(b.createdAt ?? b.created_at) -
        getTimestamp(a.createdAt ?? a.created_at)
    )
    .slice(0, 4);

  const latestPayments = [...payments]
    .sort((a, b) => getTimestamp(b.paymentDate) - getTimestamp(a.paymentDate))
    .slice(0, 4);

  const featuredGroups = [...groups]
    .sort(
      (a, b) =>
        (b.groupStudents?.length ?? b.currentStudents ?? 0) -
        (a.groupStudents?.length ?? a.currentStudents ?? 0)
    )
    .slice(0, 4);

  const stats = [
    {
      id: 1,
      title: "Jami o'quvchilar",
      value: formatNumber(studentsCount),
      growth: `${activeGroups} ta faol guruh`,
      description: "Markazga biriktirilgan o'quvchilar soni.",
      icon: Users,
      tone: "from-sky-500/20 via-cyan-500/10 to-transparent",
      iconWrap:
        "bg-sky-500/15 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    },
    {
      id: 2,
      title: "Umumiy tushum",
      value: formatCurrency(totalPaid),
      growth: `${collectionRate}% undirilgan`,
      description: "To'lovlardan yig'ilgan jami tushum.",
      icon: Coins,
      tone: "from-emerald-500/20 via-green-500/10 to-transparent",
      iconWrap:
        "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      id: 3,
      title: "Faol guruhlar",
      value: formatNumber(activeGroups),
      growth: `${groups.length} ta umumiy guruh`,
      description: "Hozir ishlayotgan guruhlar va oqimlar soni.",
      icon: FolderKanban,
      tone: "from-amber-500/20 via-orange-500/10 to-transparent",
      iconWrap:
        "bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      id: 4,
      title: "Ustoz yuklamasi",
      value: teacherLoad ? `${teacherLoad} ta` : "0",
      growth: `${formatNumber(teachersCount)} nafar ustoz`,
      description: "Bir ustozga to'g'ri kelayotgan o'quvchilar soni.",
      icon: UserCheck,
      tone: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
      iconWrap:
        "bg-violet-500/15 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    },
  ];

  const focusCards = [
    {
      title: "Oxirgi to'lov",
      value: latestPayments[0]
        ? formatCurrency(getNumeric(latestPayments[0].paidAmount))
        : "Ma'lumot yo'q",
      detail: latestPayments[0]
        ? `${latestPayments[0].student.fullName} - ${formatDate(
            latestPayments[0].paymentDate
          )}`
        : "Hali to'lovlar mavjud emas.",
      icon: Wallet,
    },
    {
      title: "Kadrlar balansi",
      value: teacherLoad ? `${teacherLoad} ta o'quvchi / ustoz` : "Ma'lumot yo'q",
      detail: "Bu ko'rsatkich mavjud o'quvchi va ustozlar sonidan hisoblandi.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Chegirmalar summasi",
      value: formatCurrency(totalDiscount),
      detail: `${payments.length} ta to'lov ichidagi jami chegirma hajmi.`,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={cn(
                "relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)] dark:border-zinc-800 dark:bg-fullbg",
                "before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-gradient-to-br",
                item.tone
              )}
            >
              <div className="relative space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className={cn("rounded-2xl p-3", item.iconWrap)}>
                    <Icon className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    {item.growth}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {loading ? "..." : item.value}
                  </h2>
                </div>

                <p className="text-sm leading-6 text-slate-500 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] dark:border-zinc-800 dark:bg-fullbg md:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-zinc-800/60 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                Operatsion overview
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Operatsion snapshot
              </h3>
            </div>
            <Badge className="rounded-full bg-sky-600 px-3 py-1 text-white dark:bg-sky-500">
              {payments.length} ta to'lov
            </Badge>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {focusCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 transition-transform duration-300 hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900/80"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm dark:bg-fullbg dark:text-zinc-200">
                      <Icon className="size-5" />
                    </div>
                    <GraduationCap className="size-4 text-slate-300 dark:text-zinc-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                    {card.title}
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                    {card.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                    {card.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] dark:border-zinc-800 dark:bg-fullbg md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                  Quick actions
                </p>
                <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Tezkor boshqaruv
                </h3>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
                <Sparkles className="size-5" />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-[20px] border border-slate-200 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <p className="font-semibold text-slate-900 dark:text-white">Ustoz qo'shish</p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                  Yangi ustozni shu sahifadan qo'shib, ro'yxatni darhol yangilang.
                </p>
                <div className="mt-4">
                  <TeacherCreateModal
                    onSuccess={fetchDashboardData}
                    classname="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                  />
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-200 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <p className="font-semibold text-slate-900 dark:text-white">O'quvchi qo'shish</p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                  O'quvchini guruhga biriktirib ro'yxatni to'ldiring.
                </p>
                <div className="mt-4">
                  <StudentCreateModal
                    onSuccess={fetchDashboardData}
                    classname="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                  />
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-200 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <p className="font-semibold text-slate-900 dark:text-white">Guruh yaratish</p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                  Kurs, vaqt va ustozni tanlab yangi guruh oching.
                </p>
                <div className="mt-4">
                  <GroupCreateModal
                    onSuccess={fetchDashboardData}
                    classname="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] dark:border-zinc-800 dark:bg-fullbg md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Yangi ustozlar</p>
              <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                So'nggi qo'shilganlar
              </h3>
            </div>
            <Button
              variant="ghost"
              className="cursor-pointer text-sky-700 hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
              onClick={() => navigate("/teachers")}
            >
              Barchasi
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {latestTeachers.length ? (
              latestTeachers.map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => navigate(`/teacher-info/${teacher.id}`)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {teacher.name} {teacher.lastName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                      {teacher.subject}
                    </p>
                  </div>
                  <Badge variant="outline">{teacher.phone}</Badge>
                </button>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
                Ustozlar ro'yxati hali bo'sh.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] dark:border-zinc-800 dark:bg-fullbg md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Faol guruhlar</p>
              <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                Eng band guruhlar
              </h3>
            </div>
            <Button
              variant="ghost"
              className="cursor-pointer text-sky-700 hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
              onClick={() => navigate("/groups")}
            >
              Barchasi
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {featuredGroups.length ? (
              featuredGroups.map((group) => {
                const currentStudents =
                  group.groupStudents?.length ?? group.currentStudents ?? 0;

                return (
                  <button
                    key={group.id}
                    onClick={() => navigate(`/group-info/${group.id}`)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {group.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                        {formatLessonDaysCompact(group.lessonDays)} •{" "}
                        {group.lessonTime?.slice(0, 5) || "--:--"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {currentStudents} / {group.maxStudents ?? 0}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {group.room || "Xona yo'q"}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
                Guruhlar ro'yxati hali bo'sh.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] dark:border-zinc-800 dark:bg-fullbg md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                So'nggi to'lovlar
              </p>
              <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                To'lov oqimi
              </h3>
            </div>
            <Button
              variant="ghost"
              className="cursor-pointer text-sky-700 hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
              onClick={() => navigate("/payments")}
            >
              Barchasi
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {latestPayments.length ? (
              latestPayments.map((payment) => (
                <button
                  key={payment.id}
                  onClick={() => navigate(`/payment-info/${payment.id}`)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">
                      {payment.student.fullName}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-zinc-400">
                      {payment.group?.name || "Guruh ko'rsatilmagan"} •{" "}
                      {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <div className="ml-3 text-right">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(getNumeric(payment.paidAmount))}
                    </p>
                    <div className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CreditCard className="mr-1 size-3" />
                      {payment.month}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
                To'lovlar hali mavjud emas.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] dark:border-zinc-800 dark:bg-fullbg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
              Tez navigatsiya
            </p>
            <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              Asosiy bo'limlarga o'tish
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              className="cursor-pointer rounded-full bg-sky-600 text-white hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
              onClick={() => navigate("/students")}
            >
              <Users className="size-4" />
              O'quvchilar
            </Button>
            <Button
              className="cursor-pointer rounded-full bg-sky-600 text-white hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
              onClick={() => navigate("/teachers")}
            >
              <GraduationCap className="size-4" />
              Ustozlar
            </Button>
            <Button
              className="cursor-pointer rounded-full bg-sky-600 text-white hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
              onClick={() => navigate("/groups")}
            >
              <BookOpen className="size-4" />
              Guruhlar
            </Button>
            <Button
              className="cursor-pointer rounded-full bg-sky-600 text-white hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
              onClick={() => navigate("/payments")}
            >
              <Wallet className="size-4" />
              To'lovlar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CenterDashboard;
