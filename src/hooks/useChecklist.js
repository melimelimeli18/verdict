import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { checklistPhases } from "../data/checklist.js";

export function useChecklist(enabled = true) {
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadProgress() {
    if (!enabled) {
      setCompletedIds([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("checklist_progress")
        .select("completed_item_ids")
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = no rows, which is fine for new users
        throw fetchError;
      }

      setCompletedIds(data?.completed_item_ids ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function persist(nextIds) {
    if (!enabled) return;

    const previousIds = completedIds;
    setCompletedIds(nextIds);
    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: upsertError } = await supabase
        .from("checklist_progress")
        .upsert(
          {
            user_id: user.id,
            completed_item_ids: nextIds,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

      if (upsertError) throw upsertError;
    } catch (err) {
      setCompletedIds(previousIds);
      setError(err.message);
    }
  }

  function toggleItem(itemId) {
    if (!enabled) return;

    const nextIds = completedIds.includes(itemId)
      ? completedIds.filter((id) => id !== itemId)
      : [...completedIds, itemId];
    persist(nextIds);
  }

  async function reset() {
    if (!enabled) return;

    const previousIds = completedIds;
    setCompletedIds([]);
    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: deleteError } = await supabase
        .from("checklist_progress")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setCompletedIds(previousIds);
      setError(err.message);
    }
  }

  useEffect(() => {
    loadProgress();
  }, [enabled]);

  const progress = useMemo(() => {
    const total = checklistPhases.reduce(
      (sum, phase) => sum + phase.items.length,
      0,
    );
    const done = completedIds.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [completedIds]);

  return {
    phases: checklistPhases,
    completedIds,
    progress,
    loading,
    error,
    toggleItem,
    reset,
  };
}
