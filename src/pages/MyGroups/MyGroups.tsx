import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/ApiClient";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ArrowRight,
  Users,
  Clock,
  CalendarDays,
  GraduationCap,
  BookOpen,
  AlertCircle,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Group = {
  id: number;
  name: string;
  currentStudents: number;
  lessonDays: number;
  lessonTime: string;
  teacher: {
    firstName: string;
    lastName: string;
  };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDayLabel(days: number) {
  if (days === 7) return "Har kuni";
  if (days >= 5) return `${days} marta / hafta`;
  if (days === 1) return "Haftada 1 marta";
  return `${days} marta / hafta`;
}

function getCapacityColor(students: number) {
  if (students >= 20)
    return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
  if (students >= 14)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
}

// ─── Skeleton rows ───────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j} className="py-4 px-4">
              <Skeleton className="h-5 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
      <AlertCircle className="w-6 h-6 text-red-500" />
      <p className="text-sm text-red-500">{message}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MyGroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(
          `${api}/groups/teacher/my-groups`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data?.data || res.data || [];
        setGroups(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen dark:bg-black transition-colors">

      {/* FULL WIDTH */}
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6">

        <div className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">

          <div className="overflow-x-auto">
            <Table className="min-w-[800px] w-full">

              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-900">
                  <TableCell className="px-4 py-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      Guruh
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      O‘quvchilar
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      Kunlar
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Vaqt
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      O‘qituvchi
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-xs font-semibold">
                    Amal
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <SkeletonRows />
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <ErrorState message={error} />
                    </TableCell>
                  </TableRow>
                ) : (
                  groups.map((group, idx) => (
                    <TableRow
                      key={group.id}
                      className={`${
                        idx % 2 === 0
                          ? "bg-white dark:bg-black"
                          : "bg-gray-50 dark:bg-gray-900"
                      } hover:bg-indigo-50 dark:hover:bg-gray-800 transition`}
                    >
                      <TableCell className="px-4 py-3 font-medium">
                        {group.name}
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`${getCapacityColor(
                            group.currentStudents
                          )} text-xs`}
                        >
                          {group.currentStudents} ta
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-sm">
                        {getDayLabel(group.lessonDays)}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-sm font-mono">
                        {group.lessonTime}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-sm">
                        {group.teacher
                          ? `${group.teacher.lastName}`
                          : "—"}
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`/group-info/${group.id}`)
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                        >
                          Batafsil
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}