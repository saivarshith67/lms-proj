// ... [imports remain unchanged]
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import { supabase } from "@/lib/supabase";
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  Bell,
  Settings,
  Bookmark,
  Award,
  BarChart,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Course {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  created_at: string;
}

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string>("Student");
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      const user = userData?.user;

      if (!user || authError) {
        console.error("User not authenticated.");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        setStudentName("Student");
      } else {
        setStudentName(profile?.display_name || "Student");
      }

      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("student_id", user.id);

      if (enrollmentsError) {
        console.error("Error fetching enrollments:", enrollmentsError.message);
        setCourses([]);
        setLoading(false);
        return;
      }

      const courseIds = enrollments.map((e) => e.course_id).filter(Boolean);
      if (courseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const { data: courseData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .in("id", courseIds);

      if (coursesError) {
        console.error("Error fetching courses:", coursesError.message);
        setCourses([]);
      } else {
        setCourses(courseData || []);
      }
      setLoading(false);
    };

    fetchEnrolledCourses();
  }, []);

  const handleCourseClick = (id: string) => navigate(`/student/course/${id}`);

  const getRandomGradient = () => {
    const gradients = [
      "from-blue-500 to-purple-500",
      "from-green-400 to-cyan-500",
      "from-pink-500 to-rose-400",
      "from-amber-400 to-orange-500",
      "from-indigo-500 to-blue-400",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
<div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 bg-fixed bg-cover">
{/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b sticky top-0 z-10 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
              EduLearn
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 mt-2 bg-white dark:bg-gray-900">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" /> Light Mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" /> Dark Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 w-full">
        <div className="grid grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8 py-8">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-24">
              <div className="flex flex-col space-y-2">
                <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-md flex items-center space-x-3 text-blue-700 dark:text-blue-300 font-medium">
                  <BookOpen className="h-5 w-5" />
                  <span>My Courses</span>
                </div>
                <Button
                  className="w-full justify-start text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/student/find-courses")}
                >
                  <Search className="h-5 w-5 mr-3" />
                  Find Courses
                </Button>
                <Button
                  className="w-full justify-start text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/student/tasks")}
                >
                  <Bookmark className="h-5 w-5 mr-3" />
                  My Tasks
                </Button>
                <Button
                  className="w-full justify-start text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const section = document.getElementById("achievements");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Award className="h-5 w-5 mr-3" />
                  Achievements
                </Button>
                <Button className="w-full justify-start text-white bg-blue-600 hover:bg-blue-700">
                  <BarChart className="h-5 w-5 mr-3" />
                  Progress
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="col-span-12 md:col-span-9 lg:col-span-10 space-y-16">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-lg font-medium text-blue-100 mb-2">
                    Welcome back,
                  </h2>
                  <h1 className="text-3xl font-bold">{studentName}!</h1>
                  <p className="mt-2 text-blue-100 max-w-xl">
                    Continue your learning journey and track your progress.
                    You're making great strides!
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button
                    className="bg-white text-blue-600 hover:bg-blue-100"
                    onClick={() => navigate("/student/find-courses")}
                  >
                    Search Enrolled Courses
                  </Button>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Enrolled Courses
                </h2>
                <p className="text-gray-500">Continue your learning journey</p>
              </div>

              {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-12 flex flex-col justify-center items-center min-h-[300px]">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-lg text-gray-500">
                    Loading your courses...
                  </p>
                </div>
              ) : courses.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-12 flex flex-col justify-center items-center min-h-[300px]">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                    <BookOpen className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-lg text-gray-500 mb-2">
                    You are not enrolled in any courses yet.
                  </p>
                  <Button
                    className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => navigate("/student/find-courses")}
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {courses.map((course) => (
                    <Card
                      key={course.id}
                      onClick={() => handleCourseClick(course.id)}
                      className="cursor-pointer border hover:shadow-md transition-all duration-200"
                    >
                      <div
                        className={`h-3 w-full bg-gradient-to-r ${getRandomGradient()}`}
                      />
                      <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                            {course.title}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                            {course.description || "No description available"}
                          </p>
                        </div>
                        <div className="mt-6">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2 mb-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {new Date(course.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="pt-3 border-t flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Continue learning
                            </div>
                            <span className="text-blue-600 font-medium">
                              View →
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements */}
            <div id="achievements">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </h2>
                <p className="text-gray-500">
                  Milestones you've unlocked on your learning journey
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                  {
                    title: "First Course Completed",
                    description:
                      "Congratulations on completing your very first course!",
                    icon: <Award className="h-8 w-8 text-yellow-500" />,
                  },
                  {
                    title: "Top Learner Badge",
                    description: "You studied for over 20 hours in one week!",
                    icon: <BarChart className="h-8 w-8 text-green-500" />,
                  },
                  {
                    title: "Consistency Champ",
                    description: "Logged in for 7 days in a row. Keep it up!",
                    icon: <Clock className="h-8 w-8 text-purple-500" />,
                  },
                  {
                    title: "Goal Setter",
                    description:
                      "You've added your first 5 tasks to your to-do list.",
                    icon: <Bookmark className="h-8 w-8 text-blue-500" />,
                  },
                ].map((achievement, index) => (
                  <Card
                    key={index}
                    className="border hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        {achievement.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t mt-16 py-8 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 <span className="font-semibold text-blue-600">EduLearn</span>
            . All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            {[
              {
                label: "Contact Us",
                title: "Contact EduLearn Support",
                content: (
                  <>
                    Reach out anytime:
                    <ul className="list-disc pl-5 mt-3 space-y-2 text-left">
                      <li>
                        <strong>Parisa Karteek</strong> –{" "}
                        <a
                          href="mailto:karteek0765@gmail.com"
                          className="text-blue-600 underline"
                        >
                          karteek0765@gmail.com
                        </a>
                      </li>
                      <li>
                        <strong>Potta Sai Varshith</strong> –{" "}
                        <a
                          href="mailto:127018044@sastra.ac.in"
                          className="text-blue-600 underline"
                        >
                          127018044@sastra.ac.in
                        </a>
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                label: "Privacy Policy",
                title: "Privacy Policy",
                content: (
                  <>
                    EduLearn respects your privacy:
                    <ul className="list-disc pl-5 mt-3 space-y-2 text-left">
                      <li>Only essential data is collected.</li>
                      <li>We do not share your data with third parties.</li>
                      <li>You may request account/data deletion anytime.</li>
                    </ul>
                  </>
                ),
              },
              {
                label: "Terms of Service",
                title: "Terms of Service",
                content: (
                  <>
                    By using EduLearn, you agree to:
                    <ul className="list-disc pl-5 mt-3 space-y-2 text-left">
                      <li>Respect academic integrity and honesty.</li>
                      <li>Use the content solely for personal learning.</li>
                      <li>Abstain from misuse or malicious activity.</li>
                    </ul>
                  </>
                ),
              },
            ].map((dialog, idx) => (
              <AlertDialog key={idx}>
                <AlertDialogTrigger asChild>
                <button className="bg-transparent border-none p-0 m-0 text-sm text-inherit hover:underline cursor-pointer transition-colors">
                {dialog.label}
                  </button>
                </AlertDialogTrigger>
                {/* 
            NOTE: The parent .fixed inset-0 with flex + justify-center + items-center
            ensures the dialog is centered both horizontally and vertically.
            bg-black/50 provides the translucent backdrop.
          */}
                <AlertDialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-0 animate-fadeIn">
                  {/* 
              mx-auto ensures the container itself is centered horizontally.
              max-w-3xl for a wider look. 
              You can increase it to max-w-4xl, or even w-[80%], etc. 
            */}
                  <div className="relative w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dialog.title}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-4">
                        {dialog.content}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 flex justify-end">
                      <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Close
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
