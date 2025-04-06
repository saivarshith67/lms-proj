import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
    BookOpen,
    Plus,
    Calendar,
    Clock,  
    BarChart,
    Award,
    Bell,
    Sun,
    Moon,
} from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

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
import { useTheme } from "next-themes";

interface Course {
    id: string;
    title: string;
    description: string;
    teacher_id: string;
    created_at: string;
}

export default function TeacherDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        const { data: userData, error: authError } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user || authError) {
            console.error("User not authenticated.");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .eq("teacher_id", user.id);

        if (error) {
            console.error("Error fetching courses:", error.message);
            setCourses([]);
        } else {
            setCourses(data || []);
        }
        setLoading(false);
    };

    const handleCreateCourse = async () => {
        const title = prompt("Enter course title:");
        const description = prompt("Enter course description:");
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!title || !user) return;

        const { error } = await supabase.from("courses").insert({
            title,
            description,
            teacher_id: user.id,
        });

        if (error) {
            console.error("Error creating course:", error.message);
        } else {
            fetchCourses();
        }
    };

    const handleCourseClick = (courseId: string) => {
        navigate(`/course/${courseId}`);
    };

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
                    <div className="flex items-center space-x-4">
                        {/* Notification Bell */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-gray-600 dark:text-gray-300"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                                3
                            </span>
                        </Button>

                        {/* Theme Toggle */}
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                                className="text-gray-600 dark:text-gray-300"
                            >
                                {theme === "light" ? (
                                    <Moon className="w-5 h-5" />
                                ) : (
                                    <Sun className="w-5 h-5" />
                                )}
                            </Button>
                        )}

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
                                    <span>Your Courses</span>
                                </div>
                                <Button
                                    className="w-full justify-start text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={handleCreateCourse}
                                >
                                    <Plus className="h-5 w-5 mr-3" />
                                    Create Course
                                </Button>
                                <Button
                                    className="w-full justify-start text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={() => navigate("/teacher/tasks")}
                                >
                                    <Clock className="h-5 w-5 mr-3" />
                                    Your Tasks
                                </Button>
                                <Button
                                    className="w-full justify-start text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={() => {
                                        const section = document.getElementById("achievements");
                                        if (section) section.scrollIntoView({ behavior: "smooth" });
                                    }}
                                >
                                    <BarChart className="h-5 w-5 mr-3" />
                                    Achievements
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
                                        Welcome, Teacher!
                                    </h2>
                                    <h1 className="text-3xl font-bold">Your Courses</h1>
                                    <p className="mt-2 text-blue-100 max-w-xl">
                                        Manage your courses, create new content, and track student progress.
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Button
                                        className="bg-white text-blue-600 hover:bg-blue-100"
                                        onClick={handleCreateCourse}
                                    >
                                        Create New Course
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Courses Section */}
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                    Courses You Manage
                                </h2>
                                <p className="text-gray-500">Review and update your courses</p>
                            </div>

                            {loading ? (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-12 flex flex-col justify-center items-center min-h-[300px]">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-lg text-gray-500">Loading your courses...</p>
                                </div>
                            ) : courses.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-12 flex flex-col justify-center items-center min-h-[300px]">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                                        <BookOpen className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <p className="text-lg text-gray-500 mb-2">
                                        You haven't created any courses yet.
                                    </p>
                                    <Button
                                        className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                                        onClick={handleCreateCourse}
                                    >
                                        Create a Course
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
                                                        <span>{new Date(course.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="pt-3 border-t flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            Continue editing
                                                        </div>
                                                        <span className="text-blue-600 font-medium">View →</span>
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
                                    Milestones you've unlocked on your teaching journey
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[
                                    {
                                        title: "First Course Created",
                                        description: "Congrats on launching your first course!",
                                        icon: <Award className="h-8 w-8 text-yellow-500" />,
                                    },
                                    {
                                        title: "Top Instructor",
                                        description: "Your courses have been viewed by over 1,000 students!",
                                        icon: <BarChart className="h-8 w-8 text-green-500" />,
                                    },
                                    {
                                        title: "Engaging Educator",
                                        description: "High ratings across all your courses!",
                                        icon: <Clock className="h-8 w-8 text-purple-500" />,
                                    },
                                    {
                                        title: "Content Creator",
                                        description: "Uploaded over 10 course materials!",
                                        icon: <BookOpen className="h-8 w-8 text-blue-500" />,
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
