// ─────────────────────────────────────────────────────────────────
// AttendancePage.tsx  –  Learning Center Davomat (Attendance) Page
// Stack: React 18 + TypeScript + shadcn/ui + lucide-react + Tailwind
// ─────────────────────────────────────────────────────────────────

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // or next/navigation

// shadcn/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// lucide-react
import {
  Plus,
  Users,
  Pencil,
  Trash2,
  Search,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// ─── Types ────────────────────────────────────────────────────────

export interface Group {
  id: number;
  name: string;
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Lesson {
  id: number;
  name: string;
  description: string;
  lessonDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM:SS"
  endTime: string; // "HH:MM:SS"
  group: Group;
  teacher: Teacher;
}

export interface CreateLessonPayload {
  name: string;
  description: string;
  groupId: number | string;
  teacherId: number | string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  learningCenterId: number;
}

type FilterMode = "today" | "all";

// ─── Helpers ──────────────────────────────────────────────────────

const getTodayString = (): string => new Date().toISOString().slice(0, 10);

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "–";
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
};

const formatTime = (time: string): string => (time ? time.slice(0, 5) : "–");

// ─── API Calls (replace with real endpoints) ──────────────────────

const API_BASE = "/api"; // ← change to your base URL

async function fetchLessons(): Promise<Lesson[]> {
  const res = await fetch(`${API_BASE}/lessons`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return res.json();
}

async function createLesson(payload: CreateLessonPayload): Promise<Lesson> {
  const res = await fetch(`${API_BASE}/lessons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create lesson");
  return res.json();
}

async function deleteLesson(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/lessons/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete lesson");
}

// ─── Skeleton Rows ────────────────────────────────────────────────

const SkeletonRows: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <TableRow key={i}>
        {[60, 140, 120, 80, 90, 100, 110, 80].map((w, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4" style={{ width: w }} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

// ─── Create Lesson Modal ──────────────────────────────────────────

interface CreateLessonModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (lesson: Lesson) => void;
  groups: Group[];
  teachers: Teacher[];
}

const EMPTY_FORM: CreateLessonPayload = {
  name: "",
  description: "",
  groupId: "",
  teacherId: "",
  lessonDate: "",
  startTime: "",
  endTime: "",
  learningCenterId: 1,
};

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({
  open,
  onClose,
  onCreate,
  groups,
  teachers,
}) => {
  const [form, setForm] = useState<CreateLessonPayload>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const update =
    (key: keyof CreateLessonPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const required: (keyof CreateLessonPayload)[] = [
      "name",
      "groupId",
      "teacherId",
      "lessonDate",
      "startTime",
      "endTime",
    ];
    if (required.some((k) => !form[k])) {
      toast.warning("Barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateLessonPayload = {
        ...form,
        groupId: Number(form.groupId),
        teacherId: Number(form.teacherId),
        startTime:
          form.startTime.length === 5 ? form.startTime + ":00" : form.startTime,
        endTime:
          form.endTime.length === 5 ? form.endTime + ":00" : form.endTime,
      };
      const lesson = await createLesson(payload);
      onCreate(lesson);
      toast.success("Dars muvaffaqiyatli yaratildi!");
      setForm(EMPTY_FORM);
      onClose();
    } catch {
      toast.error("Darsni yaratishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Yangi dars yaratish
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Section: Basic Info */}
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">
            Asosiy ma'lumotlar
          </p>

          <div className="grid gap-2">
            <Label htmlFor="name">
              Dars nomi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Matematika 1-dars"
              value={form.name}
              onChange={update("name")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Tavsif</Label>
            <Input
              id="description"
              placeholder="Dars haqida qisqacha..."
              value={form.description}
              onChange={update("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="groupId">
                Guruh <span className="text-red-500">*</span>
              </Label>
              <select
                id="groupId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.groupId}
                onChange={update("groupId")}
              >
                <option value="">Guruhni tanlang</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacherId">
                O'qituvchi <span className="text-red-500">*</span>
              </Label>
              <select
                id="teacherId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.teacherId}
                onChange={update("teacherId")}
              >
                <option value="">O'qituvchini tanlang</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section: Time */}
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b pb-2 mt-2">
            Vaqt ma'lumotlari
          </p>

          <div className="grid gap-2">
            <Label htmlFor="lessonDate">
              Dars sanasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lessonDate"
              type="date"
              value={form.lessonDate}
              onChange={update("lessonDate")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">
                Boshlanish <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={update("startTime")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">
                Tugash <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={update("endTime")}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Bekor qilish
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Yaratilmoqda...
              </span>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Yaratish
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Lesson Table ─────────────────────────────────────────────────

interface LessonTableProps {
  lessons: Lesson[];
  loading: boolean;
  onAttendance: (id: number) => void;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: number) => void;
}

const LessonTable: React.FC<LessonTableProps> = ({
  lessons,
  loading,
  onAttendance,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableCell className="w-10 text-xs font-bold uppercase tracking-wider">
            #
          </TableCell>
          <TableCell className="text-xs font-bold uppercase tracking-wider">
            Dars nomi
          </TableCell>
          <TableCell className="text-xs font-bold uppercase tracking-wider">
            Tavsif
          </TableCell>
          <TableCell className="text-xs font-bold uppercase tracking-wider">
            Sana
          </TableCell>
          <TableCell className="text-xs font-bold uppercase tracking-wider">
            Vaqt
          </TableCell>
          <TableCell className="text-xs font-bold uppercase tracking-wider">
            Guruh
          </TableCell>
          <TableCell className="text-xs font-bold uppercase tracking-wider">
            O'qituvchi
          </TableCell>
          <TableCell className="text-xs font-bold uppercase tracking-wider text-right">
            Amallar
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <SkeletonRows count={5} />
        ) : lessons.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8}>
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <BookOpen className="h-10 w-10 opacity-20" />
                <p className="font-semibold text-base">Darslar topilmadi</p>
                <p className="text-sm">
                  Tanlangan filtr bo'yicha darslar mavjud emas
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          lessons.map((lesson, index) => (
            <TableRow
              key={lesson.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="text-muted-foreground font-mono text-xs">
                {index + 1}
              </TableCell>
              <TableCell className="font-semibold">{lesson.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-[160px] truncate">
                {lesson.description || "–"}
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Calendar className="h-3 w-3 text-blue-500" />
                  {formatDate(lesson.lessonDate)}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-muted px-2 py-1 rounded-md border">
                  <Clock className="h-3 w-3" />
                  {formatTime(lesson.startTime)} – {formatTime(lesson.endTime)}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-0"
                >
                  {lesson.group?.name || "–"}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {lesson.teacher
                  ? `${lesson.teacher.firstName} ${lesson.teacher.lastName}`
                  : "–"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {/* Attendance */}
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Davomat"
                    className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-950 dark:text-blue-400 transition-all"
                    onClick={() => onAttendance(lesson.id)}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </Button>
                  {/* Edit */}
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Tahrirlash"
                    className="h-8 w-8 text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white dark:bg-amber-950 dark:text-amber-400 transition-all"
                    onClick={() => onEdit(lesson)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {/* Delete */}
                  <Button
                    size="icon"
                    variant="ghost"
                    title="O'chirish"
                    className="h-8 w-8 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-red-950 dark:text-red-400 transition-all"
                    onClick={() => onDelete(lesson.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  loading?: boolean;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  loading,
  colorClass,
}) => (
  <div className="bg-card border rounded-xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <span
        className={`p-1.5 rounded-lg ${colorClass ?? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"}`}
      >
        {icon}
      </span>
    </div>
    {loading ? (
      <Skeleton className="h-8 w-16 mt-1" />
    ) : (
      <p className="text-3xl font-bold font-mono tracking-tight">{value}</p>
    )}
  </div>
);

// ─── Main: AttendancePage ─────────────────────────────────────────

// Static fallbacks for dropdowns (replace with real API calls)
const MOCK_GROUPS: Group[] = [
  { id: 1, name: "1-A Guruh" },
  { id: 2, name: "2-B Guruh" },
  { id: 3, name: "3-C Guruh" },
];
const MOCK_TEACHERS: Teacher[] = [
  { id: 1, firstName: "Ali", lastName: "Valiyev" },
  { id: 2, firstName: "Nodira", lastName: "Karimova" },
  { id: 3, firstName: "Sarvar", lastName: "Toshmatov" },
];

const AttendanceCenterPage: React.FC = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterMode>("today");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Load lessons
  useEffect(() => {
    setLoading(true);
    fetchLessons()
      .then(setLessons)
      .catch(() => toast.error("Darslarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  }, []);

  // Derived values
  const today = getTodayString();
  const todayCount = lessons.filter((l) => l.lessonDate === today).length;
  const groupsCount = new Set(lessons.map((l) => l.group?.id)).size;

  const filtered = lessons
    .filter((l) => (filter === "today" ? l.lessonDate === today : true))
    .filter((l) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [
        l.name,
        l.description,
        l.group?.name,
        l.teacher?.firstName,
        l.teacher?.lastName,
      ].some((v) => v?.toLowerCase().includes(q));
    });

  // Handlers
  const handleCreate = useCallback((lesson: Lesson) => {
    setLessons((prev) => [lesson, ...prev]);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Darsni o'chirishni xohlaysizmi?")) return;
      try {
        await deleteLesson(id);
        setLessons((prev) => prev.filter((l) => l.id !== id));
        toast.success("Dars muvaffaqiyatli o'chirildi");
      } catch {
        toast.error("O'chirishda xatolik yuz berdi");
      }
    },
    [toast],
  );
  const handleEdit = () => {
    console.log("edit");
  };
  const handleAttendance = useCallback(
    (id: number) => navigate(`/attendance/${id}`),
    [navigate],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ── Page Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Learning Center
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Davomat
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={filter}
              onValueChange={(v) => setFilter(v as FilterMode)}
            >
              <SelectTrigger className="w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">📅 Bugungi darslar</SelectItem>
                <SelectItem value="all">📚 Barcha darslar</SelectItem>
              </SelectContent>
            </Select>

            {filter === "all" && (
              <Button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Dars yaratish
              </Button>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Bugungi darslar"
            value={loading ? "—" : todayCount}
            icon={<Calendar className="h-4 w-4" />}
            loading={loading}
            colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          />
          <StatCard
            label="Jami darslar"
            value={loading ? "—" : lessons.length}
            icon={<BookOpen className="h-4 w-4" />}
            loading={loading}
            colorClass="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
          />
          <StatCard
            label="Guruhlar"
            value={loading ? "—" : groupsCount}
            icon={<Users className="h-4 w-4" />}
            loading={loading}
            colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          />
          <StatCard
            label="Ko'rsatilmoqda"
            value={loading ? "—" : filtered.length}
            icon={<BarChart3 className="h-4 w-4" />}
            loading={loading}
            colorClass="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
          />
        </div>

        {/* ── Table Card ── */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b flex-wrap">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-sm">Darslar jadvali</span>
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-0 ml-1"
              >
                {filtered.length}
              </Badge>
            </div>

            <div className="relative flex-1 min-w-[160px] max-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Qidirish..."
                className="pl-9 h-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <LessonTable
            lessons={filtered}
            loading={loading}
            onAttendance={handleAttendance}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* ── Modal ── */}
      <CreateLessonModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
        groups={MOCK_GROUPS}
        teachers={MOCK_TEACHERS}
      />
    </div>
  );
};

export default AttendanceCenterPage;
