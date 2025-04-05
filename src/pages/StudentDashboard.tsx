"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { LogoutButton } from "@/components/LogoutButton"
import { supabase } from "@/lib/supabase"
import { BookOpen, Calendar, GraduationCap, Sparkles, Loader2, Leaf } from "lucide-react"

interface Course {
    id: string
    title: string
    description: string
    teacher_id: string
    created_at: string
}

export default function StudentDashboard() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true)
            const { data: userData } = await supabase.auth.getUser()
            const user = userData?.user
            if (!user) {
                console.error("No user found or user is not logged in.")
                setLoading(false)
                return
            }

            const { data: enrollments, error: enrollmentsError } = await supabase
                .from("enrollments")
                .select("course_id")
                .eq("student_id", user.id)

            if (enrollmentsError) {
                console.error("Error fetching enrollments:", enrollmentsError.message)
                setLoading(false)
                return
            }

            const courseIds = enrollments.map((e) => e.course_id).filter(Boolean)

            if (courseIds.length === 0) {
                setCourses([])
                setLoading(false)
                return
            }

            const { data: courseData, error: coursesError } = await supabase
                .from("courses")
                .select("id, title, description, teacher_id, created_at")
                .in("id", courseIds)

            if (coursesError) {
                console.error("Error fetching courses:", coursesError.message)
                setCourses([])
            } else {
                setCourses(courseData || [])
            }
        } catch (error) {
            console.error("Error fetching enrolled courses:", (error as Error).message)
            setCourses([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEnrolledCourses()
    }, [])

    const handleCourseClick = (courseId: string) => {
        navigate(`/student/course/${courseId}`)
    }

    // Generate vibrant colors for course cards
    const getCardColor = (index: number) => {
        const colors = [
            { bg: "bg-gradient-to-br from-pink-100 to-rose-200", accent: "bg-rose-400", text: "text-rose-800" },
            { bg: "bg-gradient-to-br from-violet-100 to-purple-200", accent: "bg-purple-400", text: "text-purple-800" },
            { bg: "bg-gradient-to-br from-blue-100 to-cyan-200", accent: "bg-cyan-400", text: "text-cyan-800" },
            { bg: "bg-gradient-to-br from-emerald-100 to-teal-200", accent: "bg-teal-400", text: "text-teal-800" },
            { bg: "bg-gradient-to-br from-amber-100 to-yellow-200", accent: "bg-yellow-400", text: "text-yellow-800" },
        ]
        return colors[index % colors.length]
    }

    return (
        <div className="min-h-screen w-screen bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
            {/* Decorative elements */}
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

            {/* Full-width content wrapper */}
            <div className="w-full px-6 py-12 relative z-10">
                {/* Header with bohemian elements */}
                <div className="mb-16 relative">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <GraduationCap className="h-10 w-10 text-amber-600" />
                            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 tracking-tight relative">
                                Your Learning Journey
                                <span className="absolute -top-6 -right-8">
                                    <Sparkles className="h-6 w-6 text-amber-500" />
                                </span>
                            </h1>
                        </div>
                        <LogoutButton />
                    </div>
                    <div className="mt-4 h-1 w-32 bg-gradient-to-r from-amber-300 to-rose-300 rounded-full"></div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px]">
                        <div className="relative">
                            <Loader2 className="h-16 w-16 text-amber-600 animate-spin" />
                            <div className="absolute top-0 left-0 h-16 w-16 animate-ping opacity-20 bg-amber-400 rounded-full"></div>
                        </div>
                        <p className="text-xl text-amber-800 mt-6 font-medium">Gathering your wisdom paths...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white bg-opacity-60 backdrop-filter backdrop-blur-sm rounded-2xl p-10 border border-amber-200 shadow-xl">
                        <div className="relative">
                            <BookOpen className="h-20 w-20 text-amber-500" />
                            <Leaf className="absolute -top-2 -right-2 h-8 w-8 text-green-500 animate-bounce" />
                        </div>
                        <p className="text-2xl text-amber-800 text-center max-w-md mt-6 font-medium">
                            Your journey awaits. You haven't enrolled in any courses yet.
                        </p>
                        <button
                            className="mt-8 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
                            onClick={() => navigate("/courses")}
                        >
                            Discover Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => {
                            const colorScheme = getCardColor(index)
                            return (
                                <Card
                                    key={course.id}
                                    className={`overflow-hidden h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group ${colorScheme.bg} relative`}
                                    onClick={() => handleCourseClick(course.id)}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-full -mt-12 -mr-12 group-hover:scale-110 transition-transform duration-500"></div>

                                    <CardContent className="p-8 h-full flex flex-col justify-between">
                                        <div>
                                            <div
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${colorScheme.accent} text-white`}
                                            >
                                                <BookOpen className="h-3.5 w-3.5 mr-1" />
                                                Course
                                            </div>

                                            <h2
                                                className={`text-2xl font-bold mb-3 ${colorScheme.text} group-hover:scale-105 origin-left transition-transform`}
                                            >
                                                {course.title || "Untitled Course"}
                                            </h2>

                                            <p
                                                className={`text-sm ${colorScheme.text} opacity-80 ${course.description ? "line-clamp-3" : "italic"}`}
                                            >
                                                {course.description || "No description available"}
                                            </p>
                                        </div>

                                        <div className="mt-8 flex items-center text-sm font-medium">
                                            <Calendar className={`h-4 w-4 mr-2 ${colorScheme.text}`} />
                                            <span className={`${colorScheme.text}`}>
                                                {new Date(course.created_at).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-3 right-3">
                                            <div
                                                className={`h-8 w-8 rounded-full ${colorScheme.accent} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                                            >
                                                <Sparkles className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {/* Add some decorative elements at the bottom */}
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
    )
}
