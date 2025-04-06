import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, CheckCircle, PlusCircle, ArrowLeft } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  student_id: string;
}

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user || authError) {
        console.error("User not authenticated.");
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error.message);
      } else {
        setTasks(data || []);
      }

      setLoading(false);
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !userId) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: newTaskTitle.trim(),
          completed: false,
          student_id: userId,
          due_date: new Date().toISOString(), // Default due_date
        },
      ])
      .select();

    if (error) {
      console.error("Error adding task:", error.message);
    } else if (data) {
      setTasks((prev) => [data[0], ...prev]);
      setNewTaskTitle("");
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error.message);
    } else {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: !completed } : t
        )
      );
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error.message);
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1950&q=80')",
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80 z-10" />

      {/* Main content */}
      <div className="relative z-20 w-full h-full p-8 flex flex-col text-white">
        <div className="w-full h-full max-w-5xl mx-auto flex flex-col">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-300 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 mr-2" />
              Back
            </button>
          </div>

          <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
            📝 My Tasks
          </h1>

          {/* Add task input */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-grow bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleAddTask}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <PlusCircle className="h-5 w-5 mr-1" />
              Add
            </Button>
          </div>

          {/* Task list */}
          <div className="flex-grow overflow-y-auto space-y-4 pr-2">
            {loading ? (
              <p className="text-center text-gray-300">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-400">
                No tasks yet. Start by adding one!
              </p>
            ) : (
              tasks.map((task) => (
                <Card
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl transition-all hover:scale-[1.01]"
                >
                  <div
                    onClick={() =>
                      toggleTaskCompletion(task.id, task.completed)
                    }
                    className={`flex items-center gap-3 cursor-pointer ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-white"
                    }`}
                  >
                    <CheckCircle
                      className={`h-5 w-5 ${
                        task.completed ? "text-green-400" : "text-gray-300"
                      }`}
                    />
                    <span>{task.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
