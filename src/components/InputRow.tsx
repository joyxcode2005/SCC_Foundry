const InputRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--text-muted)] mb-1.5">
            {label}
        </label>
        {children}
    </div>
);

export default InputRow;