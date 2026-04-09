import { useParams } from "react-router-dom";

const AttendanceLesson = () => {
  const { id } = useParams();
  return <div>Davomat page with lesson id: {id}</div>;
};

export default AttendanceLesson;
