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
import TaskInterests from "./pages/TaskInterests";
import AssignedTasks from "./pages/AssignedTasks";
import SubmissionReviews from "./pages/SubmissionReviews";
import Landing from "./pages/Landing";

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--cream)]">
        <div className="h-9 w-9 animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-[var(--cream-border)] border-t-[var(--amber)]" />
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
          {/* Landing page route correctly placed inside <Routes>
          <Route path="/" element={!session ? <Landing /> : <Navigate to="/dashboard" replace />} /> */}
          
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
            <Route path="task-interests" element={<TaskInterests />} />
            <Route path="assigned-tasks" element={<AssignedTasks />} />
            <Route path="submission-reviews" element={<SubmissionReviews />} />
          </Route>

          {/* Catch-all route updated to handle the root path smoothly */}
          <Route path="*" element={<Navigate to={session ? "/dashboard" : "/"} replace />} />
        </Routes>
      </Router>
    </>
  );
};