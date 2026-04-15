import { useParams } from "react-router-dom";

const LessonInfoPage = () => {
  const { id } = useParams();
  return <div>
    <h1>Lesson Info Page - ID: {id}</h1>
  </div>;
};

export default LessonInfoPage;
