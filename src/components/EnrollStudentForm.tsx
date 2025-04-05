import { useState } from "react";
import { supabase } from "../lib/supabase";

interface Props {
    courseId: string;
}

export default function EnrollStudentForm({ courseId }: Props) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<null | string>(null);

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        // 1. Get student profile by email
        const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", email)
            .eq("role", "student")
            .single(); // Expecting only one match

        if (profileError || !profiles) {
            setStatus("Student not found with this email.");
            return;
        }

        const studentId = profiles.id;

        // 2. Enroll student into course
        const { error: insertError } = await supabase.from("enrollments").insert({
            course_id: courseId,
            student_id: studentId,
        });

        if (insertError) {
            setStatus(`Failed to enroll: ${insertError.message}`);
        } else {
            setStatus("Student successfully enrolled!");
            setEmail("");
        }
    };

    return (
        <div style={{ marginTop: "2rem" }}>
            <h4>Enroll Student by Email</h4>
            <form onSubmit={handleEnroll}>
                <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enroll</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}
