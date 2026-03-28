import { Link2, Pencil } from 'lucide-react'
import type { ProjectCardProps } from '../config/types'
import { Link } from 'react-router-dom'

const ProjectCard = ({ project, isCompleted, isModerator, handleEdit, onClick }: ProjectCardProps) => {
    return (
        <div onClick={onClick} key={project.id} className="foundry-card p-0 overflow-hidden cursor-pointer relative group">
            <div className={`h-[3px] bg-gradient-to-r ${isCompleted ? 'from-[#2D7A4A] to-[#4A9A6A]' : 'from-[var(--amber)] to-[var(--amber-light)]'}`} />

            {/* Action Buttons (Visible on Hover for Moderators) */}
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link
                    to={project.drive_url}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()} // <-- ADD THIS LINE
                    className="p-1.5 bg-white/90 border border-[var(--cream-border)] rounded-md text-[var(--text-secondary)] hover:text-blue-500 hover:border-blue-500 transition-colors"
                    title="View Drive Folder"
                >
                    <Link2 className='-rotate-45' size={16} />
                </Link>
                {isModerator && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // <-- YOU LIKELY NEED THIS HERE TOO
                            handleEdit(e, project);
                        }}
                        className="p-1.5 bg-white/90 border border-[var(--cream-border)] rounded-md text-[var(--text-secondary)] hover:text-[var(--amber)] hover:border-[var(--amber)] transition-colors"
                        title="Edit Project"
                    >
                        <Pencil size={16} />
                    </button>
                )}
            </div>

            <div className="p-6">
                <h3 className="font-['Playfair_Display',_serif] text-[17px] font-semibold text-[var(--obsidian)] leading-[1.3] mb-2 pr-16">
                    {project.title}
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2">{project.description}</p>
            </div>
        </div >
    )
}

export default ProjectCard