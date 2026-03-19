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



export const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial session state on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Set up a listener for auth state changes (for user login or logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Show a loading state while checking the session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-center"
        containerStyle={{ padding: "64px", textSizeAdjust: "100%" }}
      />
      <Router>
        <Routes>
          {/* Public / Auth Routes */}
          <Route
            path="/login"
            element={!session ? <Login /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!session ? <Register /> : <Navigate to="/dashboard" replace />}
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={session ? <DashboardLayout /> : <Navigate to="/login" replace />}
          >
            {/* Default view when navigating to /dashboard */}
            <Route index element={
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
                <p className="mt-2 text-gray-600">Welcome to your student portal.</p>
              </div>
            } />

            {/* Nested Sub-pages */}
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="projects" element={<Projects />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={<Navigate to={session ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </Router>
    </>
  );
};