import { type Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./config";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Layout & Pages
import DashboardLayout from "./layout/DashboardLayout";
import Leaderboard from "./pages/Leaderboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Overview from "./pages/Overview";

export const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--cream)',
        flexDirection: 'column', gap: '16px',
      }}>
        <div style={{
          width: '36px', height: '36px',
          border: '2px solid var(--cream-border)',
          borderTopColor: 'var(--amber)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13.5px',
            background: 'var(--obsidian)',
            color: 'var(--cream)',
            borderRadius: '10px',
            padding: '12px 18px',
            boxShadow: '0 8px 24px rgba(26,23,20,0.2)',
          },
          success: {
            iconTheme: { primary: 'var(--amber)', secondary: 'var(--obsidian)' },
          },
        }}
        containerStyle={{ padding: "20px" }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!session ? <Register /> : <Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={session ? <DashboardLayout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<Overview />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="projects" element={<Projects />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </Router>
    </>
  );
};