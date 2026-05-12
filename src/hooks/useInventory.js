import { useState } from "react";
import { supabase } from "../lib/supabase.js";

export function useInventory(enabled = true) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function list() {
    if (!enabled) return [];

    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("stok_log")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      return data ?? [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  }

  async function add(payload) {
    if (!enabled) return false;

    setSaving(true);
    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase.from("stok_log").insert({
        user_id: user.id,
        product_name: payload.product_name,
        category: payload.category,
        type: payload.type,
        qty_change: payload.qty_change,
        reason: payload.reason,
        note: payload.note ?? null,
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

  return { saving, error, list, add };
}
