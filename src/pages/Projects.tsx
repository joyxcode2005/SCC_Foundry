// Types for real data
export interface Project {
  id: number | string;
  title: string;
  course: string;
  desc: string;
  members: string[];   // initials or names
  progress: number;    // 0–100
  status: 'Active' | 'Completed';
  due: string;
  tags: string[];
}

const avatarColors = ['#C8862A', '#4A7A5A', '#4A6A9A', '#8A4A7A', '#9A6A4A', '#5A7A8A'];

interface Props {
  projects?: Project[];
  loading?: boolean;
}

export default function Projects({ projects = [], loading = false }: Props) {
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
              Projects
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {projects.filter(p => p.status === 'Active').length} active · {projects.filter(p => p.status === 'Completed').length} completed
            </p>
          </div>
          <button className="btn-primary" style={{ gap: '7px', display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
          </button>
        </div>
      </div>

      <div className="animate-fade-up-delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '260px', borderRadius: '16px' }} />
          ))
        ) : (
          <>
            {projects.map((project) => {
              const isCompleted = project.status === 'Completed';
              return (
                <div key={project.id} className="foundry-card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{
                    height: '3px',
                    background: isCompleted
                      ? 'linear-gradient(90deg, #2D7A4A, #4A9A6A)'
                      : 'linear-gradient(90deg, var(--amber), var(--amber-light))',
                  }} />
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                          {project.course}
                        </span>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '600', color: 'var(--obsidian)', lineHeight: '1.3' }}>
                          {project.title}
                        </h3>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', flexShrink: 0, marginLeft: '12px',
                        background: isCompleted ? '#EEF7F0' : 'var(--amber-pale)',
                        color: isCompleted ? '#2D7A4A' : 'var(--amber)',
                      }}>
                        {project.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '18px' }}>
                      {project.desc}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                      {project.tags.map(tag => (
                        <span key={tag} style={{
                          padding: '3px 9px', borderRadius: '5px', background: 'var(--cream)',
                          border: '1px solid var(--cream-border)', fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>Progress</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: isCompleted ? '#2D7A4A' : 'var(--amber)' }}>{project.progress}%</span>
                      </div>
                      <div style={{ height: '5px', background: 'var(--cream-border)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${project.progress}%`, borderRadius: '100px',
                          background: isCompleted ? 'linear-gradient(90deg, #2D7A4A, #4A9A6A)' : 'linear-gradient(90deg, var(--amber), var(--amber-light))',
                        }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex' }}>
                        {project.members.map((m, i) => (
                          <div key={i} title={m} style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            background: avatarColors[i % avatarColors.length],
                            border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '9px', fontWeight: '700', color: 'white',
                            zIndex: project.members.length - i, position: 'relative',
                          }}>
                            {m.slice(0, 2).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Due {new Date(project.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* New project card */}
            <div style={{
              border: '2px dashed var(--cream-border)', borderRadius: '16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '48px 24px', cursor: 'pointer',
              transition: 'all 0.2s', minHeight: '200px',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--amber)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--amber-pale)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--cream-border)'; (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'var(--cream)', border: '1px solid var(--cream-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Start a New Project</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>Collaborate with peers and build something great.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}