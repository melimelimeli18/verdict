import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase.js";

export const incomeCategories = [
  "Penjualan Produk",
  "Refund Diterima",
  "Bonus / Insentif Platform",
  "Penjualan Affiliate",
  "Lainnya (Masuk)",
];

export const expenseCategories = [
  "Modal / Stok Produk",
  "Biaya Iklan",
  "Packaging & Packing",
  "Ongkir",
  "Fee Platform",
  "Gaji / Upah",
  "Operasional",
  "Lainnya (Keluar)",
];

export function useTransactions(enabled = true) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTransactions() {
    if (!enabled) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTransaction(payload) {
    if (!enabled) return false;

    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: insertError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: payload.type,
          category: payload.category,
          note: payload.note,
          amount: Number(payload.amount),
          transaction_date: payload.transactionDate,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTransactions((current) => [data, ...current]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function deleteTransaction(id) {
    if (!enabled) return;

    const previous = transactions;
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id),
    );
    setError("");
    try {
      const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setTransactions(previous);
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, [enabled]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const profit = income - expense;
    const adsExpense = transactions
      .filter((t) => t.type === "expense" && t.category === "Biaya Iklan")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const opsExpense = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          !["Biaya Iklan", "Modal / Stok Produk"].includes(t.category),
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      profit,
      margin: income ? Math.round((profit / income) * 100) : 0,
      adsRatio: income ? Math.round((adsExpense / income) * 100) : 0,
      opsRatio: income ? Math.round((opsExpense / income) * 100) : 0,
    };
  }, [transactions]);

  return {
    transactions,
    summary,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    reload: loadTransactions,
  };
}
