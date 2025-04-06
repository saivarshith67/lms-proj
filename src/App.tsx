import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentCoursePage from "@/pages/StudentCoursePage";
import CoursePage from "./pages/CoursePage";
import FindCourses from "./pages/FindCourses";
import LoginWrapper from "./pages/LoginWrapper";
import LandingPage from "./pages/LandingPage"; // ✅ Import Landing Page
import MyTasks from "./pages/MyTasks"; // ✅ Updated import with correct casing
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Routes>
        <Route path="/" element={<LandingPage />} />{" "}
        {/* ✅ Homepage is now LandingPage */}
        <Route path="/login" element={<LoginWrapper />} />{" "}
        {/* ✅ Login moved here */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/tasks" element={<MyTasks />} />{" "}
        {/* ✅ Route uses updated Mytasks component */}
        <Route path="/student/tasks" element={<MyTasks />} />{" "}
        {/* ✅ Route uses updated Mytasks component */}
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/student/course/:id" element={<StudentCoursePage />} />
        <Route path="*" element={<FindCourses />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
