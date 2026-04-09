import AllAttendances from "@/components/common/AttendanceForCenter/AllAttendances";
import ManyAttendance from "@/components/common/AttendanceForCenter/ManyAttendance";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const AttendancesCenter = () => {
  const [typeTable, setTypeTable] = useState("all");

  useEffect(() => {}, []);
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Select
          defaultValue="all"
          onValueChange={(value) => setTypeTable(value)}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Barcha Davomat</SelectItem>
              <SelectItem value="many">Bugungi Davomat</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {typeTable === "all" ? <AllAttendances /> : <ManyAttendance />}
    </div>
  );
};

export default AttendancesCenter;
