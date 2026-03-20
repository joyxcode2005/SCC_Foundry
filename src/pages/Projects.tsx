import { useState, useEffect } from "react";
import { supabase } from "../config";
import type { ProjectProps } from "../config/types";
import CreateProject from "../components/CreateProject";

export default function Projects({ projects = [], loading = false }: ProjectProps) {
  // State to toggle between the list and the form
  const [currentView, setCurrentView] = useState<'list' | 'create'>('list');
  const [userRole, setUserRole] = useState<string | null>(null);

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

  const isModerator = userRole === "MODERATOR";

  // If the view is 'create', SHOW THE FORM INSTEAD
  if (currentView === 'create') {
    return (
      <div className="animate-fade-up">
        {/* Pass functions to go back to the list view */}
        <CreateProject
          onSuccess={() => setCurrentView('list')}
          onCancel={() => setCurrentView('list')}
        />
      </div>
    );
  }

  // OTHERWISE, SHOW THE LIST
  return (
    <div className="animate-fade-up relative">
      {/* Header */}
      <div className="mb-9">
        <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-['Playfair_Display',_serif] text-[36px] font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-1.5">
              Projects
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {projects.filter(p => p.status === 'Active').length} active · {projects.filter(p => p.status === 'Completed').length} completed
            </p>
          </div>

          {isModerator && (
            <button
              onClick={() => setCurrentView('create')} // Swap view here
              className="btn-primary flex items-center gap-[7px]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Project
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="animate-fade-up-delay-1 grid grid-cols-2 gap-[18px]">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-[260px] rounded-2xl" />
          ))
        ) : (
          <>
            {projects.map((project) => {
              const isCompleted = project.status === 'Completed';
              return (
                <div key={project.id} className="foundry-card p-0 overflow-hidden cursor-pointer">
                  <div className={`h-[3px] bg-gradient-to-r ${isCompleted ? 'from-[#2D7A4A] to-[#4A9A6A]' : 'from-[var(--amber)] to-[var(--amber-light)]'}`} />
                  <div className="p-6">
                    <h3 className="font-['Playfair_Display',_serif] text-[17px] font-semibold text-[var(--obsidian)] leading-[1.3] mb-2">
                      {project.title}
                    </h3>
                    <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2">{project.description}</p>
                  </div>
                </div>
              );
            })}

            {isModerator && (
              <div
                onClick={() => setCurrentView('create')} // Swap view here
                className="border-2 border-dashed border-[var(--cream-border)] rounded-2xl flex flex-col items-center justify-center py-12 px-6 cursor-pointer transition-all duration-200 min-h-[200px] hover:border-[var(--amber)] hover:bg-[var(--amber-pale)]"
              >
                <div className="w-10 h-10 rounded-[10px] bg-[var(--cream)] border border-[var(--cream-border)] flex items-center justify-center mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Start a New Project</p>
                <p className="text-xs text-[var(--text-muted)] text-center">Collaborate with peers and build something great.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}