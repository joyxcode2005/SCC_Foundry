import React, { useState } from "react";
import { supabase } from "../config";
import { Link } from "react-router-dom";

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

    if (authError) { setError(authError.message); setLoading(false); return; }
    if (!authData?.user) { setError('Registration failed. Please try again.'); setLoading(false); return; }

    setSuccess(true);
    setLoading(false);
  };

  const InputField = ({ label, name, type = 'text', required = false, placeholder = '', style = {} }: any) => (
    <div>
      <label style={{
        display: 'block', fontSize: '12px', fontWeight: '600',
        color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.03em',
      }}>
        {label}{required && <span style={{ color: 'var(--amber)', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        type={type} name={name} required={required}
        placeholder={placeholder} onChange={handleChange}
        className="foundry-input" style={style}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex' }}>
      {/* Thin left accent */}
      <div style={{
        width: '4px', background: 'linear-gradient(to bottom, var(--amber), transparent)',
        flexShrink: 0,
      }} />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', padding: '64px 48px',
      }}>
        <div className="animate-scale-in" style={{ width: '100%', maxWidth: '600px' }}>
          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)',
              textDecoration: 'none', marginBottom: '32px',
              transition: 'color 0.15s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to login
            </Link>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
              <div style={{
                width: '30px', height: '30px', background: 'var(--obsidian)',
                borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="var(--cream)" fillOpacity="0.9"/>
                </svg>
              </div>
              <span style={{
                fontFamily: "'Playfair Display', serif", fontSize: "18px",
                fontWeight: "700", color: "var(--obsidian)", letterSpacing: "-0.02em",
              }}>Foundry</span>
            </div>

            <div style={{ width: '28px', height: '2px', background: 'var(--amber)', borderRadius: '1px', marginBottom: '16px' }} />
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '36px', fontWeight: '700', color: 'var(--obsidian)',
              letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '8px',
            }}>
              Join Foundry
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Create your student account to get started.
            </p>
          </div>

          {success ? (
            <div style={{
              padding: '32px', background: 'white', borderRadius: '16px',
              border: '1px solid var(--cream-border)', textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{
                width: '52px', height: '52px', background: '#EEF7F0',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 20px',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D7A4A" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif", fontSize: '22px',
                fontWeight: '600', color: 'var(--obsidian)', marginBottom: '10px',
              }}>
                Account created!
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                Please check your email to verify your account before signing in.
              </p>
              <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
                Go to Sign In
              </Link>
            </div>
          ) : (
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid var(--cream-border)',
              boxShadow: 'var(--shadow-md)', overflow: 'hidden',
            }}>
              {error && (
                <div style={{
                  padding: '14px 24px', background: '#FEF2F2',
                  borderBottom: '1px solid #FECACA',
                  fontSize: '13.5px', color: '#B04040',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} style={{ padding: '32px' }}>
                {/* Step sections */}
                <div style={{ marginBottom: '28px' }}>
                  <p style={{
                    fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px',
                  }}>
                    Personal Information
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <InputField label="First Name" name="firstName" required />
                    <InputField label="Middle Name" name="middleName" />
                    <InputField label="Last Name" name="lastName" required />
                  </div>
                </div>

                <div style={{ height: '1px', background: 'var(--cream-border)', margin: '24px 0' }} />

                <div style={{ marginBottom: '28px' }}>
                  <p style={{
                    fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px',
                  }}>
                    Academic Details
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <InputField label="College Roll" name="collegeRoll" required placeholder="21CS01"
                      style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }} />
                    <InputField label="Department" name="department" required placeholder="Computer Science" />
                    <InputField label="Phone" name="phone" type="tel" required />
                  </div>
                </div>

                <div style={{ height: '1px', background: 'var(--cream-border)', margin: '24px 0' }} />

                <div style={{ marginBottom: '32px' }}>
                  <p style={{
                    fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px',
                  }}>
                    Account Credentials
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <InputField label="Email Address" name="email" type="email" required />
                    <InputField label="Password" name="password" type="password" required />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                      color: 'var(--obsidian)', fontWeight: '600',
                      textDecoration: 'none', borderBottom: '1px solid var(--obsidian)', paddingBottom: '1px',
                    }}>
                      Sign in
                    </Link>
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ height: '42px', paddingLeft: '28px', paddingRight: '28px' }}
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