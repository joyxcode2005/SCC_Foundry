export default function Overview() {
  const statCards = [
    { label: 'Tasks Completed', value: '—', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    )},
    { label: 'Active Projects', value: '—', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    )},
    { label: 'Leaderboard Rank', value: '—', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    )},
    { label: 'Points Earned', value: '—', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )},
  ];

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{
              fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '8px',
            }}>
              Dashboard
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '40px', fontWeight: '700', color: 'var(--obsidian)',
              letterSpacing: '-0.025em', lineHeight: '1.1',
            }}>
              Good morning,<br />
              <em style={{ fontStyle: 'italic', fontWeight: '400' }}>Scholar.</em>
            </h1>
          </div>
          <div style={{
            padding: '10px 16px', background: 'white',
            border: '1px solid var(--cream-border)', borderRadius: '10px',
            fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500',
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="animate-fade-up-delay-1" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px',
      }}>
        {statCards.map((stat, i) => (
          <div key={i} className="foundry-card" style={{ padding: '20px 22px' }}>
            <div style={{
              width: '36px', height: '36px', background: 'var(--cream)', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--amber)', marginBottom: '16px',
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '28px', fontWeight: '700',
              color: 'var(--cream-border)', lineHeight: '1', marginBottom: '8px',
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="animate-fade-up-delay-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Activity — empty state */}
        <div className="foundry-card" style={{ padding: '28px' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '18px', fontWeight: '600', color: 'var(--obsidian)', marginBottom: '24px',
          }}>
            Recent Activity
          </h3>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '32px 0', color: 'var(--text-muted)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25"
              style={{ marginBottom: '10px', opacity: 0.3 }}>
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '3px' }}>No activity yet</p>
            <p style={{ fontSize: '12px' }}>Your recent actions will appear here.</p>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { title: 'View Leaderboard', desc: 'See where you stand among peers', href: '/dashboard/leaderboard', accent: 'var(--amber)' },
            { title: 'Browse Tasks', desc: 'View and manage your assignments', href: '/dashboard/tasks', accent: 'var(--obsidian)' },
            { title: 'Your Projects', desc: 'Collaborate and build', href: '/dashboard/projects', accent: '#4A7A5A' },
          ].map((card, i) => (
            <a key={i} href={card.href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 22px', background: 'white',
              border: '1px solid var(--cream-border)', borderRadius: '12px',
              textDecoration: 'none', transition: 'all 0.2s',
              borderLeft: `3px solid ${card.accent}`,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(3px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--obsidian)', marginBottom: '2px' }}>{card.title}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{card.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}