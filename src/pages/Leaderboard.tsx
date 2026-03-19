// Types for real data — wire up via Supabase query
interface Student {
  rank: number;
  name: string;
  roll: string;
  department: string;
  points: number;
  isYou?: boolean;
}

const medalEmoji: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
const medalBg: Record<number, string> = { 1: '#FDF3E0', 2: '#F4F5F6', 3: '#F6EFE9' };
const medalColor: Record<number, string> = { 1: '#C8862A', 2: '#9EA4AD', 3: '#8B6244' };

interface Props {
  students?: Student[];
  loading?: boolean;
}

export default function Leaderboard({ students = [], loading = false }: Props) {
  const top3 = students.slice(0, 3);
  const rest = students.slice(3);

  const EmptyState = () => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 24px', color: 'var(--text-muted)',
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '12px', opacity: 0.4 }}>
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
      <p style={{ fontSize: '14px', fontWeight: '500' }}>No leaderboard data yet</p>
      <p style={{ fontSize: '12px', marginTop: '4px' }}>Rankings will appear as students earn points.</p>
    </div>
  );

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ width: '28px', height: '2px', background: 'var(--amber)', borderRadius: '1px', marginBottom: '12px' }} />
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '36px', fontWeight: '700', color: 'var(--obsidian)',
          letterSpacing: '-0.02em', marginBottom: '8px',
        }}>
          Leaderboard
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Top performing students ranked by total points.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="foundry-card"><EmptyState /></div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="animate-fade-up-delay-1" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px',
            }}>
              {[top3[1], top3[0], top3[2]].filter(Boolean).map((s, i) => {
                const isCenter = i === 1;
                return (
                  <div key={s.rank} style={{
                    background: isCenter ? 'var(--obsidian)' : 'white',
                    border: `1px solid ${isCenter ? 'var(--obsidian)' : 'var(--cream-border)'}`,
                    borderRadius: '16px', padding: '24px', textAlign: 'center',
                    marginTop: isCenter ? '0' : '16px', position: 'relative', overflow: 'hidden',
                    boxShadow: isCenter ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  }}>
                    {isCenter && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--amber)' }} />}
                    <div style={{
                      width: '40px', height: '40px',
                      background: isCenter ? 'rgba(250,248,243,0.1)' : medalBg[s.rank] || 'var(--cream)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 12px', fontSize: '18px',
                    }}>
                      {medalEmoji[s.rank]}
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: isCenter ? 'var(--cream)' : 'var(--obsidian)', marginBottom: '4px' }}>{s.name}</p>
                    <p style={{ fontSize: '11px', color: isCenter ? 'rgba(250,248,243,0.5)' : 'var(--text-muted)', marginBottom: '12px' }}>{s.roll}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '700', color: isCenter ? 'var(--amber-light)' : 'var(--obsidian)' }}>
                      {s.points.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '11px', color: isCenter ? 'rgba(250,248,243,0.4)' : 'var(--text-muted)' }}>points</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rest of table */}
          {rest.length > 0 && (
            <div className="animate-fade-up-delay-2 foundry-card" style={{ overflow: 'hidden' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '48px 1fr 120px 100px',
                padding: '12px 24px', borderBottom: '1px solid var(--cream-border)', background: 'var(--cream)',
              }}>
                {['Rank', 'Student', 'Department', 'Points'].map(h => (
                  <span key={h} style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {h}
                  </span>
                ))}
              </div>
              {rest.map((student, i) => (
                <div key={student.rank} style={{
                  display: 'grid', gridTemplateColumns: '48px 1fr 120px 100px',
                  padding: '16px 24px', alignItems: 'center',
                  borderBottom: i < rest.length - 1 ? '1px solid var(--cream-border)' : 'none',
                  background: student.isYou ? 'var(--amber-pale)' : 'white',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '7px', background: 'var(--cream)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)',
                  }}>
                    {student.rank}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--obsidian)' }}>{student.name}</span>
                      {student.isYou && <span className="foundry-badge badge-amber">You</span>}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{student.roll}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{student.department}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '600', color: student.isYou ? 'var(--amber)' : 'var(--obsidian)' }}>
                    {student.points.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}