import { useState, useEffect } from "react";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { formatRpFull, formatDate } from "../utils/formatters.js";
import {
  AD_METRICS,
  DECISION_TREE,
  AD_CHECKLIST_ITEMS,
} from "../data/iklan.js";

const INITIAL_ROAS_FORM = {
  productName: "",
  adSpend: "",
  revenue: "",
  orderCount: "",
};

export function IklanPage({ auth, calculators }) {
  // ROAS Calculator State
  const [roasForm, setRoasForm] = useState(INITIAL_ROAS_FORM);
  const [roasResult, setRoasResult] = useState(null);
  const [roasHistory, setRoasHistory] = useState([]);

  // Ad Checklist State (client-side only — matches view.html prototype)
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (auth.user && calculators) {
      calculators.listRoas().then(setRoasHistory);
    } else {
      setRoasHistory([]);
    }
  }, [auth.user, calculators]);

  function handleRoasChange(e) {
    setRoasForm({ ...roasForm, [e.target.name]: e.target.value });
  }

  function calculateRoas() {
    const adSpend = Number(roasForm.adSpend) || 0;
    const revenue = Number(roasForm.revenue) || 0;
    const orderCount = Number(roasForm.orderCount) || 0;
    const roas = adSpend > 0 ? Number((revenue / adSpend).toFixed(1)) : 0;
    const cpa = orderCount > 0 ? Math.round(adSpend / orderCount) : 0;
    const profit = revenue - adSpend;
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
    setRoasResult({ roas, cpa, profit, margin });
  }

  async function handleSaveRoas() {
    if (!auth.user || !calculators || !roasResult) return;
    await calculators.saveRoas({ inputs: roasForm, results: roasResult });
    const updated = await calculators.listRoas();
    setRoasHistory(updated);
  }

  function toggleCheckItem(idx) {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const checklistTotal = AD_CHECKLIST_ITEMS.length;

  return (
    <section className="ad-section page">
      <div className="section-title">Panduan Evaluasi Iklan</div>
      <div className="section-desc">
        Sebelum bakar uang di iklan, kamu harus bisa baca angkanya. Ini metrik
        yang paling penting — dan kapan harus matiin iklan yang ga worth it.
      </div>

      <div className="iklan-block">
        <h2 className="iklan-block-title">📊 Metrik Iklan yang Perlu Kamu Tahu</h2>
        <div className="ad-metrics-grid">
          {AD_METRICS.map((m) => (
            <div className="ad-metric-card" key={m.key}>
              <div className="ad-metric-header">
                <span className="ad-metric-key">{m.key}</span>
                <span className={`ad-metric-bench ${m.benchClass}`}>
                  {m.benchmark}
                </span>
              </div>
              <p className="ad-metric-name">{m.full}</p>
              <p className="ad-metric-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="iklan-block">
        <h2 className="iklan-block-title">🧭 Panduan Keputusan Iklan</h2>
        <p className="iklan-block-lead">
          Gunakan panduan ini setelah kamu punya data iklan minimal 3-7 hari.
        </p>
        {DECISION_TREE.map((d, i) => (
          <div className="ad-decision-card" key={i}>
            <div className="ad-decision-condition">{d.condition}</div>
            <div className="ad-decision-title">{d.title}</div>
            <p className="ad-decision-desc">{d.desc}</p>
          </div>
        ))}
      </div>

      <div className="iklan-block">
        <h2 className="iklan-block-title">🧮 Kalkulator ROAS</h2>
        <p className="iklan-block-lead">
          Hitung Return on Ad Spend dan Cost per Acquisition. Tahu angka pasti
          sebelum scale budget iklan.
        </p>

        <div className="calc-form">
          <input
            name="productName"
            placeholder="Nama Produk / Kampanye"
            value={roasForm.productName}
            onChange={handleRoasChange}
          />
          <input
            name="adSpend"
            placeholder="Total Biaya Iklan (Rp)"
            type="number"
            value={roasForm.adSpend}
            onChange={handleRoasChange}
          />
          <input
            name="revenue"
            placeholder="Total Pendapatan dari Iklan (Rp)"
            type="number"
            value={roasForm.revenue}
            onChange={handleRoasChange}
          />
          <input
            name="orderCount"
            placeholder="Jumlah Order"
            type="number"
            value={roasForm.orderCount}
            onChange={handleRoasChange}
          />
          <button className="btn-primary" onClick={calculateRoas} type="button">
            Hitung
          </button>
        </div>

        {roasResult && (
          <div className="calc-result">
            <h3>Hasil</h3>
            <div className="stats-row">
              <div className="stat-card">
                <span
                  className={`stat-number ${roasResult.roas >= 3 ? "positive" : "negative"}`}>
                  {roasResult.roas}x
                </span>
                <span className="stat-label">ROAS</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">
                  {formatRpFull(roasResult.cpa)}
                </span>
                <span className="stat-label">CPA (Biaya per Order)</span>
              </div>
              <div className="stat-card">
                <span
                  className={`stat-number ${roasResult.profit >= 0 ? "positive" : "negative"}`}>
                  {formatRpFull(roasResult.profit)}
                </span>
                <span className="stat-label">Profit</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{roasResult.margin}%</span>
                <span className="stat-label">Margin</span>
              </div>
            </div>
            {auth.user && (
              <button
                className="btn-primary"
                onClick={handleSaveRoas}
                style={{ marginTop: 16 }}
                type="button">
                Simpan ke Riwayat
              </button>
            )}
          </div>
        )}

        {roasHistory.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3>Riwayat Perhitungan</h3>
            {roasHistory.map((item) => (
              <div className="tx-card" key={item.id}>
                <div className="tx-card-left">
                  <span className="tx-category">
                    {item.inputs?.productName || "ROAS Calc"}
                  </span>
                </div>
                <div className="tx-card-right">
                  <span className="tx-date">{formatDate(item.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="iklan-block">
        <h2 className="iklan-block-title">✅ Checklist Sebelum Iklan</h2>
        <p className="iklan-block-lead">
          Jangan buang duit iklan kalau toko & produk belum siap. Checklist ini
          wajib dicek sebelum kamu mulai campaign.
        </p>
        <div className="checklist-progress-bar">
          <div className="checklist-progress-label">
            {checkedCount} / {checklistTotal} selesai
          </div>
          <div className="checklist-progress-track">
            <div
              className="checklist-progress-fill"
              style={{
                width: `${Math.round((checkedCount / checklistTotal) * 100)}%`,
              }}
            />
          </div>
        </div>
        {AD_CHECKLIST_ITEMS.map((item, i) => (
          <div
            className={`checklist-item ${checkedItems[i] ? "done" : ""}`}
            key={i}
            onClick={() => toggleCheckItem(i)}>
            <div className="checklist-item-check">
              {checkedItems[i] ? "✓" : ""}
            </div>
            <div className="checklist-item-text">
              <div className="checklist-item-title">{item.title}</div>
              <p className="checklist-item-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <InfoBox title="Kenapa ROAS penting?">
        <p>
          ROAS (Return on Ad Spend) menunjukkan apakah uang iklan kamu kembali
          atau tidak. ROAS 3x artinya setiap Rp1 iklan menghasilkan Rp3
          pendapatan. Target minimal umumnya 3-5x untuk bisnis fisik. Sebelum
          scale, pastikan ROAS kamu sudah di atas break-even point.
        </p>
      </InfoBox>
    </section>
  );
}
