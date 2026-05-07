import { X, CalendarDays, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const DAYS = [
  { id: 1, label: "Dushanba", short: "Du" },
  { id: 2, label: "Seshanba", short: "Se" },
  { id: 3, label: "Chorshanba", short: "Ch" },
  { id: 4, label: "Payshanba", short: "Pa" },
  { id: 5, label: "Juma", short: "Ju" },
  { id: 6, label: "Shanba", short: "Sh" },
  { id: 7, label: "Yakshanba", short: "Ya" },
];

interface DaysModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lessonDays: number[];
  setLessonDays: (days: number[]) => void;
}

export const DaysModal = ({
  open,
  onOpenChange,
  lessonDays,
  setLessonDays,
}: DaysModalProps) => {
  const toggle = (id: number) => {
    setLessonDays(
      lessonDays.includes(id)
        ? lessonDays.filter((d) => d !== id)
        : [...lessonDays, id],
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden gap-0 border border-gray-100 dark:border-zinc-800">
        {/* Header */}
        <AlertDialogHeader className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <AlertDialogTitle className="text-base font-semibold text-gray-800 dark:text-white">
                Kunlarni tanlang
              </AlertDialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Selected count */}
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 ml-[42px]">
            {lessonDays.length > 0
              ? `${lessonDays.length} kun tanlandi`
              : "Hech qanday kun tanlanmagan"}
          </p>
        </AlertDialogHeader>

        {/* Days grid */}
        <div className="px-5 py-4 grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const selected = lessonDays.includes(day.id);
            return (
              <button
                key={day.id}
                onClick={() => toggle(day.id)}
                className={`relative flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border ${
                  selected
                    ? "bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-200 dark:shadow-blue-900/30 scale-[1.03]"
                    : "bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-100 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700"
                }`}
              >
                <span className="font-semibold text-[13px]">{day.short}</span>
                {selected && (
                  <Check size={10} className="text-white/80" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>

        {/* Full name row */}
        <div className="px-5 pb-4 flex flex-wrap gap-1.5">
          {DAYS.map((day) => {
            const selected = lessonDays.includes(day.id);
            return (
              <span
                key={day.id}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                  selected
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
              >
                {day.label}
              </span>
            );
          })}
        </div>

        {/* Footer */}
        <AlertDialogFooter className="px-5 py-4 border-t border-gray-100 dark:border-zinc-800 flex gap-2">
          <button
            onClick={() => setLessonDays([])}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-100 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            Tozalash
          </button>
          <Button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white border-0 cursor-pointer transition-colors"
          >
            Saqlash
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
