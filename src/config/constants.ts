

export const medalEmoji: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
export const medalBg: Record<number, string> = { 1: '#FDF3E0', 2: '#F4F5F6', 3: '#F6EFE9' };

export const hrefCards = [
  { title: 'View Leaderboard', desc: 'See where you stand among peers', href: '/dashboard/leaderboard', accent: 'var(--amber)' },
  { title: 'Browse Tasks', desc: 'View and manage your assignments', href: '/dashboard/tasks', accent: 'var(--obsidian)' },
  { title: 'Your Projects', desc: 'Collaborate and build', href: '/dashboard/projects', accent: '#4A7A5A' },
]

export const avatarColors = ['#C8862A', '#4A7A5A', '#4A6A9A', '#8A4A7A', '#9A6A4A', '#5A7A8A'];

export const priorityColors: Record<string, { text: string; bg: string; border: string }> = {
  High: { text: '#B04040', bg: '#FEF2F2', border: 'rgba(176,64,64,0.2)' },
  Medium: { text: '#8B6A00', bg: '#FEFCE8', border: 'rgba(139,106,0,0.2)' },
  Low: { text: '#2D7A4A', bg: '#EEF7F0', border: 'rgba(45,122,74,0.2)' },
};

export const statusConfig: Record<string, { color: string; bg: string }> = {
  Pending: { color: 'var(--text-muted)', bg: 'var(--cream)' },
  'In Progress': { color: '#1A6FA8', bg: '#EFF8FF' },
  Completed: { color: '#2D7A4A', bg: '#EEF7F0' },
};



