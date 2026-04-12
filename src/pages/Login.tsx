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
  const [sendingReset, setSendingReset] = useState(false);

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

  const handleForgotPassword = async () => {
    setError('');

    const roll = collegeRoll.trim().toUpperCase();
    if (!roll) {
      setError('Enter your college roll first to reset password.');
      return;
    }

    setSendingReset(true);

    const { data: email, error: rpcError } = await supabase
      .rpc('get_email_by_roll', { roll_input: roll });

    if (rpcError || !email) {
      setError('Could not find an account for this college roll.');
      setSendingReset(false);
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setSendingReset(false);
      return;
    }

    toast.success('Password reset link sent to your email.');
    setSendingReset(false);
  };

  return (
    <div className="min-h-screen flex bg-[var(--cream)]">


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
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] tracking-[0.03em]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={sendingReset}
                  className="cursor-pointer border-none bg-transparent p-0 text-xs text-[var(--obsidian)] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendingReset ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>
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
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
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