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

interface GroupType {
  id: number;
  name: string;
}
const StudentUpdateGroupSelect = () => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(false);
  const getGroups = async () => {
    const api = import.meta.env.VITE_API_URL;
    try {
      setLoading(true);
      const response = await apiClient.get(
        `${api}/groups/learning-center/${localStorage.getItem("id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      setGroups(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getGroups();
  }, []);
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Guruhni Tanlang" />
      </SelectTrigger>
      <SelectContent className="top-[30px]">
        <SelectGroup>
          <SelectLabel>Guruhlar</SelectLabel>
          {groups.map((group: GroupType) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              {group.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StudentUpdateGroupSelect;
