import React, { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Check,
  X,
  Calendar,
  Users,
  RefreshCw,
  ClipboardList,
  BookOpen,
  Clock,
  AlertCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import apiClient from "@/api/ApiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "PRESENT" | "ABSENT";
type ViewMode = "all" | "today";

interface Group {
  id: number;
  name: string;
}

interface Student {
  id: number;
  fullName: string;
  status?: AttendanceStatus;
}

interface Teacher {
  id: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

interface Attendance {
  id: number;
  date: string;
  status: AttendanceStatus;
  group: Group;
  student: Student;
  teacher: Teacher;
  createdAt: string;
  updatedAt: string;
}

interface GroupedAttendance {
  groupId: number;
  groupName: string;
  date: string;
  updatedAt: string;
  studentCount: number;
  teacherId: number;
  records: Attendance[];
}

interface Lesson {
  id: number;
  name: string;
  description: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  group: Group;
  teacher: Teacher;
  attendanceTaken?: boolean;
}

interface AttendancePayload {
  groupId: number;
  teacherId: number;
  date: string;
  students: { studentId: number; status: AttendanceStatus }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ATTENDANCES: Attendance[] = [
  {
    id: 1,
    date: "2026-02-23",
    status: "PRESENT",
    group: { id: 1, name: "Frontend N12" },
    student: { id: 5, fullName: "Ali Valiyev" },
    teacher: { id: 2, fullName: "John Doe" },
    createdAt: "2026-02-23T08:00:00.000Z",
    updatedAt: "2026-02-23T08:00:00.000Z",
  },
  {
    id: 2,
    date: "2026-02-23",
    status: "ABSENT",
    group: { id: 1, name: "Frontend N12" },
    student: { id: 6, fullName: "Malika Rahimova" },
    teacher: { id: 2, fullName: "John Doe" },
    createdAt: "2026-02-23T08:00:00.000Z",
    updatedAt: "2026-02-23T09:15:00.000Z",
  },
  {
    id: 3,
    date: "2026-02-23",
    status: "PRESENT",
    group: { id: 1, name: "Frontend N12" },
    student: { id: 7, fullName: "Jasur Toshmatov" },
    teacher: { id: 2, fullName: "John Doe" },
    createdAt: "2026-02-23T08:00:00.000Z",
    updatedAt: "2026-02-23T09:15:00.000Z",
  },
  {
    id: 4,
    date: "2026-03-10",
    status: "PRESENT",
    group: { id: 2, name: "Backend Pro" },
    student: { id: 8, fullName: "Nodira Yusupova" },
    teacher: { id: 3, fullName: "Jane Smith" },
    createdAt: "2026-03-10T10:00:00.000Z",
    updatedAt: "2026-03-10T10:30:00.000Z",
  },
  {
    id: 5,
    date: "2026-03-10",
    status: "ABSENT",
    group: { id: 2, name: "Backend Pro" },
    student: { id: 9, fullName: "Sardor Ergashev" },
    teacher: { id: 3, fullName: "Jane Smith" },
    createdAt: "2026-03-10T10:00:00.000Z",
    updatedAt: "2026-03-10T10:30:00.000Z",
  },
  {
    id: 6,
    date: "2026-03-15",
    status: "PRESENT",
    group: { id: 3, name: "Flutter Dev" },
    student: { id: 10, fullName: "Kamola Hasanova" },
    teacher: { id: 4, fullName: "Bob Wilson" },
    createdAt: "2026-03-15T09:00:00.000Z",
    updatedAt: "2026-03-15T09:45:00.000Z",
  },
];

const MOCK_LESSONS: Lesson[] = [
  {
    id: 10,
    name: "Matematika 1-dars",
    description: "Algebra asoslari",
    lessonDate: "2026-03-22",
    startTime: "09:00:00",
    endTime: "11:00:00",
    group: { id: 1, name: "Frontend N12" },
    teacher: { id: 2, firstName: "John", lastName: "Doe" },
    attendanceTaken: false,
  },
  {
    id: 11,
    name: "React Advanced",
    description: "Hooks va Context API",
    lessonDate: "2026-03-22",
    startTime: "11:30:00",
    endTime: "13:30:00",
    group: { id: 2, name: "Backend Pro" },
    teacher: { id: 3, firstName: "Jane", lastName: "Smith" },
    attendanceTaken: true,
  },
  {
    id: 12,
    name: "Flutter UI",
    description: "Widget tree",
    lessonDate: "2026-03-22",
    startTime: "14:00:00",
    endTime: "16:00:00",
    group: { id: 3, name: "Flutter Dev" },
    teacher: { id: 4, firstName: "Bob", lastName: "Wilson" },
    attendanceTaken: false,
  },
];

const MOCK_STUDENTS: Student[] = [
  { id: 5, fullName: "Ali Valiyev" },
  { id: 6, fullName: "Malika Rahimova" },
  { id: 7, fullName: "Jasur Toshmatov" },
  { id: 8, fullName: "Nodira Yusupova" },
  { id: 9, fullName: "Sardor Ergashev" },
  { id: 10, fullName: "Kamola Hasanova" },
  { id: 11, fullName: "Dilshod Nazarov" },
  { id: 12, fullName: "Zulfiya Mirova" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupAttendances(attendances: Attendance[]): GroupedAttendance[] {
  const map = new Map<string, GroupedAttendance>();
  for (const a of attendances) {
    const key = `${a.group.id}-${a.date}`;
    if (!map.has(key)) {
      map.set(key, {
        groupId: a.group.id,
        groupName: a.group.name,
        date: a.date,
        updatedAt: a.updatedAt,
        studentCount: 0,
        teacherId: a.teacher.id,
        records: [],
      });
    }
    const entry = map.get(key)!;
    entry.studentCount += 1;
    entry.records.push(a);
    if (new Date(a.updatedAt) > new Date(entry.updatedAt)) {
      entry.updatedAt = a.updatedAt;
    }
  }
  return Array.from(map.values());
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function getTeacherFullName(teacher: Teacher): string {
  if (teacher.fullName) return teacher.fullName;
  return `${teacher.firstName ?? ""} ${teacher.lastName ?? ""}`.trim();
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── SkeletonLoader ───────────────────────────────────────────────────────────

function SkeletonLoader({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 flex gap-4">
        {[30, 20, 15, 20, 15].map((w, i) => (
          <div
            key={i}
            className="h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="px-6 py-4 flex gap-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
        >
          {[30, 20, 15, 20, 15].map((w, j) => (
            <div
              key={j}
              className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              Ishonchingiz komilmi?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Bu amalni bajarishni tasdiqlaysizmi?
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Tasdiqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AttendanceModal ──────────────────────────────────────────────────────────

interface AttendanceModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  lesson?: Lesson;
  existingRecords?: Attendance[];
  onSave: (payload: AttendancePayload) => Promise<void>;
}

function AttendanceModal({
  open,
  onClose,
  mode,
  lesson,
  existingRecords,
  onSave,
}: AttendanceModalProps) {
  const [studentStatuses, setStudentStatuses] = useState<
    Record<number, AttendanceStatus>
  >({});
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingStudents(true);
    const timer = setTimeout(() => {
      const initial: Record<number, AttendanceStatus> = {};
      MOCK_STUDENTS.forEach((s) => {
        if (mode === "update" && existingRecords) {
          const rec = existingRecords.find((r) => r.student.id === s.id);
          initial[s.id] = rec ? rec.status : "PRESENT";
        } else {
          initial[s.id] = "PRESENT";
        }
      });
      setStudentStatuses(initial);
      setLoadingStudents(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [open, mode, existingRecords]);

  const toggleStatus = (studentId: number) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "PRESENT" ? "ABSENT" : "PRESENT",
    }));
  };

  const handleSaveClick = () => setConfirmOpen(true);

  const handleConfirm = async () => {
    if (!lesson) return;
    setSaving(true);
    const payload: AttendancePayload = {
      groupId: lesson.group.id,
      teacherId: lesson.teacher.id,
      date: getTodayStr(),
      students: MOCK_STUDENTS.map((s) => ({
        studentId: s.id,
        status: studentStatuses[s.id] ?? "PRESENT",
      })),
    };
    await onSave(payload);
    setSaving(false);
    setConfirmOpen(false);
    onClose();
  };

  if (!open) return null;

  const presentCount = Object.values(studentStatuses).filter(
    (s) => s === "PRESENT",
  ).length;
  const absentCount = Object.values(studentStatuses).filter(
    (s) => s === "ABSENT",
  ).length;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {mode === "create" ? "Davomat olish" : "Davomatni yangilash"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {lesson?.group.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="cursor-pointer w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Group */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Guruh
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                    {lesson?.group.name ?? "—"}
                  </span>
                </div>
              </div>
              {/* Teacher */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  O'qituvchi
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                    {lesson ? getTeacherFullName(lesson.teacher) : "—"}
                  </span>
                </div>
              </div>
              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Sana
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {getTodayStr()}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            {!loadingStudents && (
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Keldi
                    </p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 leading-tight">
                      {presentCount}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                    <X className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                      Kelmadi
                    </p>
                    <p className="text-lg font-bold text-rose-700 dark:text-rose-300 leading-tight">
                      {absentCount}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <Users className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Jami</p>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300 leading-tight">
                      {MOCK_STUDENTS.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Students List */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                O'quvchilar ro'yxati
              </h3>

              {loadingStudents ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {MOCK_STUDENTS.map((student, index) => {
                    const status = studentStatuses[student.id] ?? "PRESENT";
                    const isPresent = status === "PRESENT";
                    return (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          isPresent
                            ? "border-emerald-100 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                            : "border-rose-100 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isPresent
                                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                                : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {student.fullName}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setStudentStatuses((prev) => ({
                                ...prev,
                                [student.id]: "PRESENT",
                              }))
                            }
                            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isPresent
                                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900"
                                : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Keldi
                          </button>
                          <button
                            onClick={() =>
                              setStudentStatuses((prev) => ({
                                ...prev,
                                [student.id]: "ABSENT",
                              }))
                            }
                            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              !isPresent
                                ? "bg-rose-500 text-white shadow-sm shadow-rose-200 dark:shadow-rose-900"
                                : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-rose-300"
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            Kelmadi
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-5 cursor-pointer py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSaveClick}
              disabled={loadingStudents}
              className="px-5 cursor-pointer py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-60 shadow-sm shadow-indigo-200 dark:shadow-indigo-900"
            >
              <Check className="w-4 h-4" />
              Saqlash
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={saving}
      />
    </>
  );
}

// ─── AttendanceTable ──────────────────────────────────────────────────────────

interface AttendanceTableProps {
  data: GroupedAttendance[];
  loading: boolean;
  onUpdate: (group: GroupedAttendance) => void;
}

function AttendanceTable({ data, loading, onUpdate }: AttendanceTableProps) {
  if (loading) return <SkeletonLoader rows={5} />;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Ma'lumot topilmadi
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Hozircha davomatlar mavjud emas
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <th className=" text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Guruh Nomi
            </th>
            <th className="text-center  px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Sana
            </th>
            <th className="text-center  px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              O'quvchilar soni
            </th>
            <th className="text-center  px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Oxirgi yangilanish
            </th>
            <th className=" px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Amallar
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={`${row.groupId}-${row.date}`}
              className={`border-b  border-slate-100 text-center dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                i === data.length - 1 ? "border-b-0" : ""
              }`}
            >
              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {row.groupName}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center text-center justify-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(row.date)}
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  <Users className="w-3 h-3" />
                  {row.studentCount} ta
                </span>
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">
                {formatDateTime(row.updatedAt)}
              </td>
              <td className="px-5 py-4 flex items-center justify-center">
                <button
                  onClick={() => onUpdate(row)}
                  className="flex items-center cursor-pointer  gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Yangilash
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── LessonsTable ─────────────────────────────────────────────────────────────

interface LessonsTableProps {
  data: Lesson[];
  loading: boolean;
  onTakeAttendance: (lesson: Lesson) => void;
  onUpdateAttendance: (lesson: Lesson) => void;
}

function LessonsTable({
  data,
  loading,
  onTakeAttendance,
  onUpdateAttendance,
}: LessonsTableProps) {
  if (loading) return <SkeletonLoader rows={4} />;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Bugun dars yo'q
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bugungi darslar hali rejalashtirilmagan
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Guruh Nomi
            </th>
            <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Vaqti
            </th>
            <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              O'quvchilar soni
            </th>
            <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Status
            </th>
            <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Amallar
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((lesson, i) => (
            <tr
              key={lesson.id}
              className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                i === data.length - 1 ? "border-b-0" : ""
              }`}
            >
              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {lesson.group.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {lesson.name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {formatTime(lesson.startTime)} –{" "}
                    {formatTime(lesson.endTime)}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="flex items-center justify-center text-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  <Users className="w-3 h-3" />
                  {MOCK_STUDENTS.length} ta
                </span>
              </td>
              <td className="px-5 py-4 flex items-center justify-center">
                {lesson.attendanceTaken ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                    Davomat olingan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                    <X className="w-3.5 h-3.5" />
                    Davomat olinmagan
                  </span>
                )}
              </td>
              <td className="px-5 py-4 text-center">
                {lesson.attendanceTaken ? (
                  <button
                    onClick={() => onUpdateAttendance(lesson)}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Yangilash
                  </button>
                ) : (
                  <button
                    onClick={() => onTakeAttendance(lesson)}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    Davomat olish
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Custom Select ────────────────────────────────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex cursor-pointer items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm font-medium min-w-[220px] hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors shadow-sm"
      >
        <span className="flex-1 text-left">{selected?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-9 max-w-[220px] left-0 mt-1.5 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                  opt.value === value
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {opt.value === value && <Check className="w-3.5 h-3.5" />}
                {opt.value !== value && <span className="w-3.5" />}
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── AttendancesPage ──────────────────────────────────────────────────────────

export default function AttendancesCenter() {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [loading, setLoading] = useState(true);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
  const [existingRecords, setExistingRecords] = useState<Attendance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const api = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("access_token");
        if (viewMode === "all") {
          const res = await apiClient.get(
            `${api}/attendances/learning-center/findAll`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setAttendances(res.data);
        } else {
          // const res = await apiClient.get();
          // setLessons(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode]);

  const grouped = groupAttendances(attendances);

  const handleUpdateAttendance = (group: GroupedAttendance) => {
    // Find a matching lesson from records
    const mockLesson: Lesson = {
      id: group.groupId * 100,
      name: "Dars",
      description: "",
      lessonDate: group.date,
      startTime: "09:00:00",
      endTime: "11:00:00",
      group: { id: group.groupId, name: group.groupName },
      teacher: { id: group.teacherId, firstName: "O'qituvchi", lastName: "" },
    };
    setSelectedLesson(mockLesson);
    setExistingRecords(group.records);
    setModalMode("update");
    setModalOpen(true);
  };

  const handleTakeAttendance = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setExistingRecords([]);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleUpdateLesson = (lesson: Lesson) => {
    const records = attendances.filter((a) => a.group.id === lesson.group.id);
    setSelectedLesson(lesson);
    setExistingRecords(records);
    setModalMode("update");
    setModalOpen(true);
  };

  const handleSave = useCallback(
    async (payload: AttendancePayload) => {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Saved payload:", payload);

      // Update lessons state to mark attendance as taken
      if (viewMode === "today" && selectedLesson) {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === selectedLesson.id ? { ...l, attendanceTaken: true } : l,
          ),
        );
      }
    },
    [viewMode, selectedLesson],
  );

  const selectOptions: SelectOption[] = [
    { value: "all", label: "Barcha Davomatlar" },
    { value: "today", label: "Bugungi Darslar" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-background font-sans">
      {/* Page wrapper */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-300 dark:shadow-indigo-900">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Davomatlar
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {getTodayStr()} — barcha guruhlar
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <CustomSelect
            value={viewMode}
            onChange={(v) => setViewMode(v as ViewMode)}
            options={selectOptions}
          />

          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Avtomatik yangilanish: har 5 daqiqada</span>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {viewMode === "all"
              ? [
                  {
                    label: "Jami guruhlar",
                    value: grouped.length,
                    icon: Users,
                    color: "indigo",
                  },
                  {
                    label: "Jami o'quvchilar",
                    value: attendances.length,
                    icon: Users,
                    color: "violet",
                  },
                  {
                    label: "Kelganlar",
                    value: attendances.filter((a) => a.status === "PRESENT")
                      .length,
                    icon: Check,
                    color: "emerald",
                  },
                  {
                    label: "Kelmadiklar",
                    value: attendances.filter((a) => a.status === "ABSENT")
                      .length,
                    icon: X,
                    color: "rose",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-4 flex items-center gap-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        card.color === "indigo"
                          ? "bg-indigo-50 dark:bg-indigo-900/30"
                          : card.color === "violet"
                            ? "bg-violet-50 dark:bg-violet-900/30"
                            : card.color === "emerald"
                              ? "bg-emerald-50 dark:bg-emerald-900/30"
                              : "bg-rose-50 dark:bg-rose-900/30"
                      }`}
                    >
                      <card.icon
                        className={`w-4 h-4 ${
                          card.color === "indigo"
                            ? "text-indigo-500"
                            : card.color === "violet"
                              ? "text-violet-500"
                              : card.color === "emerald"
                                ? "text-emerald-500"
                                : "text-rose-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {card.label}
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {card.value}
                      </p>
                    </div>
                  </div>
                ))
              : [
                  {
                    label: "Jami darslar",
                    value: lessons.length,
                    icon: BookOpen,
                    color: "violet",
                  },
                  {
                    label: "Davomat olingan",
                    value: lessons.filter((l) => l.attendanceTaken).length,
                    icon: Check,
                    color: "emerald",
                  },
                  {
                    label: "Davomat olinmagan",
                    value: lessons.filter((l) => !l.attendanceTaken).length,
                    icon: X,
                    color: "rose",
                  },
                  {
                    label: "Jami o'quvchilar",
                    value: lessons.length * MOCK_STUDENTS.length,
                    icon: Users,
                    color: "indigo",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-4 flex items-center gap-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        card.color === "indigo"
                          ? "bg-indigo-50 dark:bg-indigo-900/30"
                          : card.color === "violet"
                            ? "bg-violet-50 dark:bg-violet-900/30"
                            : card.color === "emerald"
                              ? "bg-emerald-50 dark:bg-emerald-900/30"
                              : "bg-rose-50 dark:bg-rose-900/30"
                      }`}
                    >
                      <card.icon
                        className={`w-4 h-4 ${
                          card.color === "indigo"
                            ? "text-indigo-500"
                            : card.color === "violet"
                              ? "text-violet-500"
                              : card.color === "emerald"
                                ? "text-emerald-500"
                                : "text-rose-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {card.label}
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {card.value}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {viewMode === "all" ? "Barcha Davomatlar" : "Bugungi Darslar"}
            </h2>
            {!loading && (
              <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                {viewMode === "all" ? grouped.length : lessons.length} ta yozuv
              </span>
            )}
          </div>
          <div className="p-5">
            {viewMode === "all" ? (
              <AttendanceTable
                data={grouped}
                loading={loading}
                onUpdate={handleUpdateAttendance}
              />
            ) : (
              <LessonsTable
                data={lessons}
                loading={loading}
                onTakeAttendance={handleTakeAttendance}
                onUpdateAttendance={handleUpdateLesson}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AttendanceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        lesson={selectedLesson}
        existingRecords={existingRecords}
        onSave={handleSave}
      />
    </div>
  );
}
