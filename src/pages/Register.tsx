import React, { useState } from "react";
import { supabase } from "../config";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "", middleName: "", lastName: "",
    phone: "", collegeRoll: "", department: "",
    email: "", password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          middle_name: formData.middleName || null,
          last_name: formData.lastName,
          phone: formData.phone,
          college_roll: formData.collegeRoll,
          department: formData.department,
        },
      },
    });

    

    if (authError) { setError(authError.toString()); setLoading(false); return; }
    if (!authData?.user) { setError('Registration failed. Please try again.'); setLoading(false); return; }

    setSuccess(true);
    setLoading(false);
  };



  return (
    <div className="min-h-screen bg-[var(--cream)] flex">
      {/* Thin left accent */}
      <div className="w-1 bg-gradient-to-b from-[var(--amber)] to-transparent shrink-0" />

      <div className="flex-1 flex items-start justify-center py-16 px-12">
        <div className="animate-scale-in w-full max-w-[600px]">
          {/* Header */}
          <div className="mb-12">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] no-underline mb-8 transition-colors duration-150 hover:text-[var(--obsidian)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to login
            </Link>

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-[30px] h-[30px] bg-[var(--obsidian)] rounded-md flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="var(--cream)" fillOpacity="0.9" />
                </svg>
              </div>
              <span className="font-['Playfair_Display',_serif] text-lg font-bold text-[var(--obsidian)] tracking-[-0.02em]">
                Foundry
              </span>
            </div>

            <div className="w-7 h-0.5 bg-[var(--amber)] rounded-[1px] mb-4" />
            <h1 className="font-['Playfair_Display',_serif] text-4xl font-bold text-[var(--obsidian)] tracking-[-0.02em] leading-[1.2] mb-2">
              Join Foundry
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-[1.6]">
              Create your student account to get started.
            </p>
          </div>

          {success ? (
            <div className="p-8 bg-white rounded-2xl border border-[var(--cream-border)] text-center shadow-md">
              <div className="w-[52px] h-[52px] bg-[#EEF7F0] rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D7A4A" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="font-['Playfair_Display',_serif] text-[22px] font-semibold text-[var(--obsidian)] mb-2.5">
                Account created!
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-[1.6] mb-6">
                Please check your email to verify your account before signing in.
              </p>
              <Link to="/login" className="btn-primary no-underline">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[var(--cream-border)] shadow-md overflow-hidden">
              {error && (
                <div className="py-3.5 px-6 bg-[#FEF2F2] border-b border-[#FECACA] text-[13.5px] text-[#B04040] flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="p-8">
                {/* Step sections */}
                <div className="mb-7">
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--amber)] mb-4">
                    Personal Information
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <InputField onChange={handleChange} label="First Name" name="firstName" required />
                    <InputField onChange={handleChange} label="Middle Name" name="middleName" />
                    <InputField onChange={handleChange} label="Last Name" name="lastName" required />
                  </div>
                </div>

                <div className="h-px bg-[var(--cream-border)] my-6" />

                <div className="mb-7">
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--amber)] mb-4">
                    Academic Details
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <InputField onChange={handleChange}
                      label="College Roll"
                      name="collegeRoll"
                      required
                      placeholder="21CS01"
                      customClass="uppercase tracking-[0.05em] font-medium"
                    />
                    <InputField onChange={handleChange} label="Department" name="department" required placeholder="Computer Science" />
                    <InputField onChange={handleChange} label="Phone" name="phone" type="tel" required />
                  </div>
                </div>

                <div className="h-px bg-[var(--cream-border)] my-6" />

                <div className="mb-8">
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--amber)] mb-4">
                    Account Credentials
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField onChange={handleChange} label="Email Address" name="email" type="email" required />
                    <InputField onChange={handleChange} label="Password" name="password" type="password" required />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[var(--text-muted)]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--obsidian)] font-semibold no-underline border-b border-[var(--obsidian)] pb-[1px]">
                      Sign in
                    </Link>
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary h-[42px] px-7"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}