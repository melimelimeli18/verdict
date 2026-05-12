import { useMemo, useState } from "react";
import {
  expenseCategories,
  incomeCategories,
} from "../hooks/useTransactions.js";
import { formatRpFull, formatDate } from "../utils/formatters.js";

const INITIAL_FORM = {
  type: "income",
  category: "",
  note: "",
  amount: "",
  transaction_date: "",
};

export function KeuanganPage({ auth, transactions }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [listFilter, setListFilter] = useState("semua");

  const summary = transactions.summary ?? {};
  const list = transactions.list ?? [];

  const filteredList = useMemo(() => {
    if (listFilter === "masuk") return list.filter((t) => t.type === "income");
    if (listFilter === "keluar")
      return list.filter((t) => t.type === "expense");
    return list;
  }, [list, listFilter]);

  const categoryOptions =
    form.type === "income" ? incomeCategories : expenseCategories;

  const totalMasuk = summary.totalIncome ?? 0;
  const totalKeluar = summary.totalExpense ?? 0;
  const profit = summary.profit ?? totalMasuk - totalKeluar;

  const barMasukPct =
    totalMasuk + totalKeluar > 0
      ? Math.round((totalMasuk / (totalMasuk + totalKeluar)) * 100)
      : 0;
  const barKeluarPct =
    totalMasuk + totalKeluar > 0
      ? Math.round((totalKeluar / (totalMasuk + totalKeluar)) * 100)
      : 0;

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
    setForm((f) => ({ ...INITIAL_FORM, type: f.type }));
  }

  async function handleDelete(id) {
    await transactions.remove(id);
  }

  return (
    <section className="keu-section page">
      <div className="section-title">Pencatatan Keuangan Bisnis</div>
      <div className="section-desc">
        Catat setiap pemasukan & pengeluaran bisnis kamu. Data ini yang akan
        kasih tahu apakah bisnis kamu sehat — bukan feeling kamu.
      </div>

      <div className="keu-summary">
        <div className="keu-stat">
          <div className="keu-stat-label">Total Masuk</div>
          <div className="keu-stat-val green">{formatRpFull(totalMasuk)}</div>
        </div>
        <div className="keu-stat">
          <div className="keu-stat-label">Total Keluar</div>
          <div className="keu-stat-val red">{formatRpFull(totalKeluar)}</div>
        </div>
        <div className="keu-stat full">
          <div className="keu-stat-label">Profit Bersih Bulan Ini</div>
          <div className="keu-stat-val">{formatRpFull(profit)}</div>
        </div>
      </div>

      {auth.user && (totalMasuk > 0 || totalKeluar > 0) ? (
        <div className="keu-chart">
          <div className="keu-chart-title">Distribusi (semua data)</div>
          <div className="bar-row">
            <div className="bar-label-row">
              <span>Pemasukan</span>
              <span>{formatRpFull(totalMasuk)}</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill bar-masuk"
                style={{ width: `${barMasukPct}%` }}
              />
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label-row">
              <span>Pengeluaran</span>
              <span>{formatRpFull(totalKeluar)}</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill bar-keluar"
                style={{ width: `${barKeluarPct}%` }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {auth.user ? (
        <form className="keu-form" onSubmit={handleSubmit}>
          <div className="keu-form-header">+ Catat Transaksi</div>
          <div className="keu-form-body">
            <div className="keu-type-btn">
              <button
                type="button"
                className={`type-btn ${form.type === "income" ? "active-masuk" : ""}`}
                onClick={() =>
                  setForm((f) => ({ ...f, type: "income", category: "" }))
                }>
                Pemasukan
              </button>
              <button
                type="button"
                className={`type-btn ${form.type === "expense" ? "active-keluar" : ""}`}
                onClick={() =>
                  setForm((f) => ({ ...f, type: "expense", category: "" }))
                }>
                Pengeluaran
              </button>
            </div>
            <div className="keu-row">
              <select
                className="keu-select"
                required
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }>
                <option value="">Pilih Kategori…</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="keu-row">
              <input
                className="keu-input wide"
                placeholder="Keterangan singkat…"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <div className="keu-row">
              <input
                className="keu-input"
                placeholder="Nominal (Rp)"
                type="number"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <input
                className="keu-input"
                type="date"
                value={form.transaction_date}
                onChange={(e) =>
                  setForm({ ...form, transaction_date: e.target.value })
                }
              />
            </div>
            <button
              className="keu-add-btn"
              disabled={transactions.saving}
              type="submit">
              {transactions.saving ? "Menyimpan…" : "+ Tambah Catatan"}
            </button>
          </div>
        </form>
      ) : (
        <div className="keu-form">
          <div className="keu-form-body">
            <p className="keu-login-hint">
              Login dengan Google untuk menyimpan transaksi ke akun kamu.
            </p>
          </div>
        </div>
      )}

      <div className="keu-list">
        <div className="keu-list-header">
          <div className="keu-list-title">Riwayat Transaksi</div>
          <div className="keu-filter">
            <button
              type="button"
              className={`keu-filter-btn ${listFilter === "semua" ? "active" : ""}`}
              onClick={() => setListFilter("semua")}>
              Semua
            </button>
            <button
              type="button"
              className={`keu-filter-btn ${listFilter === "masuk" ? "active" : ""}`}
              onClick={() => setListFilter("masuk")}>
              Masuk
            </button>
            <button
              type="button"
              className={`keu-filter-btn ${listFilter === "keluar" ? "active" : ""}`}
              onClick={() => setListFilter("keluar")}>
              Keluar
            </button>
          </div>
        </div>
        <div>
          {filteredList.length === 0 ? (
            <div className="keu-empty">
              Belum ada catatan.
              <br />
              Mulai catat transaksi pertama bisnis kamu 👆
            </div>
          ) : (
            filteredList.map((tx) => {
              const masukRow = tx.type === "income";
              return (
                <div className="keu-entry" key={tx.id}>
                  <div
                    className={`keu-entry-dot ${masukRow ? "dot-masuk" : "dot-keluar"}`}
                  />
                  <div className="keu-entry-body">
                    <div className="keu-entry-cat">{tx.category}</div>
                    <div className="keu-entry-note">
                      {tx.note || "—"}{" "}
                    </div>
                    <div className="keu-entry-date">
                      {formatDate(tx.transaction_date)}
                    </div>
                  </div>
                  <div
                    className={`keu-entry-amount ${masukRow ? "amount-masuk" : "amount-keluar"}`}>
                    {formatRpFull(tx.amount)}
                  </div>
                  {auth.user ? (
                    <button
                      type="button"
                      className="keu-delete"
                      onClick={() => handleDelete(tx.id)}
                      aria-label="Hapus">
                      ×
                    </button>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
