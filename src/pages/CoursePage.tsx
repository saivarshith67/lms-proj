import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define the student type
type Student = {
    id: string;
    display_name: string;
    email: string;
};

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

const CoursePage = () => {
    const navigate = useNavigate(); // 🧭 For back button
    const { id } = useParams<{ id: string }>();
    const courseId = id;

    const [course, setCourse] = useState<Course | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [email, setEmail] = useState("");
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
                console.error("Error fetching course details:", error.message);
            } else {
                setCourse(data);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!courseId) return;

            const { data: enrollments, error: enrollmentsError } = await supabase
                .from("enrollments")
                .select("student_id")
                .eq("course_id", courseId);

            if (enrollmentsError) {
                console.error("Error fetching enrollments:", enrollmentsError.message);
                return;
            }

            if (!enrollments || enrollments.length === 0) {
                setStudents([]);
                return;
            }

            const studentIds = enrollments.map(
                (enrollment: { student_id: string }) => enrollment.student_id
            );

            const { data: studentProfiles, error: profilesError } = await supabase
                .from("profiles")
                .select("id, display_name, email")
                .in("id", studentIds);

            if (profilesError) {
                console.error("Error fetching student profiles:", profilesError.message);
                return;
            }

            setStudents(studentProfiles || []);
        };

        fetchStudents();
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

    const enrollStudent = async () => {
        if (!email.trim() || !courseId) {
            console.error("Missing email or course ID");
            alert("Please enter a valid email and ensure course details are loaded.");
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: studentProfile, error: profileError } = await supabase
            .from("profiles")
            .select("id, email, display_name")
            .eq("email", normalizedEmail)
            .maybeSingle();

        if (profileError) {
            console.error("Error fetching profile:", profileError.message);
            alert("Something went wrong while checking the student profile.");
            return;
        }

        if (!studentProfile) {
            alert("Student with this email does not exist in profiles.");
            return;
        }

        const { data: existingEnrollment, error: checkError } = await supabase
            .from("enrollments")
            .select("id")
            .eq("course_id", courseId)
            .eq("student_id", studentProfile.id)
            .maybeSingle();

        if (checkError) {
            console.error("Error checking enrollment:", checkError.message);
            alert("An error occurred while checking enrollment.");
            return;
        }

        if (existingEnrollment) {
            alert("Student is already enrolled in this course.");
            return;
        }

        const { error: enrollError } = await supabase.from("enrollments").insert([
            {
                course_id: courseId,
                student_id: studentProfile.id,
            },
        ]);

        if (enrollError) {
            console.error("Error enrolling student:", enrollError.message);
            alert("Enrollment failed: " + enrollError.message);
            return;
        }

        setStudents((prev) => [
            ...prev,
            {
                id: studentProfile.id,
                display_name: studentProfile.display_name,
                email: studentProfile.email,
            },
        ]);
        setEmail("");
        alert("Student enrolled successfully.");
    };

    const handlePostMessage = async () => {
        if (!newPostContent.trim()) return;
        if (!courseId) {
            alert("Course details are not loaded.");
            return;
        }

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
            {/* Back Button */}
            <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="mb-4"
            >
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
                    <TabsTrigger value="people">People</TabsTrigger>
                </TabsList>

                {/* STREAM TAB */}
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

                {/* PEOPLE TAB */}
                <TabsContent value="people">
                    <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>
                    {students.length === 0 ? (
                        <p className="text-gray-500 mb-4">No students enrolled yet.</p>
                    ) : (
                        <ul className="mb-4">
                            {students.map((student) => (
                                <li key={student.id} className="mb-2">
                                    {student.display_name} ({student.email})
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="Enter student email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-1/2"
                        />
                        <Button onClick={enrollStudent}>Enroll Student</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CoursePage;
