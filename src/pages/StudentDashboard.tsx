import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LogoutButton } from "@/components/LogoutButton";
import { supabase } from "@/lib/supabase";

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
    const navigate = useNavigate();

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;
            if (!user) {
                console.error("No user found or user is not logged in.");
                setLoading(false);
                return;
            }

            const { data: enrollments, error: enrollmentsError } = await supabase
                .from("enrollments")
                .select("course_id")
                .eq("student_id", user.id);

            if (enrollmentsError) {
                console.error("Error fetching enrollments:", enrollmentsError.message);
                setLoading(false);
                return;
            }

            const courseIds = enrollments
                .map((e) => e.course_id)
                .filter(Boolean);

            if (courseIds.length === 0) {
                setCourses([]);
                setLoading(false);
                return;
            }

            const { data: courseData, error: coursesError } = await supabase
                .from("courses")
                .select("id, title, description, teacher_id, created_at")
                .in("id", courseIds);

            if (coursesError) {
                console.error("Error fetching courses:", coursesError.message);
                setCourses([]);
            } else {
                setCourses(courseData || []);
            }
        } catch (error) {
            console.error("Error fetching enrolled courses:", (error as Error).message);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const handleCourseClick = (courseId: string) => {
        navigate(`/student/course/${courseId}`);
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight">Enrolled Courses</h1>
                <LogoutButton />
            </div>
    
            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <p className="text-lg text-muted-foreground">Loading your courses...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <p className="text-lg text-muted-foreground">
                        You are not enrolled in any courses yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 group overflow-hidden h-full" // Added h-full
                            onClick={() => handleCourseClick(course.id)}
                        >
                            <CardContent className="p-6 h-full flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold mb-3">
                                        {course.title || "Untitled Course"}
                                    </h2>
                                    <p className={`text-sm text-muted-foreground ${
                                        course.description ? "line-clamp-3" : "italic"
                                    }`}>
                                        {course.description || "No description available"}
                                    </p>
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground border-t pt-2">
                                    Created: {new Date(course.created_at).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
