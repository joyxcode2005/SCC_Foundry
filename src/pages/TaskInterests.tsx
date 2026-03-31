import { useState, useEffect } from "react";
import { supabase } from "../config";
import toast from "react-hot-toast";
import { ChevronDown, CheckCircle2, User } from "lucide-react";

interface TaskWithInterests {
    id: string;
    title: string;
    description: string | null;
    category: string;
    points: number;
    project_id: string;
    project_title?: string;
    interest_count: number;
    interested_members?: Array<{
        user_id: string;
        user_name: string;
        user_email: string;
        status: string;
        created_at: string;
    }>;
}

export default function TaskInterests() {
    const [tasksWithInterests, setTasksWithInterests] = useState<TaskWithInterests[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [assigningTo, setAssigningTo] = useState<{ taskId: string; userId: string } | null>(null);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        fetchTasksWithInterests();
    }, []);

    const fetchTasksWithInterests = async () => {
        setLoading(true);
        try {
            // Step 1: Fetch all task interests (which tasks have interests)
            const { data: allInterests, error: interestsError } = await supabase
                .from("task_interests")
                .select("task_id, user_id, status, created_at")
                .eq("status", "PENDING");

            if (interestsError) {
                console.error("Error fetching interests:", interestsError);
                throw interestsError;
            }

            console.log("All task_interests from DB:", allInterests);

            if (!allInterests || allInterests.length === 0) {
                console.log("No interests found");
                setTasksWithInterests([]);
                setLoading(false);
                return;
            }

            // Step 2: Get unique task IDs and fetch all those tasks
            const uniqueTaskIds = Array.from(new Set(allInterests.map(i => i.task_id)));
            console.log("Unique task IDs with interests:", uniqueTaskIds);

            const { data: tasksData, error: tasksError } = await supabase
                .from("tasks")
                .select("id, title, description, category, points, project_id")
                .in("id", uniqueTaskIds);

            if (tasksError) {
                console.error("Error fetching tasks:", tasksError);
                throw tasksError;
            }

            console.log("Tasks with interests:", tasksData);

            // Step 3: Get unique user IDs and fetch all those users in one query
            const uniqueUserIds = Array.from(new Set(allInterests.map(i => i.user_id)));
            console.log("Unique user IDs:", uniqueUserIds);

            const { data: usersData, error: usersError } = await supabase
                .from("users")
                .select("id, first_name, last_name, email")
                .in("id", uniqueUserIds);

            if (usersError) {
                console.error("Error fetching users:", usersError);
                throw usersError;
            }

            console.log("Users data:", usersData);

            // Step 4: Fetch project titles
            const { data: projectsData } = await supabase
                .from("projects")
                .select("id, title");

            // Create maps for quick lookup
            const userMap = new Map(usersData?.map(u => [u.id, u]) || []);
            const projectMap = new Map(projectsData?.map(p => [p.id, p.title]) || []);

            // Step 5: Build the final data structure
            const tasksWithIntentsData = (tasksData || []).map(task => {
                // Get all interests for this specific task
                const taskInterests = allInterests.filter(i => i.task_id === task.id);
                console.log(`Interests for task ${task.id}:`, taskInterests);

                // Build interested members array
                const interested_members = taskInterests.map(interest => {
                    const userData = userMap.get(interest.user_id);
                    console.log(`User ${interest.user_id}:`, userData);
                    
                    return {
                        user_id: interest.user_id,
                        user_name: userData ? `${userData.first_name} ${userData.last_name}` : "Unknown User",
                        user_email: userData?.email || "N/A",
                        status: interest.status,
                        created_at: interest.created_at,
                    };
                });

                return {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    category: task.category,
                    points: task.points,
                    project_id: task.project_id,
                    project_title: projectMap.get(task.project_id),
                    interest_count: interested_members.length,
                    interested_members,
                };
            });

            console.log("Final tasks with interests:", tasksWithIntentsData);
            setTasksWithInterests(tasksWithIntentsData);
        } catch (error) {
            toast.error("Failed to load task interests");
            console.error("Error fetching task interests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTask = async (taskId: string, userId: string, userName: string) => {
        setAssigningTo({ taskId, userId });
        setAssigning(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Create task assignment
            const { error: assignError } = await supabase
                .from("task_assignments")
                .insert([
                    {
                        task_id: taskId,
                        user_id: userId,
                        assigned_by: user.id,
                        status: "ASSIGNED",
                    },
                ]);

            if (assignError) throw assignError;

            // Remove from task interests once assignment is done.
            const { error: removeInterestError } = await supabase
                .from("task_interests")
                .delete()
                .eq("task_id", taskId)
                .eq("user_id", userId);

            if (removeInterestError) throw removeInterestError;

            toast.success(`Task assigned to ${userName}!`);
            setAssigningTo(null);
            await fetchTasksWithInterests();
        } catch (error) {
            toast.error("Failed to assign task");
            console.error(error);
        } finally {
            setAssigningTo(null);
            setAssigning(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-up">
                <div className="mb-9">
                    <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
                    <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-[-0.02em]">
                        Task Interests
                    </h1>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton h-[100px] rounded-xl w-full" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-up">
            <div className="mb-9">
                <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
                <div>
                    <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-1.5">
                        Task Interests
                    </h1>
                    <p className="text-sm text-[var(--text-muted)]">
                        Manage member interests and assign tasks
                    </p>
                </div>
            </div>

            {tasksWithInterests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-[var(--cream-border)] rounded-2xl text-[var(--text-muted)]">
                    <svg className="mb-3 opacity-40" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <p className="text-sm font-medium">No task interests yet</p>
                    <p className="text-xs mt-1">
                        Members will show interest in tasks and you'll see them here
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasksWithInterests.map(task => (
                        <div
                            key={task.id}
                            className="bg-white border border-[var(--cream-border)] rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
                        >
                            {/* Task Header */}
                            <button
                                onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                className="w-full px-6 py-4 flex items-center gap-4 bg-white hover:bg-gray-50 transition-colors border-none cursor-pointer text-left"
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-[var(--obsidian)] mb-1">
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="text-[var(--text-muted)]">{task.project_title}</span>
                                        <span className="text-[var(--text-muted)]">•</span>
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                            {task.category}
                                        </span>
                                        <span className="px-2 py-0.5 bg-blue-50 rounded text-blue-600">
                                            {task.points} Pts
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1.5 bg-[var(--amber-pale)] rounded-lg">
                                        <span className="text-sm font-bold text-[var(--amber)]">
                                            {task.interest_count}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={20}
                                        className={`text-[var(--text-muted)] transition-transform ${
                                            expandedTaskId === task.id ? "rotate-180" : ""
                                        }`}
                                    />
                                </div>
                            </button>

                            {/* Expanded Member List */}
                            {expandedTaskId === task.id && (
                                <div className="border-t border-[var(--cream-border)] bg-gray-50 px-6 py-4">
                                    {task.interested_members && task.interested_members.length > 0 ? (
                                        <div className="space-y-3">
                                            {task.interested_members.map(member => (
                                                <div
                                                    key={member.user_id}
                                                    className="bg-white border border-[var(--cream-border)] rounded-lg p-4 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--obsidian)] font-semibold">
                                                            <User size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-[var(--obsidian)]">
                                                                {member.user_name}
                                                            </p>
                                                            <p className="text-xs text-[var(--text-muted)]">
                                                                {member.user_email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                                member.status === "ASSIGNED"
                                                                    ? "bg-[#E8F3EB] text-[#2D7A4A]"
                                                                    : "bg-[#EFF8FF] text-[#1A6FA8]"
                                                            }`}
                                                        >
                                                            {member.status}
                                                        </span>

                                                        {member.status === "PENDING" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleAssignTask(task.id, member.user_id, member.user_name)
                                                                }
                                                                disabled={
                                                                    assigning &&
                                                                    assigningTo?.taskId === task.id &&
                                                                    assigningTo?.userId === member.user_id
                                                                }
                                                                className="px-3 py-1 bg-[var(--amber)] hover:bg-[var(--amber-dark)] text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer border-none"
                                                            >
                                                                {assigning &&
                                                                assigningTo?.taskId === task.id &&
                                                                assigningTo?.userId === member.user_id
                                                                    ? "Assigning..."
                                                                    : "Assign"}
                                                            </button>
                                                        )}

                                                        {member.status === "ASSIGNED" && (
                                                            <CheckCircle2
                                                                size={18}
                                                                className="text-[#2D7A4A]"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[var(--text-muted)]">
                                            No interested members for this task
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
