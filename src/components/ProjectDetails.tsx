import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config";
import CreateTask from "./CreateTask";
import { ArrowLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface ProjectDetailsProps {
    project: any;
    onBack: () => void;
}

export default function ProjectDetails({ project, onBack }: ProjectDetailsProps) {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", project.id)
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to load tasks.");
        } else {
            setTasks(data || []);
        }
        setLoading(false);
    }, [project.id]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // If the user clicks "Add Task", swap out the task list for the CreateTask form
    if (isCreatingTask) {
        return (
            <div className="animate-fade-up">
                <button
                    onClick={() => setIsCreatingTask(false)}
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--obsidian)] mb-6 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Project
                </button>
                <CreateTask
                    projectId={project.id}
                    onSuccess={() => {
                        setIsCreatingTask(false);
                        fetchTasks(); // Refresh the task list after creating
                    }}
                    onCancel={() => setIsCreatingTask(false)}
                />
            </div>
        );
    }

    // Otherwise, show the Project Details and Task List
    return (
        <div className="animate-fade-up">
            {/* Header Navigation */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--obsidian)] mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> All Projects
            </button>

            {/* Project Header */}
            <div className="mb-10 bg-[var(--cream)] border border-[var(--cream-border)] rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="font-['Playfair_Display',_serif] text-[32px] font-bold text-[var(--obsidian)] leading-tight mb-2">
                            {project.title}
                        </h1>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Completed' ? 'bg-[#E8F3EB] text-[#2D7A4A]' : 'bg-[var(--amber-pale)] text-[var(--amber-dark)]'}`}>
                            {project.status}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCreatingTask(true)}
                        className="btn-primary flex items-center gap-2 px-4 py-2"
                    >
                        <Plus size={16} /> Add Task
                    </button>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                    {project.description}
                </p>
            </div>

            {/* Tasks Section */}
            <div>
                <h2 className="text-xl font-bold text-[var(--obsidian)] mb-6">Tasks ({tasks.length})</h2>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="skeleton h-[100px] rounded-xl w-full" />)}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--cream-border)] rounded-2xl bg-white/50">
                        <p className="text-[var(--text-muted)]">No tasks have been created yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tasks.map(task => (
                            <div key={task.id} className="bg-white border border-[var(--cream-border)] rounded-xl p-5 flex items-start justify-between hover:shadow-sm transition-shadow">
                                <div>
                                    <h3 className="font-semibold text-[var(--obsidian)] mb-1">{task.title}</h3>
                                    {task.description && <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mb-3">{task.description}</p>}
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-600">{task.category}</span>
                                        <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md">{task.points} Pts</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{task.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}