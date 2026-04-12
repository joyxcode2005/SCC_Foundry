import { useState, useEffect } from "react";
import { supabase } from "../config";
import toast from "react-hot-toast";

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
    repo_full_name: "",
  });

  const repoPattern = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;

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

    const normalizedRepo = formData.repo_full_name.trim();
    if (!repoPattern.test(normalizedRepo)) {
      toast.error("Repository must be in owner/repo format.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating project...");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Authentication required.", { id: toastId });
      setLoading(false);
      return;
    }

    const { data: newProject, error: projectError } = await supabase
      .from("projects")
      .insert([{
        title: formData.title,
        description: formData.description,
        drive_url: formData.drive_url,
        created_by: user.id,
      }])
      .select()
      .single();

    if (projectError) {
      toast.error(projectError.message, { id: toastId });
      setLoading(false);
      return;
    }

    const { error: trackedRepoError } = await supabase
      .from("tracked_repositories")
      .insert([{
        project_id: newProject.id,
        repo_full_name: normalizedRepo,
      }]);

    if (trackedRepoError) {
      await supabase.from("projects").delete().eq("id", newProject.id);
      toast.error(trackedRepoError.message, { id: toastId });
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase
      .from("project_members")
      .insert([{
        project_id: newProject.id,
        user_id: user.id,
        role: "MODERATOR"
      }]);

    setLoading(false);

    if (memberError) {
      console.error("Member assign error:", memberError);
      toast.error("Project created, but failed to assign role.", { id: toastId });
    } else {
      toast.success("Project created successfully!", { id: toastId });
      if (onSuccess) onSuccess();
    }
  };

  if (userRole && userRole !== "MODERATOR") return null;

  return (
    <div className="animate-fade-up max-w-[680px]">
      <div className="mb-9">
        <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-['Playfair_Display',_serif] text-[36px] font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-1.5">
              New Project
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Fill in the details below to create a new project.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex items-center gap-1.5 text-xs py-[7px] px-4"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </button>
        </div>
      </div>

      <div className="foundry-card overflow-hidden">
        <div className="h-[3px] bg-gradient-to-r from-[var(--amber)] to-[var(--amber-light)]" />

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-7">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--amber)] mb-4">
              Project Details
            </p>
            <div className="flex flex-col gap-4">

              <div>
                <label className="block text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--text-muted)] mb-1.5">
                  Project Title <span className="text-[var(--amber)]">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a clear, descriptive project name…"
                  className="foundry-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--text-muted)] mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this project about? What are the goals?"
                  rows={4}
                  className="foundry-textarea"
                />
              </div>

            </div>
          </div>

          <div className="h-px bg-[var(--cream-border)] my-6" />

          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--amber)] mb-4">
              Resources
            </p>
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--text-muted)] mb-1.5">
                Google Drive URL
              </label>
              <input
                type="url"
                value={formData.drive_url}
                onChange={(e) => setFormData({ ...formData, drive_url: e.target.value })}
                placeholder="https://drive.google.com/…"
                className="foundry-input"
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                Optional. Paste a shared Google Drive folder or document link for the team.
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--text-muted)] mb-1.5">
                GitHub Repository <span className="text-[var(--amber)]">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.repo_full_name}
                onChange={(e) => setFormData({ ...formData, repo_full_name: e.target.value })}
                placeholder="owner/repository"
                className="foundry-input"
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                Required. Enter the repository in owner/repo format.
              </p>
            </div>
          </div>

          <div className="h-px bg-[var(--cream-border)] mb-6" />

          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[var(--text-muted)]">
              Fields marked <span className="text-[var(--amber)] font-semibold">*</span> are required.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary min-w-[140px] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Creating…
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Project
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}