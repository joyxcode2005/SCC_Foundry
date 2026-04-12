import { Link, useLocation } from "react-router-dom";

type VerifyEmailLocationState = {
  email?: string;
};

export default function VerifyEmail() {
  const location = useLocation();
  const state = (location.state as VerifyEmailLocationState | null) ?? null;
  const email = state?.email;

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-8">
      <div className="w-full max-w-[520px] bg-white rounded-2xl border border-[var(--cream-border)] text-center shadow-md p-10">
        <div className="w-[56px] h-[56px] bg-[#EEF7F0] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D7A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-['Playfair_Display',_serif] text-[30px] font-bold text-[var(--obsidian)] tracking-[-0.02em] mb-2">
          Verify Your Email
        </h1>

        <p className="text-sm text-[var(--text-muted)] leading-[1.7] mb-6">
          Your account has been created. Please check your inbox and click the verification link before signing in.
        </p>

        {email && (
          <p className="text-[13px] text-[var(--obsidian)] mb-6">
            Verification email sent to: <span className="font-semibold">{email}</span>
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <Link to="/login" className="btn-primary no-underline">
            Go to Sign In
          </Link>
          <Link to="/register" className="btn-secondary no-underline">
            Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
}
