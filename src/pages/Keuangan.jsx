import { useState } from "react";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { StatCard } from "../components/ui/StatCard.jsx";
import { formatRp, formatRpFull, formatDate } from "../utils/formatters.js";

const INITIAL_FORM = {
  type: "expense",
  category: "",
  note: "",
  amount: "",
  transaction_date: "",
};

export function KeuanganPage({ auth, transactions }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const summary = transactions.summary ?? {};
  const list = transactions.list ?? [];

  const healthRatio =
    summary.totalIncome > 0
      ? Math.round(
          ((summary.totalIncome - summary.totalExpense) / summary.totalIncome) *
            100,
        )
      : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.transaction_date) return;
    await transactions.add({
      type: form.type,
      category: form.category || "lainnya",
      note: form.note || "",
      amount: Number(form.amount),
      transaction_date: form.transaction_date,
    });
    setForm(INITIAL_FORM);
  }

  async function handleDelete(id) {
    await transactions.remove(id);
  }

  return (
    <section className="content page">
      <PageIntro
        title="Keuangan"
        description="Catat pemasukan dan pengeluaran. Lihat ringkasan bulanan dan rasio kesehatan bisnis kamu."
      />

      {auth.user && (
        <form className="tx-form" onSubmit={handleSubmit}>
          <div className="tx-form-row">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
            <input
              placeholder="Kategori (misalnya Iklan, Bahan Baku)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              placeholder="Catatan"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
            <input
              placeholder="Jumlah (Rp)"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              type="date"
              value={form.transaction_date}
              onChange={(e) =>
                setForm({ ...form, transaction_date: e.target.value })
              }
            />
            <button
              className="btn-primary"
              disabled={transactions.saving}
              type="submit">
              {transactions.saving ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      )}

      {auth.user && (
        <div className="stats-row">
          <StatCard
            label="Total Masuk"
            value={formatRp(summary.totalIncome)}
            tone="positive"
          />
          <StatCard
            label="Total Keluar"
            value={formatRp(summary.totalExpense)}
            tone="negative"
          />
          <StatCard
            label="Rasio Kesehatan"
            value={healthRatio !== null ? `${healthRatio}%` : "N/A"}
            tone={
              healthRatio !== null && healthRatio >= 30
                ? "positive"
                : "negative"
            }
          />
        </div>
      )}

      {list.length === 0 && (
        <InfoBox title="Belum ada transaksi">
          <p>
            Mulai catat pemasukan dan pengeluaran kamu. Data ini akan membantumu
            menghitung profit margin dan ROAS dengan akurat.
          </p>
        </InfoBox>
      )}

      {list.map((tx) => (
        <div className="tx-card" key={tx.id}>
          <div className="tx-card-left">
            <span className={`tx-type-badge ${tx.type}`}>
              {tx.type === "income" ? "MASUK" : "KELUAR"}
            </span>
            <span className="tx-category">{tx.category}</span>
            {tx.note ? <span className="tx-note">{tx.note}</span> : null}
          </div>
          <div className="tx-card-right">
            <span className={`tx-amount ${tx.type}`}>
              {formatRpFull(tx.amount)}
            </span>
            <span className="tx-date">{formatDate(tx.transaction_date)}</span>
            <button
              className="tx-delete"
              onClick={() => handleDelete(tx.id)}
              type="button">
              Hapus
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
