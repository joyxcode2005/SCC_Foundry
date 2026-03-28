import { useState } from "react";
import { supabase } from "../config";
import toast from "react-hot-toast";
import { useProjectStore } from "../store/useProjectStore";
import type { CreateTaskProps } from "../types";



export default function CreateTask({ onSuccess, onCancel }: CreateTaskProps) {
    const { currentProject, userRole } = useProjectStore();
    const isModerator = userRole === 'MODERATOR';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "TECH",
        points: 10,
        max_assignees: 1,
        max_interests: 5,
        deadline: "",
        drive_folder_url: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isModerator || !currentProject) {
            toast.error("Only moderators can create tasks for this project.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Creating task...");

        const deadlineValue = formData.deadline ? new Date(formData.deadline).toISOString() : null;

        const { error } = await supabase.from("tasks").insert([
            {
                project_id: currentProject.id,
                title: formData.title,
                description: formData.description || null,
                category: formData.category,
                points: Number(formData.points),
                max_assignees: Number(formData.max_assignees),
                max_interests: Number(formData.max_interests),
                deadline: deadlineValue,
                drive_folder_url: formData.drive_folder_url || null,
            },
        ]);

        setLoading(false);

        if (error) {
            toast.error(error.message || "Failed to create task.", { id: toastId });
            console.error("Task creation error:", error);
        } else {
            toast.success("Task created successfully!", { id: toastId });
            onSuccess();
        }
    };

    if (!isModerator) {
        return (
            <div className="bg-[var(--cream)] border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto my-6 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
                <p className="text-[var(--text-muted)] mb-6">You must be a Moderator of this project to create tasks.</p>
                <button onClick={onCancel} className="btn-primary px-6 py-2">Go Back</button>
            </div>
        );
    }

    return (
        <div className="bg-[var(--cream)] border border-[var(--cream-border)] rounded-2xl p-8 max-w-2xl mx-auto my-6">
            <div className="mb-6">
                <h2 className="font-['Playfair_Display',_serif] text-[28px] font-bold text-[var(--obsidian)]">
                    Create New Task
                </h2>
                <p className="text-[var(--text-muted)] text-sm">Add a new actionable item for this project.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[var(--obsidian)]">Task Title *</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Design Landing Page"
                        className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[var(--obsidian)]">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Provide context or requirements for this task..."
                        className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[var(--obsidian)]">Category *</label>
                        <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)] bg-white"
                        >
                            <option value="TECH">TECH</option>
                            <option value="VIDEO">VIDEO</option>
                            <option value="PHOTO">PHOTO</option>
                            <option value="CONTENT">CONTENT</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[var(--obsidian)]">Points</label>
                        <input
                            type="number"
                            name="points"
                            min="0"
                            required
                            value={formData.points}
                            onChange={handleChange}
                            className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[var(--obsidian)]">Max Assignees</label>
                        <input
                            type="number"
                            name="max_assignees"
                            min="1"
                            required
                            value={formData.max_assignees}
                            onChange={handleChange}
                            className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[var(--obsidian)]">Max Interests</label>
                        <input
                            type="number"
                            name="max_interests"
                            min="1"
                            required
                            value={formData.max_interests}
                            onChange={handleChange}
                            className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[var(--obsidian)]">Deadline</label>
                        <input
                            type="datetime-local"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[var(--obsidian)]">Drive Folder URL</label>
                        <input
                            type="url"
                            name="drive_folder_url"
                            value={formData.drive_folder_url}
                            onChange={handleChange}
                            placeholder="https://drive.google.com/..."
                            className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 border-t border-[var(--cream-border)] pt-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--obsidian)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary px-6 py-2"
                    >
                        {loading ? "Creating..." : "Create Task"}
                    </button>
                </div>
            </form>
        </div>
    );
}