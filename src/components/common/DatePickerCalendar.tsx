import { useEffect, useState } from "react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  defaultValue?: string;
  onChange?: (date: string) => void;
}

export function DatePickerCalendar({
  defaultValue,
  onChange,
}: DatePickerProps) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(defaultValue || today);

  // 🔥 MUHIM QISM
  useEffect(() => {
    if (!defaultValue && onChange) {
      onChange(today); // parent ga bugungi sanani yuboramiz
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
    onChange?.(value);
  };

  return (
    <FieldGroup className="mx-auto w-full flex-row">
      <Field className="w-full">
        <Input
          type="date"
          value={date}
          onChange={handleChange}
          className="bg-background"
        />
      </Field>
    </FieldGroup>
  );
}
