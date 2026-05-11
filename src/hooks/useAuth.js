import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

function normalizeUser(rawUser) {
  if (!rawUser) return null;
  return {
    ...rawUser,
    name:
      rawUser.user_metadata?.full_name ||
      rawUser.user_metadata?.name ||
      rawUser.email,
  };
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message);
        }
        setUser(normalizeUser(session?.user));
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(normalizeUser(session?.user));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login() {
    setError("");
    const { error: loginError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { prompt: "select_account" },
      },
    });
    if (loginError) {
      setError(loginError.message);
    }
  }

  async function logout() {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) {
      setError(logoutError.message);
    }
    setUser(null);
  }

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };
}
