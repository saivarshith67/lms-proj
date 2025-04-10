// App.tsx
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentCoursePage from "@/pages/StudentCoursePage";
import CoursePage from "./pages/CoursePage";
import FindCourses from "./pages/FindCourses";
import LoginWrapper from "./pages/LoginWrapper";
import LandingPage from "./pages/LandingPage"; 
import MyTasks from "./pages/MyTasks"; 
import ResetPassword from "./pages/ResetPassword"; 
import UpdatePassword from "./pages/UpdatePassword"; // ✅ Import Update Password component
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetpass" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} /> {/* ✅ Added Update Password route */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/tasks" element={<MyTasks />} />
        <Route path="/student/tasks" element={<MyTasks />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/student/course/:id" element={<StudentCoursePage />} />
        <Route path="*" element={<FindCourses />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;