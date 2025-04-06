import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ArrowLeft } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function FindCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user || userError) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("enrollments")
        .select(`
          course_id,
          courses (
            id,
            title,
            description
          )
        `)
        .eq("student_id", user.id);

      if (enrollmentError) {
        console.error("Failed to fetch enrolled courses:", enrollmentError.message);
        setLoading(false);
        return;
      }

      const enrolledCourses: Course[] = (enrollmentData || [])
        .map((enrollment: any) => enrollment.courses)
        .filter((course: any): course is Course => !!course);

      setCourses(enrolledCourses);
      setLoading(false);
    };

    fetchEnrolledCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat relative flex justify-center items-start"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/70 backdrop-blur-md z-0" />

      {/* Main Container */}
      <div className="relative z-10 px-4 py-10 w-full max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-blue-900 dark:text-white flex justify-center items-center gap-3">
            <Search className="h-10 w-10 text-blue-600 dark:text-blue-300" />
            Find Your Courses
          </h1>
          <p className="mt-2 text-gray-800 dark:text-gray-300 text-lg">
            Browse and manage your enrolled courses
          </p>
        </div>

        {/* Search Input */}
        <div className="flex justify-center mb-10">
          <Input
            placeholder="🔍 Search enrolled courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl rounded-full px-6 py-4 text-lg shadow-lg bg-white/90 dark:bg-gray-900 border border-blue-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Content */}
        <div className="flex justify-center items-center min-h-[300px] w-full">
          {loading ? (
            <p className="text-gray-700 dark:text-gray-400 text-lg">Loading courses...</p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-gray-800 dark:text-gray-300 text-xl font-medium text-center">
              🎓 No matching courses found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-2 w-full">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="p-5 bg-white/90 dark:bg-gray-800 shadow-md border border-blue-100 dark:border-gray-700 hover:shadow-xl transition rounded-2xl"
                >
                  <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-800 dark:text-gray-300 text-base">
                    {course.description}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
