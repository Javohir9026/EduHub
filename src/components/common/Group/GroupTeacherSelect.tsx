import apiClient from "@/api/ApiClient";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface TeacherType {
  id: number;
  name: string;
  lastName: string;
}

interface TeacherGroupSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const GroupTeacherSelect: React.FC<TeacherGroupSelectProps> = ({
  value,
  onChange,
}) => {
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(false);

  const getTeachers = async () => {
    const api = import.meta.env.VITE_API_URL;

    try {
      setLoading(true);

      const response = await apiClient.get(
        `${api}/learning-centers/${localStorage.getItem("id")}/teachers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setTeachers(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            loading
              ? "Yuklanmoqda..."
              : teachers.length > 0
                ? "Ustozni tanlang"
                : "Ustozlar mavjud emas!"
          }
        />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ustozlar</SelectLabel>
          {teachers.map((teacher) => (
            <SelectItem key={teacher.id} value={teacher.id.toString()}>
              {teacher.name} {teacher.lastName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default GroupTeacherSelect;
