import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Define the course type
type Course = {
    id: string;
    title: string;
    description: string;
    teacher_id: string;
    created_at: string;
};

// Define the post type for Stream announcements
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
    const [streamPosts, setStreamPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState("");

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

    // Fetch stream posts (announcements)
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
            setStreamPosts((data as Post[]) || []);
        };

        fetchPosts();
    }, [courseId]);

    // Handle posting a new message
    const handlePostMessage = async () => {
        if (!newPostContent.trim() || !courseId) return;
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
            alert("No user logged in.");
            return;
        }
        const { data, error } = await supabase
            .from("course_posts")
            .insert([
                {
                    course_id: courseId,
                    user_id: user.id,
                    content: newPostContent.trim(),
                },
            ])
            .select("*");
        if (error) {
            console.error("Error posting message:", error.message);
            alert("Failed to post message: " + error.message);
            return;
        }
        setNewPostContent("");
        if (data && data.length > 0) {
            setStreamPosts((prev) => [data[0] as Post, ...prev]);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 flex items-center bg-white shadow-md">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="mr-4"
                >
                    ← Back
                </Button>
                {course ? (
                    <h1 className="text-3xl font-bold text-gray-800">
                        {course.title}
                    </h1>
                ) : (
                    <h1 className="text-3xl font-bold text-gray-800">Course</h1>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow px-6 py-8">
                {course ? (
                    <div className="mb-6 max-w-4xl mx-auto">
                        <p className="text-lg text-gray-700 mb-2">{course.description}</p>
                        <p className="text-sm text-gray-500">
                            Created on {new Date(course.created_at).toLocaleDateString()}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mb-6">Loading course details...</p>
                )}

                <div className="max-w-4xl mx-auto">
                    <Tabs defaultValue="stream" className="w-full">
                        <TabsList>
                            <TabsTrigger value="stream">Stream</TabsTrigger>
                        </TabsList>

                        <TabsContent value="stream">
                            <div className="space-y-6">
                                {/* Announcement Form */}
                                <div className="flex flex-col gap-3 bg-white rounded-lg p-6 shadow-md">
                                    <label className="text-sm font-medium text-gray-700">
                                        Post an Announcement
                                    </label>
                                    <Textarea
                                        placeholder="Type your announcement or message..."
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        className="resize-none"
                                    />
                                    <Button onClick={handlePostMessage} className="w-full">
                                        Post
                                    </Button>
                                </div>

                                {/* Stream Posts */}
                                <div className="space-y-4">
                                    {streamPosts.length === 0 ? (
                                        <p className="text-center text-gray-500">No announcements yet.</p>
                                    ) : (
                                        streamPosts.map((post) => (
                                            <div key={post.id} className="bg-white border rounded-lg p-4 shadow-sm">
                                                <p className="text-sm text-gray-800 mb-1">
                                                    {linkify(post.content)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Posted on {new Date(post.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default StudentCoursePage;