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
``;
const GroupTeacherSelect: React.FC<TeacherGroupSelectProps> = ({
  value,
  onChange,
}) => {
  const [teacher, setTeacher] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(false);

  const getTeacher = async () => {
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
      setTeacher(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeacher();
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            loading
              ? "Yuklanmoqda..."
              : teacher.length > 0
                ? "Ustozni Tanlang"
                : "Ustozlar majud emas!"
          }
        />
      </SelectTrigger>
      <SelectContent className="top-[30px]">
        <SelectGroup>
          <SelectLabel>Ustozlar</SelectLabel>
          {teacher.map((teach) => (
            <SelectItem key={teach.id} value={teach.id.toString()}>
              {teach.name + " " + teach.lastName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default GroupTeacherSelect;
