import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Plus, GraduationCap, Sparkles, Loader2 } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

interface Course {
    id: string;
    title: string;
    description: string;
    teacher_id: string;
    created_at: string;
}

export default function TeacherDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .eq("teacher_id", user.id);

        if (error) {
            console.error("Error fetching courses:", error.message);
        } else {
            setCourses(data || []);
        }
    };

    const handleCreateCourse = async () => {
        const title = prompt("Enter course title:");
        const description = prompt("Enter course description:");
        const user = (await supabase.auth.getUser()).data.user;

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

    useEffect(() => {
        fetchCourses();
    }, []);

    const getCardColor = (index: number) => {
        const colors = [
            { bg: "bg-gradient-to-br from-pink-100 to-rose-200", accent: "bg-rose-400", text: "text-rose-800" },
            { bg: "bg-gradient-to-br from-violet-100 to-purple-200", accent: "bg-purple-400", text: "text-purple-800" },
            { bg: "bg-gradient-to-br from-blue-100 to-cyan-200", accent: "bg-cyan-400", text: "text-cyan-800" },
            { bg: "bg-gradient-to-br from-emerald-100 to-teal-200", accent: "bg-teal-400", text: "text-teal-800" },
            { bg: "bg-gradient-to-br from-amber-100 to-yellow-200", accent: "bg-yellow-400", text: "text-yellow-800" },
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
            {/* Blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 15s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>

            <div className="w-full px-6 py-12 relative z-10">
                <div className="mb-16 relative">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <GraduationCap className="h-10 w-10 text-amber-600" />
                            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 tracking-tight relative">
                                Your Courses
                                <span className="absolute -top-6 -right-8">
                                    <Sparkles className="h-6 w-6 text-amber-500" />
                                </span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleCreateCourse}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Create Course
                            </Button>
                            <LogoutButton />
                        </div>
                    </div>
                    <div className="mt-4 h-1 w-32 bg-gradient-to-r from-amber-300 to-rose-300 rounded-full"></div>
                </div>

                {courses.length === 0 ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white bg-opacity-60 backdrop-filter backdrop-blur-sm rounded-2xl p-10 border border-amber-200 shadow-xl">
                        <p className="text-2xl text-amber-800 text-center max-w-md mt-6 font-medium">
                            You haven't created any courses yet.
                        </p>
                        <Button
                            className="mt-8 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
                            onClick={handleCreateCourse}
                        >
                            Create Your First Course
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {courses.map((course, index) => {
                            const color = getCardColor(index);
                            return (
                                <Card
                                    key={course.id}
                                    className={`overflow-hidden h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group ${color.bg} relative cursor-pointer`}
                                    onClick={() => handleCourseClick(course.id)}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-full -mt-12 -mr-12 group-hover:scale-110 transition-transform duration-500"></div>

                                    <CardContent className="p-8 h-full flex flex-col justify-between">
                                        <div>
                                            <div
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${color.accent} text-white`}
                                            >
                                                Course
                                            </div>

                                            <h2 className={`text-2xl font-bold mb-3 ${color.text} group-hover:scale-105 transition-transform`}>
                                                {course.title}
                                            </h2>

                                            <p
                                                className={`text-sm ${color.text} opacity-80 ${course.description ? "line-clamp-3" : "italic"}`}
                                            >
                                                {course.description || "No description available"}
                                            </p>
                                        </div>

                                        <div className="mt-6 text-sm font-medium text-gray-600">
                                            Created on:{" "}
                                            <span className={color.text}>
                                                {new Date(course.created_at).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Decorative dots */}
                <div className="mt-20 flex justify-center">
                    <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-amber-300"></div>
                        <div className="h-2 w-2 rounded-full bg-rose-300"></div>
                        <div className="h-2 w-2 rounded-full bg-purple-300"></div>
                        <div className="h-2 w-2 rounded-full bg-teal-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
