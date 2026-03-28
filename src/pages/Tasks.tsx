import { useState } from "react";
import { priorityColors, statusConfig, } from "../config/constants";
import type { FilterType, TaskProps } from "../types";

export default function Tasks({ tasks = [], loading = false }: TaskProps) {
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  const counts = {
    All: tasks.length,
    Pending: tasks.filter(t => t.status === 'Pending').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-9">
        <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-1.5">
              Tasks
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {counts.Pending} pending · {counts['In Progress']} in progress
            </p>
          </div>
          <button className="btn-primary flex items-center gap-[7px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="animate-fade-up-delay-1 flex gap-1 bg-white border border-[var(--cream-border)] rounded-[10px] p-1 mb-6 w-fit">
        {(['All', 'Pending', 'In Progress', 'Completed'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-[7px] rounded-[7px] border-none cursor-pointer text-[13px] transition-all duration-150 flex items-center gap-1.5 ${filter === f
                ? 'font-semibold text-[var(--obsidian)] bg-[var(--cream)]'
                : 'font-normal text-[var(--text-muted)] bg-transparent'
              }`}
          >
            {f}
            <span className={`text-[10px] font-bold px-1.5 py-[1px] rounded-full ${filter === f
                ? 'bg-[var(--amber-pale)] text-[var(--amber)]'
                : 'bg-transparent text-[var(--text-muted)]'
              }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="animate-fade-up-delay-2 flex flex-col gap-2.5">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-[72px] rounded-xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-[var(--cream-border)] rounded-2xl text-[var(--text-muted)]">
            <svg className="mb-3 opacity-40" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <p className="text-sm font-medium">No tasks found</p>
            <p className="text-xs mt-1">
              {filter === 'All' ? 'Tasks assigned to you will appear here.' : `No ${filter.toLowerCase()} tasks.`}
            </p>
          </div>
        ) : (
          filtered.map((task) => {
            const p = priorityColors[task.priority];
            const s = statusConfig[task.status];
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`foundry-card px-6 py-5 flex items-center gap-4 ${isCompleted ? 'opacity-65' : 'opacity-100'}`}
              >
                <div className={`w-5 h-5 rounded-[5px] shrink-0 flex items-center justify-center ${isCompleted ? 'border-none bg-[var(--obsidian)]' : 'border-[1.5px] border-[var(--cream-border)] bg-white'
                  }`}>
                  {isCompleted && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className={`text-sm font-medium text-[var(--obsidian)] ${isCompleted ? 'line-through' : 'no-underline'}`}>
                      {task.title}
                    </span>
                    <span
                      className="text-[10px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-full border border-solid"
                      style={{ color: p.text, backgroundColor: p.bg, borderColor: p.border }}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--text-muted)] font-medium font-mono">{task.course}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      Due {new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-[var(--amber-pale)] rounded-lg text-xs font-bold text-[var(--amber)]">
                  +{task.points} pts
                </div>

                <div
                  className="px-3 py-[5px] rounded-lg text-xs font-medium min-w-[90px] text-center"
                  style={{ backgroundColor: s.bg, color: s.color }}
                >
                  {task.status}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}