import React, { useState } from 'react';
import { supabase } from '../config';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [collegeRoll, setCollegeRoll] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: email, error: rpcError } = await supabase
      .rpc('get_email_by_roll', { roll_input: collegeRoll });

    if (rpcError || !email) {
      setError('Invalid college roll or password.');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid college roll or password.');
      setLoading(false);
      return;
    }

    toast.success('Welcome back.');
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--cream)',
    }}>
      {/* Left Panel - Decorative */}
      <div style={{
        width: '42%',
        background: 'var(--obsidian)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(250,248,243,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,248,243,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '1px solid rgba(200,134,42,0.2)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-120px',
          right: '-120px',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          border: '1px solid rgba(200,134,42,0.1)',
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'rgba(200,134,42,0.06)',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'var(--amber)',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: "700",
              color: "var(--cream)",
              letterSpacing: "-0.02em",
            }}>Foundry</span>
          </div>
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '28px',
            height: '2px',
            background: 'var(--amber)',
            marginBottom: '24px',
            borderRadius: '1px',
          }} />
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '42px',
            fontWeight: '500',
            color: 'var(--cream)',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}>
            Build your<br />
            <em style={{ fontStyle: 'italic', color: 'var(--amber-light)' }}>future</em><br />
            here.
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'rgba(250,248,243,0.5)',
            lineHeight: '1.7',
            maxWidth: '260px',
          }}>
            Your academic journey, organised. Track progress, collaborate on projects, and rise to the top.
          </p>
        </div>

        {/* Bottom quote */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          borderLeft: '2px solid var(--amber)',
          paddingLeft: '16px',
        }}>
          <p style={{
            fontSize: '12px',
            color: 'rgba(250,248,243,0.4)',
            lineHeight: '1.6',
            fontStyle: 'italic',
          }}>
            "Excellence is not a destination but a continuous journey."
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
      }}>
        <div className="animate-scale-in" style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '40px' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              marginBottom: '10px',
            }}>
              Welcome back
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              fontWeight: '700',
              color: 'var(--obsidian)',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}>
              Sign in to your account
            </h1>
          </div>

          {error && (
            <div style={{
              padding: '12px 14px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '13.5px',
              color: '#B04040',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                letterSpacing: '0.03em',
              }}>
                College Roll
              </label>
              <input
                type="text"
                required
                value={collegeRoll}
                onChange={(e) => setCollegeRoll(e.target.value.toUpperCase())}
                className="foundry-input"
                placeholder="e.g. 21CS01"
                style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                letterSpacing: '0.03em',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="foundry-input"
                  placeholder="••••••••"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    padding: '2px',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: '8px', height: '44px', fontSize: '14px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p style={{
            marginTop: '28px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}>
            New to Foundry?{' '}
            <Link to="/register" style={{
              color: 'var(--obsidian)',
              fontWeight: '600',
              textDecoration: 'none',
              borderBottom: '1px solid var(--obsidian)',
              paddingBottom: '1px',
            }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}