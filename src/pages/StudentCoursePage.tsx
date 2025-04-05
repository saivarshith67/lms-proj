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

function linkify(text: string): React.ReactNode {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
        if (urlRegex.test(part)) {
            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    {part}
                </a>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

const StudentCoursePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const courseId = id;

    const [course, setCourse] = useState<Course | null>(null);
    const [streamPosts, setStreamPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState("");

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
        <div className="p-6">
            <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
                ← Back
            </Button>

            {course ? (
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-lg mb-2">{course.description}</p>
                    <p className="text-sm text-gray-500">
                        Created on {new Date(course.created_at).toLocaleDateString()}
                    </p>
                </div>
            ) : (
                <p className="text-gray-500 mb-6">Loading course details...</p>
            )}

            <Tabs defaultValue="stream" className="w-full">
                <TabsList>
                    <TabsTrigger value="stream">Stream</TabsTrigger>
                </TabsList>

                <TabsContent value="stream">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 max-w-xl">
                            <label className="text-sm font-medium">Post an Announcement</label>
                            <Textarea
                                placeholder="Type your announcement or message..."
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                            <Button onClick={handlePostMessage}>Post</Button>
                        </div>

                        <div className="mt-6 space-y-4">
                            {streamPosts.length === 0 ? (
                                <p className="text-gray-500">No announcements yet.</p>
                            ) : (
                                streamPosts.map((post) => (
                                    <div key={post.id} className="border p-3 rounded-md">
                                        <p className="text-sm text-gray-700 mb-2">{linkify(post.content)}</p>
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
    );
};

export default StudentCoursePage;