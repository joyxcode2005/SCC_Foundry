import { type Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { supabase } from "./config"
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";


export const App = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the initial session state on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    });

    // Set up a listener for auth state changes(for user login or logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

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
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!session ? <Register /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={session ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to={session ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
};

