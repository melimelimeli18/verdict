import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase.js";

const LOCAL_KEY = "verdict_checklist_v1";

function getLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

export function useChecklist(auth) {
  const queryClient = useQueryClient();
  const session = auth?.session;

  const { data: items = [] } = useQuery({
    queryKey: ["checklist-items"],
    queryFn: async () => {
      if (session) {
        const supabase = await supabase();
        const { data: items, error } = await supabase
          .from("checklist_items")
          .select("*");
        if (error) throw error;
        return items.map((item) => item.item_id);
      }
      const local = getLocal();
      return local.completed || [];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (itemId) => {
      const isCompleted = items.includes(itemId);
      if (session) {
        const supabase = await supabase();
        if (isCompleted) {
          const { error: deleteError } = await supabase
            .from("checklist_items")
            .delete()
            .eq("item_id", itemId);
          if (deleteError) throw deleteError;
        } else {
          const { error: insertError } = await supabase
            .from("checklist_items")
            .insert({ item_id: itemId });
          if (insertError) throw insertError;
        }
      } else {
        const local = getLocal();
        const completed = local.completed || [];
        if (isCompleted) {
          local.completed = completed.filter((id) => id !== itemId);
        } else {
          local.completed = [...completed, itemId];
        }
        saveLocal(local);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] });
    },
  });

  const toggle = (itemId) => toggleMutation.mutate(itemId);

  const resetAllMutation = useMutation({
    mutationFn: async () => {
      if (session) {
        const supabase = await supabase();
        const { error } = await supabase
          .from("checklist_items")
          .delete()
          .neq("item_id", "_never_");
        if (error) throw error;
      } else {
        saveLocal({ completed: [] });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] });
    },
  });

  const resetAll = () => {
    return resetAllMutation.mutateAsync();
  };

  const isDone = (itemId) => items.includes(itemId);

  return {
    items,
    toggle,
    isDone,
    resetAll,
    isLoading: false,
  };
}
