import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    toast.success("Password updated successfully.");
    setDone(true);
    setSaving(false);

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-8">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[var(--cream-border)] shadow-md p-8">
        <h1 className="font-['Playfair_Display',_serif] text-3xl font-bold text-[var(--obsidian)] mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Set a new password for your account.
        </p>

        {error && (
          <div className="py-3 px-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[10px] mb-5 text-[13.5px] text-[#B04040]">
            {error}
          </div>
        )}

        {done ? (
          <div className="text-sm text-[#2D7A4A] bg-[#EEF7F0] border border-[rgba(45,122,74,0.2)] rounded-[10px] p-3">
            Password changed. Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-[0.03em]">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="foundry-input"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-[0.03em]">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="foundry-input"
                placeholder="Re-enter password"
              />
            </div>

            <button type="submit" disabled={saving} className="btn-primary h-11 mt-2">
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-[13px] text-[var(--text-muted)] text-center">
          <Link to="/login" className="text-[var(--obsidian)] font-semibold no-underline border-b border-[var(--obsidian)] pb-[1px]">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
