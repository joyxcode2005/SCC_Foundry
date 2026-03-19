import { useState } from 'react';

// Types for real data
export interface Task {
  id: number | string;
  title: string;
  course: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  points: number;
}

const priorityColors: Record<string, { text: string; bg: string; border: string }> = {
  High:   { text: '#B04040', bg: '#FEF2F2', border: 'rgba(176,64,64,0.2)' },
  Medium: { text: '#8B6A00', bg: '#FEFCE8', border: 'rgba(139,106,0,0.2)' },
  Low:    { text: '#2D7A4A', bg: '#EEF7F0', border: 'rgba(45,122,74,0.2)' },
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  Pending:       { color: 'var(--text-muted)', bg: 'var(--cream)' },
  'In Progress': { color: '#1A6FA8', bg: '#EFF8FF' },
  Completed:     { color: '#2D7A4A', bg: '#EEF7F0' },
};

type FilterType = 'All' | 'Pending' | 'In Progress' | 'Completed';

interface Props {
  tasks?: Task[];
  loading?: boolean;
}

export default function Tasks({ tasks = [], loading = false }: Props) {
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
      <div style={{ marginBottom: '36px' }}>
        <div style={{ width: '28px', height: '2px', background: 'var(--amber)', borderRadius: '1px', marginBottom: '12px' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '36px', fontWeight: '700', color: 'var(--obsidian)',
              letterSpacing: '-0.02em', marginBottom: '6px',
            }}>
              Tasks
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {counts.Pending} pending · {counts['In Progress']} in progress
            </p>
          </div>
          <button className="btn-primary" style={{ gap: '7px', display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="animate-fade-up-delay-1" style={{
        display: 'flex', gap: '4px', background: 'white',
        border: '1px solid var(--cream-border)', borderRadius: '10px',
        padding: '4px', marginBottom: '24px', width: 'fit-content',
      }}>
        {(['All', 'Pending', 'In Progress', 'Completed'] as FilterType[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: filter === f ? '600' : '400',
            color: filter === f ? 'var(--obsidian)' : 'var(--text-muted)',
            background: filter === f ? 'var(--cream)' : 'transparent',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {f}
            <span style={{
              fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '100px',
              background: filter === f ? 'var(--amber-pale)' : 'transparent',
              color: filter === f ? 'var(--amber)' : 'var(--text-muted)',
            }}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="animate-fade-up-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '12px' }} />
          ))
        ) : filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '64px 24px',
            background: 'white', border: '1px solid var(--cream-border)',
            borderRadius: '16px', color: 'var(--text-muted)',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '12px', opacity: 0.4 }}>
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            <p style={{ fontSize: '14px', fontWeight: '500' }}>No tasks found</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              {filter === 'All' ? 'Tasks assigned to you will appear here.' : `No ${filter.toLowerCase()} tasks.`}
            </p>
          </div>
        ) : (
          filtered.map((task) => {
            const p = priorityColors[task.priority];
            const s = statusConfig[task.status];
            const isCompleted = task.status === 'Completed';
            return (
              <div key={task.id} className="foundry-card" style={{
                padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                opacity: isCompleted ? 0.65 : 1,
              }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0,
                  border: isCompleted ? 'none' : '1.5px solid var(--cream-border)',
                  background: isCompleted ? 'var(--obsidian)' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isCompleted && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--obsidian)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                      {task.title}
                    </span>
                    <span style={{
                      fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
                      padding: '2px 8px', borderRadius: '100px',
                      color: p.text, background: p.bg, border: `1px solid ${p.border}`,
                    }}>
                      {task.priority}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', fontFamily: 'monospace' }}>{task.course}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Due {new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '6px 12px', background: 'var(--amber-pale)', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--amber)' }}>
                  +{task.points} pts
                </div>
                <div style={{ padding: '5px 12px', background: s.bg, borderRadius: '8px', fontSize: '12px', fontWeight: '500', color: s.color, minWidth: '90px', textAlign: 'center' }}>
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