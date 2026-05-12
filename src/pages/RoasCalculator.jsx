import { useEffect, useState } from "react";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { formatRpFull, formatDate } from "../utils/formatters.js";

const INITIAL_FORM = {
  productName: "",
  adSpend: "",
  revenue: "",
  orderCount: "",
};

export function RoasCalculatorPage({ auth, calculators }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (auth.user && calculators) {
      calculators.listRoas().then(setHistory);
    } else {
      setHistory([]);
    }
  }, [auth.user, calculators]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function calculate() {
    const adSpend = Number(form.adSpend) || 0;
    const revenue = Number(form.revenue) || 0;
    const orderCount = Number(form.orderCount) || 0;
    const roas = adSpend > 0 ? Number((revenue / adSpend).toFixed(1)) : 0;
    const cpa = orderCount > 0 ? Math.round(adSpend / orderCount) : 0;
    const profit = revenue - adSpend;
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
    setResult({ roas, cpa, profit, margin });
  }

  async function handleSave() {
    if (!auth.user || !calculators || !result) return;
    await calculators.saveRoas({ inputs: form, results: result });
    const updated = await calculators.listRoas();
    setHistory(updated);
  }

  return (
    <section className="content page">
      <PageIntro
        title="Kalkulator ROAS"
        description="Hitung Return on Ad Spend dan Cost per Acquisition. Tahu angka pasti sebelum scale budget iklan."
      />

      <div className="calc-form">
        <input
          name="productName"
          placeholder="Nama Produk / Kampanye"
          value={form.productName}
          onChange={handleChange}
        />
        <input
          name="adSpend"
          placeholder="Total Biaya Iklan (Rp)"
          type="number"
          value={form.adSpend}
          onChange={handleChange}
        />
        <input
          name="revenue"
          placeholder="Total Pendapatan dari Iklan (Rp)"
          type="number"
          value={form.revenue}
          onChange={handleChange}
        />
        <input
          name="orderCount"
          placeholder="Jumlah Order"
          type="number"
          value={form.orderCount}
          onChange={handleChange}
        />
        <button className="btn-primary" onClick={calculate} type="button">
          Hitung
        </button>
      </div>

      {result && (
        <div className="calc-result">
          <h3>Hasil</h3>
          <div className="stats-row">
            <div className="stat-card">
              <span
                className={`stat-number ${result.roas >= 3 ? "positive" : "negative"}`}>
                {result.roas}x
              </span>
              <span className="stat-label">ROAS</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{formatRpFull(result.cpa)}</span>
              <span className="stat-label">CPA (Biaya per Order)</span>
            </div>
            <div className="stat-card">
              <span
                className={`stat-number ${result.profit >= 0 ? "positive" : "negative"}`}>
                {formatRpFull(result.profit)}
              </span>
              <span className="stat-label">Profit</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{result.margin}%</span>
              <span className="stat-label">Margin</span>
            </div>
          </div>
          {auth.user && (
            <button
              className="btn-primary"
              onClick={handleSave}
              style={{ marginTop: 16 }}
              type="button">
              Simpan ke Riwayat
            </button>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Riwayat Perhitungan</h3>
          {history.map((item) => (
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

      <InfoBox title="Kenapa ROAS penting?">
        <p>
          ROAS (Return on Ad Spend) menunjukkan apakah uang iklan kamu kembali
          atau tidak. ROAS 3x artinya setiap Rp1 iklan menghasilkan Rp3
          pendapatan. Target minimal umumnya 3-5x untuk bisnis fisik.
        </p>
      </InfoBox>
    </section>
  );
}
