import { create } from 'zustand';
import type { ProjectState } from '../types';
import { supabase } from '../config';
import toast from 'react-hot-toast';

export const useProjectStore = create<ProjectState>((set, get) => ({
    userRole: null,
    currentProject: null,
    tasks: [],
    isLoadingTasks: false,

    setUserRole: (role) => set({ userRole: role }),

    setCurrentProject: (project) => set({ currentProject: project, tasks: [] }),

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

    raiseTaskInterest: async (taskId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            toast.error("You must be logged in to show interest.");
            return;
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
            } else {
                toast.error("Failed to show interest for task.");
            }
            console.error(error);
        } else {
            toast.success("Interest recorded! Moderators will review your interest.");
        }
    }
}));