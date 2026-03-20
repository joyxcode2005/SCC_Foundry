import { hrefCards } from "../config/constants";


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
      <div className="mb-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--amber)] mb-2">
              Dashboard
            </p>
            <h1 className="font-['Playfair_Display',_serif] text-[40px] font-bold text-[var(--obsidian)] tracking-[-0.025em] leading-[1.1]">
              Good morning,<br />
              <em className="italic font-normal">Scholar.</em>
            </h1>
          </div>
          <div className="px-4 py-2.5 bg-white border border-[var(--cream-border)] rounded-[10px] text-xs text-[var(--text-muted)] font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="animate-fade-up-delay-1 grid grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="foundry-card px-[22px] py-5">
            <div className="w-9 h-9 bg-[var(--cream)] rounded-lg flex items-center justify-center text-[var(--amber)] mb-4">
              {stat.icon}
            </div>
            <div className="font-['Playfair_Display',_serif] text-[28px] font-bold text-[var(--cream-border)] leading-none mb-2">
              {stat.value}
            </div>
            <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="animate-fade-up-delay-2 grid grid-cols-2 gap-5">
        {/* Recent Activity — empty state */}
        <div className="foundry-card p-7">
          <h3 className="font-['Playfair_Display',_serif] text-lg font-semibold text-[var(--obsidian)] mb-6">
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)]">
            <svg className="mb-2.5 opacity-30" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p className="text-[13px] font-medium mb-[3px]">No activity yet</p>
            <p className="text-xs">Your recent actions will appear here.</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          {hrefCards.map((card, i) => (
            <a 
              key={i} 
              href={card.href} 
              className="flex items-center justify-between px-[22px] py-5 bg-white border border-[var(--cream-border)] rounded-xl no-underline transition-all duration-200 hover:translate-x-[3px] hover:shadow-md"
              style={{ borderLeft: `3px solid ${card.accent}` }}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--obsidian)] mb-0.5">{card.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{card.desc}</p>
              </div>
              <svg className="text-[var(--text-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}