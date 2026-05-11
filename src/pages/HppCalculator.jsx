import { useState } from "react";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { formatRpFull, formatDate } from "../utils/formatters.js";

const INITIAL_RESELLER = {
  productName: "",
  buyPrice: "",
  sellPrice: "",
  adCostPerUnit: "",
  packagingCost: "",
  shippingSubsidy: "",
};
const INITIAL_PRODUCTION = {
  productName: "",
  rawMaterialCost: "",
  laborCost: "",
  overheadCost: "",
  packagingCost: "",
  shippingSubsidy: "",
  marginPercent: "",
};

export function HppCalculatorPage({ auth, calculators }) {
  const [mode, setMode] = useState("reseller");
  const [form, setForm] = useState(INITIAL_RESELLER);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history once on mount
  useState(() => {
    if (auth.user && calculators) {
      calculators.listHpp().then(setHistory);
    }
  }, [auth.user]);

  function switchMode(m) {
    setMode(m);
    setForm(m === "reseller" ? INITIAL_RESELLER : INITIAL_PRODUCTION);
    setResult(null);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function calculate() {
    if (mode === "reseller") {
      const buy = Number(form.buyPrice) || 0;
      const sell = Number(form.sellPrice) || 0;
      const ad = Number(form.adCostPerUnit) || 0;
      const packaging = Number(form.packagingCost) || 0;
      const subsidy = Number(form.shippingSubsidy) || 0;
      const hpp = buy + ad + packaging + subsidy;
      const profit = sell - hpp;
      const marginPercent = sell > 0 ? Math.round((profit / sell) * 100) : 0;
      setResult({ hpp, profit, marginPercent });
    } else {
      const raw = Number(form.rawMaterialCost) || 0;
      const labor = Number(form.laborCost) || 0;
      const overhead = Number(form.overheadCost) || 0;
      const packaging = Number(form.packagingCost) || 0;
      const subsidy = Number(form.shippingSubsidy) || 0;
      const hpp = raw + labor + overhead + packaging + subsidy;
      const margin = Number(form.marginPercent) || 0;
      const sellPrice = hpp > 0 ? Math.round(hpp / (1 - margin / 100)) : 0;
      const profit = sellPrice - hpp;
      setResult({ hpp, profit, marginPercent: margin, sellPrice });
    }
  }

  async function handleSave() {
    if (!auth.user || !calculators || !result) return;
    await calculators.saveHpp({ mode, inputs: form, results: result });
    const updated = await calculators.listHpp();
    setHistory(updated);
  }

  return (
    <section className="content page">
      <PageIntro
        title="Kalkulator HPP"
        description="Hitung Harga Pokok Penjualan untuk reseller dan produksi sendiri. Pastikan kamu tahu margin sebelum scale."
      />

      <div className="mode-switch">
        <button
          className={`mode-btn ${mode === "reseller" ? "active" : ""}`}
          onClick={() => switchMode("reseller")}
          type="button">
          Reseller
        </button>
        <button
          className={`mode-btn ${mode === "production" ? "active" : ""}`}
          onClick={() => switchMode("production")}
          type="button">
          Produksi Sendiri
        </button>
      </div>

      <div className="calc-form">
        {mode === "reseller" ? (
          <>
            <input
              name="productName"
              placeholder="Nama Produk"
              value={form.productName}
              onChange={handleChange}
            />
            <input
              name="buyPrice"
              placeholder="Harga Beli (Rp)"
              type="number"
              value={form.buyPrice}
              onChange={handleChange}
            />
            <input
              name="sellPrice"
              placeholder="Harga Jual (Rp)"
              type="number"
              value={form.sellPrice}
              onChange={handleChange}
            />
            <input
              name="adCostPerUnit"
              placeholder="Biaya Iklan per Unit (Rp)"
              type="number"
              value={form.adCostPerUnit}
              onChange={handleChange}
            />
            <input
              name="packagingCost"
              placeholder="Biaya Kemasan (Rp)"
              type="number"
              value={form.packagingCost}
              onChange={handleChange}
            />
            <input
              name="shippingSubsidy"
              placeholder="Subsidi Ongkir (Rp)"
              type="number"
              value={form.shippingSubsidy}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <input
              name="productName"
              placeholder="Nama Produk"
              value={form.productName}
              onChange={handleChange}
            />
            <input
              name="rawMaterialCost"
              placeholder="Biaya Bahan Baku (Rp)"
              type="number"
              value={form.rawMaterialCost}
              onChange={handleChange}
            />
            <input
              name="laborCost"
              placeholder="Biaya Tenaga Kerja (Rp)"
              type="number"
              value={form.laborCost}
              onChange={handleChange}
            />
            <input
              name="overheadCost"
              placeholder="Biaya Overhead (Rp)"
              type="number"
              value={form.overheadCost}
              onChange={handleChange}
            />
            <input
              name="packagingCost"
              placeholder="Biaya Kemasan (Rp)"
              type="number"
              value={form.packagingCost}
              onChange={handleChange}
            />
            <input
              name="shippingSubsidy"
              placeholder="Subsidi Ongkir (Rp)"
              type="number"
              value={form.shippingSubsidy}
              onChange={handleChange}
            />
            <input
              name="marginPercent"
              placeholder="Target Margin (%)"
              type="number"
              value={form.marginPercent}
              onChange={handleChange}
            />
          </>
        )}
        <button className="btn-primary" onClick={calculate} type="button">
          Hitung
        </button>
      </div>

      {result && (
        <div className="calc-result">
          <h3>Hasil</h3>
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{formatRpFull(result.hpp)}</span>
              <span className="stat-label">HPP</span>
            </div>
            <div className="stat-card">
              <span
                className={`stat-number ${result.profit >= 0 ? "positive" : "negative"}`}>
                {formatRpFull(result.profit)}
              </span>
              <span className="stat-label">Profit</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{result.marginPercent}%</span>
              <span className="stat-label">Margin</span>
            </div>
            {result.sellPrice !== undefined && (
              <div className="stat-card">
                <span className="stat-number">
                  {formatRpFull(result.sellPrice)}
                </span>
                <span className="stat-label">Harga Jual Rekomendasi</span>
              </div>
            )}
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
                  {item.inputs?.productName || item.mode}
                </span>
              </div>
              <div className="tx-card-right">
                <span className="tx-date">{formatDate(item.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <InfoBox title="Mengapa HPP penting?">
        <p>
          HPP adalah fondasi pricing. Kalau kamu tidak tahu HPP, kamu tidak tahu
          apakah bisnis kamu untung atau rugi. Kalkulator ini memperhitungkan
          semua biaya variabel per unit.
        </p>
      </InfoBox>
    </section>
  );
}
