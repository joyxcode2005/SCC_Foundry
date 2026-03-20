import { avatarColors } from "../config/constants";
import type { ProjectProps } from "../config/types";

export default function Projects({ projects = [], loading = false }: ProjectProps) {
  return (
    <div className="animate-fade-up">
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
          <button className="btn-primary flex items-center gap-[7px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </button>
        </div>
      </div>

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
                  <div className={`h-[3px] bg-gradient-to-r ${isCompleted
                      ? 'from-[#2D7A4A] to-[#4A9A6A]'
                      : 'from-[var(--amber)] to-[var(--amber-light)]'
                    }`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-1">
                          {project.course}
                        </span>
                        <h3 className="font-['Playfair_Display',_serif] text-[17px] font-semibold text-[var(--obsidian)] leading-[1.3]">
                          {project.title}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ml-3 ${isCompleted ? 'bg-[#EEF7F0] text-[#2D7A4A]' : 'bg-[var(--amber-pale)] text-[var(--amber)]'
                        }`}>
                        {project.status}
                      </span>
                    </div>

                    <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6] mb-[18px]">
                      {project.desc}
                    </p>

                    <div className="flex gap-1.5 flex-wrap mb-[18px]">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-[9px] py-[3px] rounded-[5px] bg-[var(--cream)] border border-[var(--cream-border)] text-[11px] font-medium text-[var(--text-secondary)]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">Progress</span>
                        <span className={`text-[11px] font-bold ${isCompleted ? 'text-[#2D7A4A]' : 'text-[var(--amber)]'}`}>
                          {project.progress}%
                        </span>
                      </div>
                      <div className="h-[5px] bg-[var(--cream-border)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${isCompleted ? 'from-[#2D7A4A] to-[#4A9A6A]' : 'from-[var(--amber)] to-[var(--amber-light)]'
                            }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {project.members.map((m, i) => (
                          <div
                            key={i}
                            title={m}
                            className={`w-[26px] h-[26px] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white relative ${i > 0 ? '-ml-2' : ''}`}
                            style={{
                              background: avatarColors[i % avatarColors.length],
                              zIndex: project.members.length - i,
                            }}
                          >
                            {m.slice(0, 2).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Due {new Date(project.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* New project card */}
            <div className="border-2 border-dashed border-[var(--cream-border)] rounded-2xl flex flex-col items-center justify-center py-12 px-6 cursor-pointer transition-all duration-200 min-h-[200px] hover:border-[var(--amber)] hover:bg-[var(--amber-pale)]">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--cream)] border border-[var(--cream-border)] flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Start a New Project</p>
              <p className="text-xs text-[var(--text-muted)] text-center">Collaborate with peers and build something great.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}