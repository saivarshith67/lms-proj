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

const CoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = id;

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [email, setEmail] = useState("");
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
        console.error("Error fetching course details:", error.message);
      } else {
        setCourse(data);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Fetch enrolled students
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
        console.error(
          "Error fetching student profiles:",
          profilesError.message
        );
        return;
      }
      setStudents(studentProfiles || []);
    };

    fetchStudents();
  }, [courseId]);

  // Fetch announcements (stream posts)
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

  // Enroll a student by email
  const enrollStudent = async () => {
    if (!email.trim() || !courseId) {
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

  // Post an announcement
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
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 flex flex-col text-black">
      {/* Header */}
      <header className="px-6 py-4 flex items-center bg-white shadow-md">
      <Button variant="default" onClick={() => navigate(-1)} className="mr-4">
          ← Back
        </Button>
        {course ? (
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 drop-shadow-md">
            {course.title}
          </h1>
        ) : (
          <h1 className="text-3xl font-bold text-gray-800">Course</h1>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-8">
        {course ? (
          <div className="mb-10 max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200">
            <p className="text-xl font-medium font-sans text-gray-800 mb-3 leading-relaxed">
              {course.description}
            </p>
            <p className="text-sm text-blue-600">
              Created on {new Date(course.created_at).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-center mb-6">Loading course details...</p>
        )}

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="stream" className="w-full">
            <TabsList>
              <TabsTrigger
                value="stream"
                className="text-xl font-semibold py-4 px-6 hover:bg-gray-200 rounded-lg transition-all duration-300"
              >
                Stream
              </TabsTrigger>
              <TabsTrigger
                value="people"
                className="text-xl font-semibold py-4 px-6 hover:bg-gray-200 rounded-lg transition-all duration-300"
              >
                People
              </TabsTrigger>
            </TabsList>

            {/* STREAM TAB */}
            <TabsContent value="stream">
              <div className="space-y-6">
                {/* Announcement Form */}
                <div className="flex flex-col gap-3 bg-black rounded-lg p-6 shadow-md">
                  <label className="text-sm font-medium text-white">
                    Answer Query
                  </label>
                  <Textarea
                    placeholder="Type your answer or message....."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="resize-none text-white"
                  />

                  <Button onClick={handlePostMessage}>Post</Button>
                </div>

                <div className="mt-6 space-y-4">
                  {streamPosts.length === 0 ? (
                    <p className="text-sm">No announcements yet.</p>
                  ) : (
                    streamPosts.map((post) => (
                      <div
                        key={post.id}
                        className="border p-3 rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.75)]"
                      >
                        <p className="text-sm mb-2">{linkify(post.content)}</p>
                        <p className="text-xs">
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
              <h2 className="text-2xl font-bold mb-4 text-black">
                Enrolled Students
              </h2>

              {students.length === 0 ? (
                <p className="text-gray-700 mb-4">No students enrolled yet.</p>
              ) : (
                <ul className="mb-6 text-black">
                  {students.map((student) => (
                    <li key={student.id} className="mb-2">
                      {student.display_name} ({student.email})
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Input
                  type="email"
                  placeholder="Enter student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-[85%] h-12 text-black text-lg shadow-[0_4px_6px_rgba(0,0,0,0.6)] rounded-lg"
                />
                <Button
                  onClick={enrollStudent}
                  className="h-12 px-6 bg-black text-white text-lg font-semibold hover:bg-gray-900"
                >
                  Enroll Student
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
