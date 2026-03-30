import { create } from 'zustand';
import type { ProjectState } from '../types';
import { supabase } from '../config';
import toast from 'react-hot-toast';

export const useProjectStore = create<ProjectState>((set, get) => ({
    userRole: null,
    currentUserId: null,
    currentProject: null,
    tasks: [],
    isLoadingTasks: false,
    taskInterestedUserIds: {},

    setUserRole: (role) => set({ userRole: role }),

    initializeCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        set({ currentUserId: user?.id ?? null });
    },

    setCurrentProject: (project) => set({ currentProject: project, tasks: [], taskInterestedUserIds: {} }),

    fetchTasks: async () => {
        const { currentProject } = get();
        if (!currentProject) return;

        set({ isLoadingTasks: true });

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", currentProject.id)
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to load tasks.");
            set({ isLoadingTasks: false });
        } else {
            set({ tasks: data || [], isLoadingTasks: false });
        }
    },

    fetchTaskInterestsForTasks: async (taskIds: string[]) => {
        if (taskIds.length === 0) {
            set({ taskInterestedUserIds: {} });
            return;
        }

        const { data, error } = await supabase
            .from("task_interests")
            .select("task_id, user_id")
            .in("task_id", taskIds);

        if (error) {
            toast.error("Failed to load task interests.");
            return;
        }

        const interestLookup: Record<string, string[]> = {};
        for (const taskId of taskIds) {
            interestLookup[taskId] = [];
        }

        for (const row of data || []) {
            if (!interestLookup[row.task_id]) {
                interestLookup[row.task_id] = [];
            }

            if (!interestLookup[row.task_id].includes(row.user_id)) {
                interestLookup[row.task_id].push(row.user_id);
            }
        }

        set({ taskInterestedUserIds: interestLookup });
    },

    markTaskInterestedByCurrentUser: (taskId: string) => {
        const { currentUserId, taskInterestedUserIds } = get();

        if (!currentUserId) return;

        const existingUserIds = taskInterestedUserIds[taskId] || [];
        if (existingUserIds.includes(currentUserId)) return;

        set({
            taskInterestedUserIds: {
                ...taskInterestedUserIds,
                [taskId]: [...existingUserIds, currentUserId]
            }
        });
    },

    raiseTaskInterest: async (taskId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            toast.error("You must be logged in to show interest.");
            return false;
        }

        const { error } = await supabase
            .from("task_interests")
            .insert([
                {
                    task_id: taskId,
                    user_id: user.id,
                    status: 'PENDING'
                }
            ]);

        if (error) {
            if (error.code === '23505') {
                toast.error("You have already shown interest for this task.");
                return true;
            } else {
                toast.error("Failed to show interest for task.");
            }
            console.error(error);
            return false;
        } else {
            toast.success("Interest recorded! Moderators will review your interest.");
            return true;
        }
    }
}));