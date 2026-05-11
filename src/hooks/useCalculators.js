import { useState } from "react";
import { supabase } from "../lib/supabase.js";

export function useCalculators(enabled = true) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveHppCalculation(mode, inputs, results) {
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
          mode,
          inputs,
          results,
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

  async function saveRoasCalculation(inputs, results) {
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
          inputs,
          results,
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

  return {
    saving,
    error,
    saveHppCalculation,
    saveRoasCalculation,
  };
}
