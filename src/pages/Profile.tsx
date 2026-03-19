import { useState, useEffect } from 'react';
import { supabase } from '../config';

interface UserProfile {
  first_name: string; middle_name: string; last_name: string;
  phone: string; college_roll: string; department: string;
  role: string; email: string;
}

const InputRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label style={{
      display: 'block', fontSize: '11px', fontWeight: '600',
      letterSpacing: '0.05em', textTransform: 'uppercase',
      color: 'var(--text-muted)', marginBottom: '6px',
    }}>
      {label}
    </label>
    {children}
  </div>
);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', border: '2px solid var(--cream-border)',
            borderTopColor: 'var(--amber)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading profile...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="animate-fade-up" style={{ maxWidth: '700px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ width: '28px', height: '2px', background: 'var(--amber)', borderRadius: '1px', marginBottom: '12px' }} />
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '36px', fontWeight: '700', color: 'var(--obsidian)',
          letterSpacing: '-0.02em', marginBottom: '6px',
        }}>
          Profile
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Manage your personal and academic information.
        </p>
      </div>

      {/* Success/Error */}
      {message.text && (
        <div style={{
          padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
          fontSize: '13.5px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px',
          background: message.type === 'success' ? '#EEF7F0' : '#FEF2F2',
          border: `1px solid ${message.type === 'success' ? 'rgba(45,122,74,0.2)' : '#FECACA'}`,
          color: message.type === 'success' ? '#2D7A4A' : '#B04040',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {message.type === 'success'
              ? <path d="M20 6L9 17l-5-5"/>
              : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
            }
          </svg>
          {message.text}
        </div>
      )}

      <div className="foundry-card" style={{ overflow: 'hidden' }}>
        {/* Profile banner */}
        <div style={{
          background: 'var(--obsidian)', padding: '32px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Background grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(250,248,243,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(250,248,243,0.03) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', right: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            border: '1px solid rgba(200,134,42,0.15)',
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--amber)', border: '3px solid rgba(200,134,42,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px', fontWeight: '700', color: 'white',
              flexShrink: 0,
            }}>
              {initials}
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px', fontWeight: '700', color: 'var(--cream)',
                letterSpacing: '-0.01em', marginBottom: '4px',
              }}>
                {fullName || 'Your Name'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(250,248,243,0.5)', fontFamily: 'monospace' }}>
                  {profile.college_roll}
                </span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(250,248,243,0.2)' }} />
                <span style={{ fontSize: '13px', color: 'rgba(250,248,243,0.5)' }}>
                  {profile.department}
                </span>
              </div>
            </div>

            {/* Role badge */}
            <span style={{
              padding: '5px 12px', borderRadius: '100px',
              background: 'rgba(200,134,42,0.2)', border: '1px solid rgba(200,134,42,0.3)',
              fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--amber-light)',
            }}>
              {profile.role}
            </span>
          </div>
        </div>

        {/* Content */}
        {!isEditing ? (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '16px', fontWeight: '600', color: 'var(--obsidian)',
              }}>
                Account Details
              </h3>
              <button
                onClick={() => { setFormData(profile); setIsEditing(true); }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '7px 16px', gap: '6px', display: 'flex', alignItems: 'center' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Edit Profile
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '28px' }}>
              {[
                { label: 'First Name', value: profile.first_name },
                { label: 'Middle Name', value: profile.middle_name || '—' },
                { label: 'Last Name', value: profile.last_name },
                { label: 'Email Address', value: profile.email, span: 2 },
                { label: 'Phone', value: profile.phone },
                { label: 'College Roll', value: profile.college_roll, mono: true },
                { label: 'Department', value: profile.department, span: 2 },
              ].map((field, i) => (
                <div key={i} style={{ gridColumn: (field as any).span ? `span ${(field as any).span}` : 'span 1' }}>
                  <p style={{
                    fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px',
                  }}>
                    {field.label}
                  </p>
                  <p style={{
                    fontSize: '14px', color: 'var(--obsidian)', fontWeight: '400',
                    fontFamily: (field as any).mono ? 'monospace' : 'inherit',
                  }}>
                    {field.value || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} style={{ padding: '32px' }}>
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '16px', fontWeight: '600', color: 'var(--obsidian)', marginBottom: '20px',
              }}>
                Edit Profile
              </h3>

              <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '14px' }}>
                Personal
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <InputRow label="First Name">
                  <input required type="text" value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                    className="foundry-input" />
                </InputRow>
                <InputRow label="Middle Name">
                  <input type="text" value={formData.middle_name}
                    onChange={e => setFormData({...formData, middle_name: e.target.value})}
                    className="foundry-input" />
                </InputRow>
                <InputRow label="Last Name">
                  <input required type="text" value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                    className="foundry-input" />
                </InputRow>
              </div>

              <div style={{ height: '1px', background: 'var(--cream-border)', margin: '20px 0' }} />

              <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '14px' }}>
                Contact & Academic
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <InputRow label="Phone">
                  <input required type="tel" value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="foundry-input" />
                </InputRow>
                <InputRow label="Email Address">
                  <input type="email" disabled value={formData.email} className="foundry-input" />
                </InputRow>
                <InputRow label="College Roll">
                  <input required type="text" value={formData.college_roll}
                    onChange={e => setFormData({...formData, college_roll: e.target.value})}
                    className="foundry-input" style={{ fontFamily: 'monospace', fontWeight: '500' }} />
                </InputRow>
                <InputRow label="Department">
                  <input required type="text" value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="foundry-input" />
                </InputRow>
              </div>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: '10px',
              paddingTop: '20px', borderTop: '1px solid var(--cream-border)',
            }}>
              <button type="button" onClick={() => setIsEditing(false)} disabled={saving} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary" style={{ minWidth: '120px' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}