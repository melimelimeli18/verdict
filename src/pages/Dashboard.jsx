import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { allChecklistItems } from "../data/checklist.js";
import { formatRpFull } from "../utils/formatters.js";

function formatDashboardDate() {
  const now = new Date();
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

function aggregateStokFromLogs(logs) {
  const qtyByProduct = {};
  for (const row of logs) {
    const name = row.product_name;
    const delta =
      row.type === "masuk" ? Number(row.qty_change) : -Number(row.qty_change);
    qtyByProduct[name] = (qtyByProduct[name] ?? 0) + delta;
  }
  const entries = Object.entries(qtyByProduct).filter(([, q]) => q > 0);
  const totalProduk = entries.length;
  const totalItem = entries.reduce((s, [, q]) => s + q, 0);
  const threshold = 5;
  const kritis = entries.filter(([, q]) => q <= threshold).map(([n]) => n);
  return { totalProduk, totalItem, kritis };
}

export function DashboardPage({ auth, checklist, transactions, inventory }) {
  const [stokLogs, setStokLogs] = useState([]);

  useEffect(() => {
    if (!auth.user || !inventory?.list) {
      setStokLogs([]);
      return;
    }
    let cancelled = false;
    inventory.list().then((rows) => {
      if (!cancelled) setStokLogs(rows ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, [auth.user, inventory]);

  const summary = transactions?.summary ?? {};
  const masuk = summary.totalIncome ?? 0;
  const profit = summary.profit ?? masuk - (summary.totalExpense ?? 0);
  const margin = summary.margin ?? (masuk > 0 ? Math.round((profit / masuk) * 100) : 0);

  const doneIds = checklist?.items ?? [];
  const checklistTotal = allChecklistItems.length;
  const checklistDone = doneIds.length;
  const checklistPct = checklistTotal
    ? Math.round((checklistDone / checklistTotal) * 100)
    : 0;

  const stok = useMemo(() => aggregateStokFromLogs(stokLogs), [stokLogs]);

  const topKeluar = useMemo(() => {
    const list = transactions?.list ?? [];
    const byCat = {};
    for (const t of list) {
      if (t.type !== "expense") continue;
      const cat = t.category || "Lainnya";
      byCat[cat] = (byCat[cat] ?? 0) + Number(t.amount);
    }
    return Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [transactions?.list]);

  const greetingName = auth.user?.name?.trim() || "Verdict Dashboard";

  return (
    <div className="dash-page">
      <div className="dash-greeting">
        <div className="dash-greeting-eyebrow">SELAMAT DATANG</div>
        <div className="dash-greeting-title">{greetingName}</div>
        <div className="dash-greeting-date">{formatDashboardDate()}</div>
      </div>

      <div className="dash-section-label">RINGKASAN BISNIS</div>
      <div className="dash-metrics-grid">
        <Link className="keu-stat dash-stat-link" to="/keuangan">
          <div className="keu-stat-label">Total Pemasukan</div>
          <div className="keu-stat-val green">{formatRpFull(masuk)}</div>
          <div className="dash-stat-hint">→ Keuangan</div>
        </Link>
        <Link className="keu-stat dash-stat-link" to="/keuangan">
          <div className="keu-stat-label">Profit Bersih</div>
          <div
            className={`keu-stat-val ${profit >= 0 ? "green" : "red"}`}>
            {formatRpFull(profit)}
          </div>
          <div className="dash-stat-hint">→ Keuangan</div>
        </Link>
        <Link className="keu-stat dash-stat-link" to="/keuangan">
          <div className="keu-stat-label">Margin</div>
          <div
            className={`keu-stat-val ${margin >= 20 ? "green" : margin >= 10 ? "" : "red"}`}>
            {margin}%
          </div>
          <div className="dash-stat-hint">Target: ≥ 20%</div>
        </Link>
        <Link className="keu-stat dash-stat-link" to="/stok">
          <div className="keu-stat-label">Stok Kritis</div>
          <div className="keu-stat-val red">{stok.kritis.length}</div>
          <div className="dash-stat-hint">→ Stok</div>
        </Link>
      </div>

      <div className="dash-section-label">PROGRESS PANDUAN</div>
      <Link className="dash-card dash-card-click" to="/checklist">
        <div className="dash-card-head">
          <div className="dash-card-head-title">Checklist Setup Toko</div>
          <div className="dash-card-head-pct">{checklistPct}%</div>
        </div>
        <div className="dash-progress-track">
          <div
            className="dash-progress-fill"
            style={{ width: `${checklistPct}%` }}
          />
        </div>
        <div className="dash-progress-caption">
          {checklistDone} dari {checklistTotal} langkah selesai
        </div>
      </Link>

      <div className="dash-section-label">STATUS STOK</div>
      <Link className="dash-card dash-card-click" to="/stok">
        <div className="dash-stok-grid">
          <div>
            <div className="dash-stok-num">{stok.totalProduk}</div>
            <div className="dash-stok-cap">Total Produk</div>
          </div>
          <div>
            <div className="dash-stok-num">{stok.totalItem}</div>
            <div className="dash-stok-cap">Total Item</div>
          </div>
          <div>
            <div className="dash-stok-num">—</div>
            <div className="dash-stok-cap">Nilai Stok</div>
          </div>
        </div>
        {stok.kritis.length > 0 ? (
          <div className="dash-stok-alert">
            Perlu restock: {stok.kritis.join(", ")}
          </div>
        ) : null}
      </Link>

      <div className="dash-section-label">PENGELUARAN TERBESAR</div>
      <div className="dash-top-keluar">
        {topKeluar.length === 0 ? (
          <div className="dash-top-empty">
            {auth.user
              ? "Belum ada data pengeluaran."
              : "Belum ada data keuangan."}
          </div>
        ) : (
          topKeluar.map(([kat, val], i) => {
            const maxVal = topKeluar[0][1];
            const w = maxVal ? Math.round((val / maxVal) * 100) : 0;
            return (
              <div className="dash-top-row" key={`${kat}-${i}`}>
                <div className="dash-top-row-head">
                  <span className="dash-top-cat">{kat}</span>
                  <span className="dash-top-amt">{formatRpFull(val)}</span>
                </div>
                <div className="dash-top-bar-track">
                  <div className="dash-top-bar-fill" style={{ width: `${w}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="dash-section-label">AKSES CEPAT</div>
      <div className="dash-quick-grid">
        <Link className="dash-quick-btn" to="/keuangan">
          Catat Transaksi
          <span className="dash-quick-sub">Keuangan →</span>
        </Link>
        <Link className="dash-quick-btn" to="/stok">
          Update Stok
          <span className="dash-quick-sub">Stok →</span>
        </Link>
        <Link className="dash-quick-btn" to="/iklan">
          Hitung ROAS
          <span className="dash-quick-sub">Iklan →</span>
        </Link>
        <Link className="dash-quick-btn" to="/checklist">
          Lihat Panduan
          <span className="dash-quick-sub">Panduan →</span>
        </Link>
      </div>
    </div>
  );
}
