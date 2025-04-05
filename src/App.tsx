import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentCoursePage from "@/pages/StudentCoursePage";
import CoursePage from "./pages/CoursePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/course/:id" element={<CoursePage />} />
      <Route path="/student/course/:id" element={<StudentCoursePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
