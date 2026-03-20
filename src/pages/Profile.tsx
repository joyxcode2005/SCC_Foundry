import { useEffect, useState } from "react";
import InputRow from "../components/InputRow";
import type { UserProfile } from "../config/types";
import { supabase } from "../config";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profile, setProfile] = useState<UserProfile>({
        first_name: '', middle_name: '', last_name: '',
        phone: '', college_roll: '', department: '', role: 'MEMBER', email: '',
    });
    const [formData, setFormData] = useState<UserProfile>(profile);

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.from('users')
                    .select('first_name, middle_name, last_name, phone, college_roll, department, role, email')
                    .eq('id', user.id).single();
                if (!error && data) {
                    const p = {
                        first_name: data.first_name || '', middle_name: data.middle_name || '',
                        last_name: data.last_name || '', phone: data.phone || '',
                        college_roll: data.college_roll || '', department: data.department || '',
                        role: data.role || 'MEMBER', email: data.email || user.email || '',
                    };
                    setProfile(p); setFormData(p);
                }
            }
            setLoading(false);
        }
        getProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not logged in.');
            const { error } = await supabase.from('users').upsert({
                id: user.id, first_name: formData.first_name,
                middle_name: formData.middle_name || null, last_name: formData.last_name,
                phone: formData.phone, college_roll: formData.college_roll,
                department: formData.department, updated_at: new Date(),
            });
            if (error) throw error;
            setProfile(formData); setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const fullName = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ');
    const initials = [profile.first_name[0], profile.last_name[0]].filter(Boolean).join('').toUpperCase() || '?';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[var(--cream-border)] border-t-[var(--amber)] rounded-full animate-spin" />
                    <p className="text-[13px] text-[var(--text-muted)]">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-up max-w-[700px]">
            {/* Header */}
            <div className="mb-9">
                <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-3" />
                <h1 className="font-['Playfair_Display',_serif] text-[36px] font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-1.5">
                    Profile
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                    Manage your personal and academic information.
                </p>
            </div>

            {/* Success/Error */}
            {message.text && (
                <div className={`py-3 px-4 rounded-[10px] mb-5 text-[13.5px] font-medium flex items-center gap-2 border ${message.type === 'success'
                    ? 'bg-[#EEF7F0] border-[rgba(45,122,74,0.2)] text-[#2D7A4A]'
                    : 'bg-[#FEF2F2] border-[#FECACA] text-[#B04040]'
                    }`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        {message.type === 'success'
                            ? <path d="M20 6L9 17l-5-5" />
                            : <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
                        }
                    </svg>
                    {message.text}
                </div>
            )}

            <div className="foundry-card overflow-hidden">
                {/* Profile banner */}
                <div className="bg-[var(--obsidian)] p-8 relative overflow-hidden">
                    {/* Background grid */}
                    <div
                        className="absolute inset-0 bg-[length:32px_32px]"
                        style={{ backgroundImage: `linear-gradient(rgba(250,248,243,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(250,248,243,0.03) 1px, transparent 1px)` }}
                    />
                    <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full border border-[rgba(200,134,42,0.15)]" />

                    <div className="relative z-10 flex items-center gap-5">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-[var(--amber)] border-[3px] border-[rgba(200,134,42,0.3)] flex items-center justify-center font-['Playfair_Display',_serif] text-2xl font-bold text-white shrink-0">
                            {initials}
                        </div>

                        <div className="flex-1">
                            <h2 className="font-['Playfair_Display',_serif] text-[22px] font-bold text-[var(--cream)] tracking-[-0.01em] mb-1">
                                {fullName || 'Your Name'}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[13px] text-[#faf8f3]/50 font-mono">
                                    {profile.college_roll}
                                </span>
                                <span className="w-[3px] h-[3px] rounded-full bg-[#faf8f3]/20" />
                                <span className="text-[13px] text-[#faf8f3]/50">
                                    {profile.department}
                                </span>
                            </div>
                        </div>

                        {/* Role badge */}
                        {profile.role === "MODERATOR" ? (
                            <span className="px-3 py-1.5 rounded-[100px] bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.2)] text-[11px] font-bold tracking-[0.08em] uppercase text-red-600">
                                {profile.role}
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 rounded-[100px] bg-[rgba(200,134,42,0.2)] border border-[rgba(200,134,42,0.3)] text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--amber-light)]">
                                {profile.role}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                {!isEditing ? (
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-7">
                            <h3 className="font-['Playfair_Display',_serif] text-base font-semibold text-[var(--obsidian)]">
                                Account Details
                            </h3>
                            <button
                                onClick={() => { setFormData(profile); setIsEditing(true); }}
                                className="btn-secondary flex items-center gap-1.5 text-xs py-[7px] px-4"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit Profile
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-7">
                            {[
                                { label: 'First Name', value: profile.first_name },
                                { label: 'Middle Name', value: profile.middle_name || '—' },
                                { label: 'Last Name', value: profile.last_name },
                                { label: 'Department', value: profile.department, span: 2 },
                                { label: 'Phone', value: profile.phone },
                                { label: 'College Roll', value: profile.college_roll, mono: true },
                                { label: 'Email Address', value: profile.email, span: 2 },
                            ].map((field, i) => (
                                <div key={i} className={field.span ? `col-span-${field.span}` : 'col-span-1'}>
                                    <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-1.5">
                                        {field.label}
                                    </p>
                                    <p className={`text-sm text-[var(--obsidian)] font-normal ${field.mono ? 'font-mono' : ''}`}>
                                        {field.value || '—'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="p-8">
                        <div className="mb-7">
                            <h3 className="font-['Playfair_Display',_serif] text-base font-semibold text-[var(--obsidian)] mb-5">
                                Edit Profile
                            </h3>

                            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--amber)] mb-3.5">
                                Personal
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <InputRow label="First Name">
                                    <input required type="text" value={formData.first_name}
                                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                        className="foundry-input" />
                                </InputRow>
                                <InputRow label="Middle Name">
                                    <input type="text" value={formData.middle_name}
                                        onChange={e => setFormData({ ...formData, middle_name: e.target.value })}
                                        className="foundry-input" />
                                </InputRow>
                                <InputRow label="Last Name">
                                    <input required type="text" value={formData.last_name}
                                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                        className="foundry-input" />
                                </InputRow>
                            </div>

                            <div className="h-px bg-[var(--cream-border)] my-5" />

                            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--amber)] mb-3.5">
                                Contact & Academic
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <InputRow label="Phone">
                                    <input required type="tel" value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="foundry-input" />
                                </InputRow>
                                <InputRow label="Email Address">
                                    <input type="email" disabled value={formData.email} className="foundry-input" />
                                </InputRow>
                                <InputRow label="College Roll">
                                    <input required type="text" value={formData.college_roll}
                                        onChange={e => setFormData({ ...formData, college_roll: e.target.value })}
                                        className="foundry-input font-mono font-medium" />
                                </InputRow>
                                <InputRow label="Department">
                                    <input required type="text" value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        className="foundry-input" />
                                </InputRow>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2.5 pt-5 border-t border-[var(--cream-border)]">
                            <button type="button" onClick={() => setIsEditing(false)} disabled={saving} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="btn-primary min-w-[120px]">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}