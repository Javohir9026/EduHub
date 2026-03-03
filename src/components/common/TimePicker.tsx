import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface DatePickerTimeProps {
  label?: string;
  defaultValue?: string;
  onChange?: (time: string) => void;
}

export function DatePickerTime({
  defaultValue = "15:00",
  onChange,
}: DatePickerTimeProps) {
  const [time, setTime] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTime(value);

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <FieldGroup className="mx-auto w-full flex-row">
      <Field className="w-full">
        <Input
          type="time"
          id="time-picker"
          value={time}
          onChange={handleChange}
          className="appearance-none bg-background"
        />
      </Field>
    </FieldGroup>
  );
}
