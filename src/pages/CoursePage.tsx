import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Define the types for students
type Student = {
    id: string;
    display_name: string;
    email: string;
};

const CoursePage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [students, setStudents] = useState<Student[]>([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            // Get enrollments for this course
            const { data: enrollments, error } = await supabase
                .from("enrollments")
                .select("student_id")
                .eq("course_id", courseId);
    
            if (error) {
                console.error("Error fetching enrollments:", error);
                return;
            }
    
            if (enrollments && enrollments.length > 0) {
                // Get student profiles for the enrolled students
                const studentIds = enrollments.map(enrollment => enrollment.student_id);
                
                const { data: studentProfiles, error: profilesError } = await supabase
                    .from("profiles")
                    .select("id, display_name, email")
                    .in("id", studentIds);
    
                if (profilesError) {
                    console.error("Error fetching student profiles:", profilesError);
                } else {
                    setStudents(studentProfiles);
                }
            } else {
                setStudents([]);
            }
        };
    
        fetchStudents();
    }, [courseId]);

    const enrollStudent = async () => {
        if (!email) return;
    
        // Normalize email input
        const normalizedEmail = email.trim().toLowerCase();
    
        // Check if the student exists in profiles table
        const { data: studentProfile, error: profileError } = await supabase
            .from("profiles")
            .select("id, email, display_name")
            .eq("email", normalizedEmail)
            .maybeSingle(); // Use maybeSingle to handle no results gracefully
    
        if (profileError) {
            console.error("Error fetching profile:", profileError);
            alert("Error checking student existence");
            return;
        }
    
        if (!studentProfile) {
            alert("Student with this email was not found");
            return;
        }
    
        // Check existing enrollment
        const { data: existingEnrollment, error: checkError } = await supabase
            .from("enrollments")
            .select("id")
            .eq("course_id", courseId)
            .eq("student_id", studentProfile.id)
            .maybeSingle();
    
        if (checkError) {
            console.error("Error checking enrollment:", checkError);
            return;
        }
    
        if (existingEnrollment) {
            alert("Student is already enrolled in this course");
            return;
        }
    
        // Enroll the student
        const { error: enrollError } = await supabase
            .from("enrollments")
            .insert([{
                student_id: studentProfile.id,
                course_id: courseId,
            }]);
    
        if (enrollError) {
            console.error("Error enrolling student:", enrollError);
            alert("Failed to enroll student: " + enrollError.message);
        } else {
            setStudents((prev) => [...prev, studentProfile]);
            setEmail("");
            alert("Student enrolled successfully");
        }
    };
    
    

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Course Details</h1>

            <Tabs defaultValue="stream" className="w-full">
                <TabsList>
                    <TabsTrigger value="stream">Stream</TabsTrigger>
                    <TabsTrigger value="people">People</TabsTrigger>
                </TabsList>

                <TabsContent value="stream">
                    <p>Course updates and announcements go here.</p>
                </TabsContent>

                <TabsContent value="people">
                    <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>
                    <ul>
                        {students.map((student) => (
                            <li key={student.id} className="mb-2">{student.display_name} ({student.email})</li>
                        ))}
                    </ul>

                    <div className="mt-4">
                        <input
                            type="email"
                            placeholder="Enter student email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded w-1/2"
                        />
                        <Button className="ml-2" onClick={enrollStudent}>Enroll Student</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CoursePage;
