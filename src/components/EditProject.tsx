import { useState } from "react";
import { supabase } from "../config";
import toast from "react-hot-toast";

interface EditProjectProps {
    project: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EditProject({ project, onSuccess, onCancel }: EditProjectProps) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: project.title || "",
        description: project.description || "",
        drive_url: project.drive_url || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from("projects")
            .update({
                title: formData.title,
                description: formData.description,
                drive_url: formData.drive_url,
            })
            .eq("id", project.id);

        setLoading(false);

        if (error) {
            toast.error("Failed to update project.");
            console.error(error);
        } else {
            toast.success("Project updated successfully!");
            onSuccess();
        }
    };

    return (
        <div className="bg-[var(--cream)] border border-[var(--cream-border)] rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="font-['Playfair_Display',_serif] text-[28px] font-bold text-[var(--obsidian)]">
                    Edit Project
                </h2>
                <p className="text-[var(--text-muted)] text-sm">Update the details for "{project.title}"</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[var(--obsidian)]">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[var(--obsidian)]">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[var(--obsidian)]">Drive Link</label>
                    <input
                        type="url"
                        name="drive_url"
                        value={formData.drive_url}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/..."
                        className="input-field px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
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
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}