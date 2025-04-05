import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

// Define the course type
type Course = {
    id: string;
    title: string;
    description: string;
    teacher_id: string;
    created_at: string;
};

// Define the post type for announcements
type Post = {
    id: string;
    user_id: string;
    course_id: string;
    content: string;
    created_at: string;
};

// Helper function: Convert URLs in text to clickable links.
function linkify(text: string): React.ReactNode {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
        urlRegex.test(part) ? (
            <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                {part}
            </a>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

const StudentCoursePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const courseId = id;

    const [course, setCourse] = useState<Course | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    // Fetch course details
    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!courseId) return;
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .eq("id", courseId)
                .single();
            if (error) {
                console.error("Error fetching course:", error.message);
            } else {
                setCourse(data);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    // Fetch announcements
    useEffect(() => {
        const fetchPosts = async () => {
            if (!courseId) return;
            const { data, error } = await supabase
                .from("course_posts")
                .select("id, user_id, content, created_at")
                .eq("course_id", courseId)
                .order("created_at", { ascending: false });
            if (error) {
                console.error("Error fetching posts:", error.message);
                return;
            }
            setPosts((data as Post[]) || []);
        };

        fetchPosts();
    }, [courseId]);

    return (
        <div className="min-h-screen w-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Header */}
            <header className="px-6 py-4 flex items-center bg-white/80 backdrop-blur-sm shadow-lg border-b border-amber-200 z-10 relative">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="mr-4"
                >
                    ← Back
                </Button>
                {course ? (
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-800">
                        {course.title}
                    </h1>
                ) : (
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-800">
                        Course
                    </h1>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow px-6 py-8 z-10 relative">
                {course ? (
                    <div className="mb-6 max-w-4xl mx-auto bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-md border border-amber-200">
                        <p className="text-lg text-gray-700 mb-2">
                            {course.description}
                        </p>
                        <p className="text-sm text-gray-500">
                            Created on{" "}
                            {new Date(course.created_at).toLocaleDateString()}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mb-6">
                        Loading course details...
                    </p>
                )}

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Announcements */}
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <p className="text-center text-gray-500">
                                No announcements yet.
                            </p>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="bg-white/90 backdrop-blur-sm border rounded-lg p-4 shadow-sm">
                                    <p className="text-sm text-gray-800 mb-1">
                                        {linkify(post.content)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Posted on{" "}
                                        {new Date(post.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
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
        </div>
    );
};

export default StudentCoursePage;
