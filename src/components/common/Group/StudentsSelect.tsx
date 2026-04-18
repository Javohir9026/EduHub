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
import { useState } from "react";

const StudentsSelect = () => {
    const [loading, setLoading] = useState(false)
    const fetchStudents = async () => {
        const api = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('access_token')
        try {
            setLoading(true)
            const res = await apiClient.get(`${api}/`)
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    };
  return (
    <Select>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>O'quvchilar</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StudentsSelect;
