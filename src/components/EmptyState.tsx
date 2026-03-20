const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-[var(--text-muted)]">
        <svg className="mb-3 opacity-40" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
        <p className="text-sm font-medium">No leaderboard data yet</p>
        <p className="text-xs mt-1">Rankings will appear as students earn points.</p>
    </div>
);

export default EmptyState;