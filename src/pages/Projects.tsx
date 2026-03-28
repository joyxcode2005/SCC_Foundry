import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config";
import type { ProjectProps } from "../types";
import CreateProject from "../components/CreateProject";
import EditProject from "../components/EditProject";
import ProjectDetails from "../components/ProjectDetails";
import ProjectCard from "../components/ProjectCard";
import toast from "react-hot-toast";
import { useProjectStore } from "../store/useProjectStore";

export default function Projects({ projects = [], loading = false }: ProjectProps) {
  const { setCurrentProject, setUserRole, userRole: globalUserRole } = useProjectStore();
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'details'>('list');
  const [projectData, setProjectData] = useState<ProjectProps["projects"]>(projects);
  const [isFetching, setIsFetching] = useState(loading);
  const [editingProject, setEditingProject] = useState<any>(null);

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
        setUserRole(data?.role || "MEMBER");
      }
    }
    getRole();
  }, [setUserRole]);

  const fetchProjectData = useCallback(async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      toast.error("Failed to load projects.");
    } else {
      setProjectData(data);
    }
    setIsFetching(false);
  }, []);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);
  const isModerator = globalUserRole === "MODERATOR";

  const handleProjectSuccess = () => {
    setCurrentView('list');
    setEditingProject(null);
    fetchProjectData();
  };

  const handleEdit = (e: React.MouseEvent, project: any) => {
    e.stopPropagation();
    setEditingProject(project);
    setCurrentView('edit');
  };

  const handleCardClick = (project: any) => {
    setCurrentProject(project);
    setCurrentView('details');
  };

  if (currentView === 'create') {
    return (
      <div className="animate-fade-up">
        <CreateProject
          onSuccess={handleProjectSuccess}
          onCancel={() => setCurrentView('list')}
        />
      </div>
    );
  }

  if (currentView === 'edit' && editingProject) {
    return (
      <div className="animate-fade-up">
        <EditProject
          project={editingProject}
          onSuccess={handleProjectSuccess}
          onCancel={() => {
            setCurrentView('list');
            setEditingProject(null);
          }}
        />
      </div>
    );
  }

  if (currentView === 'details') {
    return (
      <ProjectDetails />
    );
  }

  const safeProjectData = projectData ?? [];
  const activeCount = safeProjectData.filter(p => p.status === 'Active').length;
  const completedCount = safeProjectData.filter(p => p.status === 'Completed').length;

  return (
    <div className="animate-fade-up relative">
      <div className="mb-9">
        <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-['Playfair_Display',_serif] text-[36px] font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-1.5">
              Projects
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {activeCount} active · {completedCount} completed
            </p>
          </div>

          {isModerator && (
            <button
              onClick={() => setCurrentView('create')}
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

      <div className="animate-fade-up-delay-1 grid grid-cols-2 gap-[18px]">
        {isFetching ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-[260px] rounded-2xl" />
          ))
        ) : (
          <>
            {safeProjectData.length === 0 ? (
              <div className="col-span-2 py-16 text-center border border-dashed border-[var(--cream-border)] rounded-2xl bg-[var(--cream)]">
                <p className="text-[var(--text-muted)] font-medium">No projects available.</p>
              </div>
            ) : (
              safeProjectData.map((project) => {
                const isCompleted = project.status === 'Completed';
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isCompleted={isCompleted}
                    isModerator={isModerator}
                    handleEdit={handleEdit}
                    onClick={() => handleCardClick(project)}
                  />
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}