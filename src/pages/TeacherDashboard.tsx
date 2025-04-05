import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    description: string;
    teacher_id: string;
    created_at: string;
}

export default function TeacherDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('teacher_id', user.id);

        if (error) {
            console.error('Error fetching courses:', error.message);
        } else {
            setCourses(data || []);
        }
    };

    const handleCreateCourse = async () => {
        const title = prompt('Enter course title:');
        const description = prompt('Enter course description:');
        const user = (await supabase.auth.getUser()).data.user;

        if (!title || !user) return;

        const { error } = await supabase.from('courses').insert({
            title,
            description,
            teacher_id: user.id,
        });

        if (error) {
            console.error('Error creating course:', error.message);
        } else {
            fetchCourses();
        }
    };

    const handleCourseClick = (courseId: string) => {
        navigate(`/course/${courseId}`);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Your Courses</h1>
                <Button onClick={handleCreateCourse}>
                    <Plus className="mr-2 h-4 w-4" /> Create Course
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        className="cursor-pointer hover:shadow-lg transition"
                        onClick={() => handleCourseClick(course.id)}
                    >
                        <CardContent className="p-4">
                            <h2 className="text-lg font-semibold">{course.title}</h2>
                            <p className="text-sm text-muted-foreground">{course.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
