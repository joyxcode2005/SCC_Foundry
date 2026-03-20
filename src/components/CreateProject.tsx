import { useState, useEffect } from "react";
import { supabase } from "../config";
import toast from "react-hot-toast";

// Add props so the parent component can tell it what to do on success or cancel
interface CreateProjectProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CreateProject({ onSuccess, onCancel }: CreateProjectProps) {
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        drive_url: "",
    });

    useEffect(() => {
        async function getRole() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
                setUserRole(data?.role || "MEMBER");
            }
        }
        getRole();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userRole !== "MODERATOR") {
            toast.error("Only Moderators can create projects.");
            return;
        }

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from("projects").insert([
            { ...formData, created_by: user?.id },
        ]);

        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Project created successfully!");
            if (onSuccess) onSuccess(); // Go back to list view
        }
    };

    if (userRole && userRole !== "MODERATOR") return null;

    return (
        <div className="max-w-2xl bg-white p-8 rounded-2xl border border-[var(--cream-border)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-[var(--obsidian)]">Create New Project</h2>

                {/* Back Button */}
                <button
                    onClick={onCancel}
                    type="button"
                    className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--obsidian)] transition-colors flex items-center gap-1.5"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Projects
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (Keep your existing inputs for title, description, drive_url here) ... */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Project Title</label>
                    <input required className="w-full px-4 py-2.5 rounded-lg border border-[var(--cream-border)] focus:ring-2 focus:ring-[var(--amber)] outline-none transition-all" placeholder="Enter project name..." value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Description</label>
                    <textarea className="w-full px-4 py-2.5 rounded-lg border border-[var(--cream-border)] focus:ring-2 focus:ring-[var(--amber)] outline-none transition-all min-h-[100px]" placeholder="What is this project about?" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Google Drive URL</label>
                    <input type="url" className="w-full px-4 py-2.5 rounded-lg border border-[var(--cream-border)] focus:ring-2 focus:ring-[var(--amber)] outline-none transition-all" placeholder="https://drive.google.com/..." value={formData.drive_url} onChange={(e) => setFormData({ ...formData, drive_url: e.target.value })} />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-50 text-[var(--text-secondary)] border border-[var(--cream-border)] font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[var(--obsidian)] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </form>
        </div>
    );
}