import { useState } from "react";
import { supabase } from "../lib/supabase.js";

export function useCalculators(enabled = true) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function listHpp() {
    if (!enabled) return [];

    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("hpp_calculations")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      return data ?? [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  }

  async function listRoas() {
    if (!enabled) return [];

    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("roas_calculations")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      return data ?? [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  }

  async function saveHpp(payload) {
    if (!enabled) return false;

    setSaving(true);
    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from("hpp_calculations")
        .insert({
          user_id: user.id,
          mode: payload.mode,
          inputs: payload.inputs,
          results: payload.results,
        });

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveRoas(payload) {
    if (!enabled) return false;

    setSaving(true);
    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from("roas_calculations")
        .insert({
          user_id: user.id,
          inputs: payload.inputs,
          results: payload.results,
        });

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  // Legacy function names for backward compatibility
  async function saveHppCalculation(mode, inputs, results) {
    return saveHpp({ mode, inputs, results });
  }

  async function saveRoasCalculation(inputs, results) {
    return saveRoas({ inputs, results });
  }

  return {
    saving,
    error,
    listHpp,
    listRoas,
    saveHpp,
    saveRoas,
    saveHppCalculation,
    saveRoasCalculation,
  };
}
