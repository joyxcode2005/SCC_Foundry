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
    <div className="min-h-screen flex bg-[var(--cream)]">
      {/* Left Panel - Decorative */}
      <div className="w-[42%] bg-[var(--obsidian)] flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Background grid pattern */}
        <div 
          className="absolute inset-0 bg-[length:40px_40px]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(250,248,243,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250,248,243,0.04) 1px, transparent 1px)
            `,
          }} 
        />

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-[320px] h-[320px] rounded-full border border-[rgba(200,134,42,0.2)]" />
        <div className="absolute -bottom-[120px] -right-[120px] w-[480px] h-[480px] rounded-full border border-[rgba(200,134,42,0.1)]" />
        <div className="absolute top-[30%] -left-10 w-[160px] h-[160px] rounded-full bg-[rgba(200,134,42,0.06)]" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--amber)] rounded-md flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span className="font-['Playfair_Display',_serif] text-[20px] font-bold text-[var(--cream)] tracking-[-0.02em]">
              Foundry
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="w-7 h-[2px] bg-[var(--amber)] mb-6 rounded-[1px]" />
          <h2 className="font-['Playfair_Display',_serif] text-[42px] font-medium text-[var(--cream)] leading-[1.2] tracking-[-0.02em] mb-4">
            Build your<br />
            <em className="italic text-[var(--amber-light)]">future</em><br />
            here.
          </h2>
          <p className="text-sm text-[#faf8f3]/50 leading-[1.7] max-w-[260px]">
            Your academic journey, organised. Track progress, collaborate on projects, and rise to the top.
          </p>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-l-2 border-[var(--amber)] pl-4">
          <p className="text-xs text-[#faf8f3]/40 leading-[1.6] italic">
            "Excellence is not a destination but a continuous journey."
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-scale-in w-full max-w-[380px]">
          <div className="mb-10">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--amber)] mb-2.5">
              Welcome back
            </p>
            <h1 className="font-['Playfair_Display',_serif] text-[32px] font-bold text-[var(--obsidian)] tracking-[-0.02em] leading-[1.2]">
              Sign in to your account
            </h1>
          </div>

          {error && (
            <div className="py-3 px-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[10px] mb-5 text-[13.5px] text-[#B04040] flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-[18px]">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-[0.03em]">
                College Roll
              </label>
              <input
                type="text"
                required
                value={collegeRoll}
                onChange={(e) => setCollegeRoll(e.target.value.toUpperCase())}
                className="foundry-input uppercase tracking-[0.05em] font-medium"
                placeholder="e.g. 21CS01"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-[0.03em]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="foundry-input pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-secondary)] flex p-0.5 transition-colors duration-150"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 h-11 text-sm flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-7 text-[13px] text-[var(--text-muted)] text-center">
            New to Foundry?{' '}
            <Link to="/register" className="text-[var(--obsidian)] font-semibold no-underline border-b border-[var(--obsidian)] pb-[1px]">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}