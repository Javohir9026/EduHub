import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  label?: string;
  defaultValue?: string;
  onChange?: (date: string) => void;
}

export function DatePickerCalendar({
  defaultValue,
  onChange,
}: DatePickerProps) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(defaultValue || today);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <FieldGroup className="mx-auto w-full flex-row">
      <Field className="w-full">
        <Input
          type="date"
          id="date-picker"
          value={date}
          onChange={handleChange}
          className="bg-background"
        />
      </Field>
    </FieldGroup>
  );
}
