import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../config";
import toast from "react-hot-toast";
import { useState } from "react";

const navItems = [
  {
    to: "/dashboard",
    end: true,
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: "/dashboard/leaderboard",
    label: "Leaderboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    to: "/dashboard/projects",
    label: "Projects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast.success("See you soon.");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[240px] min-w-[240px] flex-col border-r border-[var(--cream-border)] bg-white px-5 py-8">

      {/* Logo */}
      <div className="mb-10 pl-2">
        <div className="flex items-center gap-[10px]">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-[var(--obsidian)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="var(--cream)" fillOpacity="0.9" />
            </svg>
          </div>
          <span className="font-serif text-[18px] font-bold tracking-tight text-[var(--obsidian)]">
            Foundry
          </span>
        </div>
        <div className="ml-[38px] mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Student Portal
        </div>
      </div>

      {/* Section Label */}
      <div className="mb-2.5 pl-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        Navigation
      </div>

      {/* Nav Links */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] text-[13.5px] transition-all duration-150 no-underline
              ${isActive
                ? "bg-[var(--cream)] font-semibold text-[var(--obsidian)]"
                : "font-normal text-[var(--text-secondary)] hover:bg-gray-50"}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex transition-colors duration-150 ${isActive ? "text-[var(--amber)]" : "text-[var(--text-muted)]"}`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1 w-1 shrink-0 rounded-full bg-[var(--amber)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-5 h-px bg-[var(--cream-border)]" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex w-full items-center gap-2.5 rounded-[10px] border-none bg-transparent px-2.5 py-[9px] text-left text-[13.5px] font-normal text-[#B04040] transition-all duration-150 cursor-pointer hover:bg-[#FEF2F2] disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        {loggingOut ? "Signing out..." : "Sign Out"}
      </button>
    </aside>
  );
}