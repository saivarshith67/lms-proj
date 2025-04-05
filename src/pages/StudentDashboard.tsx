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
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Enrolled Courses</h1>
                <LogoutButton />
            </div>

            {loading ? (
                <p className="text-muted-foreground text-sm">Loading your courses...</p>
            ) : courses.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                    You are not enrolled in any courses yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            className="cursor-pointer hover:shadow-lg transition"
                            onClick={() => handleCourseClick(course.id)}
                        >
                            <CardContent className="p-4">
                                <h2 className="text-lg font-semibold">
                                    {course.title || "No Title"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {course.description || "No Description"}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
