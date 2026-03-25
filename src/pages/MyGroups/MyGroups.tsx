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
  if (days === 7) return "Every day";
  if (days >= 5) return `${days}× / week`;
  if (days === 1) return "Once / week";
  return `${days}× / week`;
}

function getCapacityColor(students: number) {
  if (students >= 20) return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
  if (students >= 14) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
}

// ─── Skeleton rows ───────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-b border-slate-100 dark:border-slate-800">
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j} className="py-4 px-5">
              <Skeleton className="h-5 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <BookOpen className="w-7 h-7 text-slate-400 dark:text-slate-500" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
          No groups found
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          You haven't been assigned to any groups yet.
        </p>
      </div>
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-rose-500" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
          Failed to load groups
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{message}</p>
      </div>
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
        setError(
          err?.response?.data?.message || "Failed to load groups"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const headerCells = [
    { label: "Group Name", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: "Students", icon: <Users className="w-3.5 h-3.5" /> },
    { label: "Lesson Days", icon: <CalendarDays className="w-3.5 h-3.5" /> },
    { label: "Lesson Time", icon: <Clock className="w-3.5 h-3.5" /> },
    { label: "Teacher", icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { label: "Action", icon: null },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              My Groups
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-12">
            All groups you are currently enrolled in or managing.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-300">

          {/* Stats */}
          {!loading && !error && groups.length > 0 && (
            <div className="flex items-center gap-6 px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total groups:{" "}
                <span className="text-slate-800 dark:text-slate-100 font-semibold">
                  {groups.length}
                </span>
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total students:{" "}
                <span className="text-slate-800 dark:text-slate-100 font-semibold">
                  {groups.reduce((s, g) => s + g.currentStudents, 0)}
                </span>
              </span>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 dark:border-slate-800 hover:bg-transparent">
                  {headerCells.map(({ label, icon }) => (
                    <TableCell
                      key={label}
                      className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50 whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1.5">
                        {icon}
                        {label}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <SkeletonRows />
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <ErrorState message={error} />
                    </TableCell>
                  </TableRow>
                ) : groups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <EmptyState />
                    </TableCell>
                  </TableRow>
                ) : (
                  groups.map((group, idx) => (
                    <TableRow
                      key={group.id}
                      className={[
                        "border-b border-slate-100 dark:border-slate-800/70",
                        "transition-colors duration-150",
                        "hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30",
                        "group cursor-default",
                        idx % 2 === 0
                          ? "bg-white dark:bg-slate-900"
                          : "bg-slate-50/40 dark:bg-slate-800/20",
                      ].join(" ")}
                    >
                      <TableCell className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                          {group.name}
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <Badge
                          className={[
                            "text-xs font-semibold px-2.5 py-0.5 rounded-full border-0",
                            getCapacityColor(group.currentStudents),
                          ].join(" ")}
                        >
                          {group.currentStudents} students
                        </Badge>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {getDayLabel(group.lessonDays)}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap font-mono">
                        {group.lessonTime}
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5 ">
                          {/* <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0"> */}
                            {/* {group.teacher?.firstName?.[0] || "?"} */}
                            {/* {group.teacher?.lastName?.[0] || "?"} */}
                          {/* </div> */}
                          <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                            {group.teacher
                              ? `${group.teacher.lastName}`
                              : "No teacher"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/group-info/${group.id}`)}
                          className="gap-1.5 font-medium text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          Details
                          <ArrowRight className="w-3.5 h-3.5" />
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