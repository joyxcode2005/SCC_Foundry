import { useState, useEffect } from "react";
import CreateTask from "./CreateTask";
import { ArrowLeft, Plus, Heart, ExternalLink } from "lucide-react";
import { useProjectStore } from "../store/useProjectStore";

export default function ProjectDetails() {
    const {
        currentProject,
        userRole,
        tasks,
        isLoadingTasks,
        fetchTasks,
        setCurrentProject,
        raiseTaskInterest
    } = useProjectStore();

    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [submittingInterest, setSubmittingInterest] = useState<string | null>(null);

    useEffect(() => {
        if (currentProject) {
            fetchTasks();
        }
    }, [currentProject, fetchTasks]);

    const handleRaiseInterest = async (taskId: string) => {
        setSubmittingInterest(taskId);
        await raiseTaskInterest(taskId);
        setSubmittingInterest(null);
    };

    if (!currentProject) return null;

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
                    onSuccess={() => {
                        setIsCreatingTask(false);
                        fetchTasks();
                    }}
                    onCancel={() => setIsCreatingTask(false)}
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-up">
            <button
                onClick={() => setCurrentProject(null)}
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--obsidian)] mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> All Projects
            </button>

            <div className="mb-10 bg-[var(--cream)] border border-[var(--cream-border)] rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="font-['Playfair_Display',_serif] text-[32px] font-bold text-[var(--obsidian)] leading-tight mb-2">
                            {currentProject.title}
                        </h1>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentProject.status === 'Completed' ? 'bg-[#E8F3EB] text-[#2D7A4A]' : 'bg-[var(--amber-pale)] text-[var(--amber-dark)]'}`}>
                            {currentProject.status}
                        </span>
                    </div>

                    {userRole === 'MODERATOR' && (
                        <button
                            onClick={() => setIsCreatingTask(true)}
                            className="btn-primary flex items-center gap-2 px-4 py-2"
                        >
                            <Plus size={16} /> Add Task
                        </button>
                    )}
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                    {currentProject.description}
                </p>
            </div>

            <div>
                <h2 className="text-xl font-bold text-[var(--obsidian)] mb-6">Tasks ({tasks.length})</h2>

                {isLoadingTasks ? (
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
                            <div key={task.id} className="bg-white border border-[var(--cream-border)] rounded-xl p-5 flex flex-col hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[var(--obsidian)] mb-1">{task.title}</h3>
                                        {task.description && <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{task.description}</p>}
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-600">{task.category}</span>
                                            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md">{task.points} Pts</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{task.status}</span>
                                    </div>
                                </div>

                                {/* Drive Link and Interest Button */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--cream-border)]">
                                    <div className="flex items-center gap-2">
                                        {task.drive_folder_url && (
                                            <a 
                                                href={task.drive_folder_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--amber)] hover:text-[var(--amber-dark)] transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                                Drive Link
                                            </a>
                                        )}
                                    </div>

                                    {userRole === 'MEMBER' && (
                                        <button
                                            onClick={() => handleRaiseInterest(task.id as string)}
                                            disabled={submittingInterest === task.id}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                submittingInterest === task.id
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-[#FEF2F2] text-[#B04040] hover:bg-[#FCE5E5]'
                                            }`}
                                        >
                                            <Heart size={14} fill={submittingInterest === task.id ? 'none' : 'currentColor'} />
                                            {submittingInterest === task.id ? 'Submitting...' : 'Interested'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}