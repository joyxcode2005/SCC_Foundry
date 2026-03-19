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
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/leaderboard",
    label: "Leaderboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/tasks",
    label: "Tasks",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/projects",
    label: "Projects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    toast.success("See you soon.");
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        height: "100vh",
        background: "white",
        borderRight: "1px solid var(--cream-border)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 20px",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "40px", paddingLeft: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Geometric logo mark */}
          <div style={{ position: "relative", width: "28px", height: "28px" }}>
            <div style={{
              width: "28px", height: "28px",
              background: "var(--obsidian)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="var(--cream)" fillOpacity="0.9"/>
              </svg>
            </div>
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--obsidian)",
            letterSpacing: "-0.02em",
          }}>
            Foundry
          </span>
        </div>
        <div style={{
          marginTop: "6px",
          marginLeft: "38px",
          fontSize: "10px",
          fontWeight: "500",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}>
          Student Portal
        </div>
      </div>

      {/* Section Label */}
      <div style={{
        fontSize: "10px",
        fontWeight: "600",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        paddingLeft: "8px",
        marginBottom: "10px",
      }}>
        Navigation
      </div>

      {/* Nav Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 10px",
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: isActive ? "600" : "400",
              color: isActive ? "var(--obsidian)" : "var(--text-secondary)",
              background: isActive ? "var(--cream)" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s",
              position: "relative",
            })}
            className="sidebar-nav-link"
          >
            {({ isActive }) => (
              <>
                <span style={{
                  color: isActive ? "var(--amber)" : "var(--text-muted)",
                  transition: "color 0.15s",
                  display: "flex",
                }}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span style={{
                    marginLeft: "auto",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "var(--amber)",
                    flexShrink: 0,
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div style={{
        height: "1px",
        background: "var(--cream-border)",
        margin: "20px 0",
      }} />

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "9px 10px",
          borderRadius: "10px",
          fontSize: "13.5px",
          fontWeight: "400",
          color: "#B04040",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s",
          width: "100%",
          textAlign: "left",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        {loggingOut ? "Signing out..." : "Sign Out"}
      </button>
    </aside>
  );
}