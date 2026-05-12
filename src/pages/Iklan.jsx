import { useState, useEffect } from "react";
import { formatRpFull } from "../utils/formatters.js";
import {
  AD_METRICS,
  DECISION_TREE,
  AD_CHECKLIST_ITEMS,
} from "../data/iklan.js";

export function IklanPage({ auth, calculators }) {
  // ROAS Calculator State (matching reference: budget, revenue, price, cogs)
  const [budget, setBudget] = useState("");
  const [revenue, setRevenue] = useState("");
  const [price, setPrice] = useState("");
  const [cogs, setCogs] = useState("");
  const [roas, setRoas] = useState(null);
  const [profit, setProfit] = useState(null);
  const [verdict, setVerdict] = useState(null);

  // Ad Checklist State
  const [checkedItems, setCheckedItems] = useState({});

  // Rekap state
  const [rekapResult, setRekapResult] = useState(null);
  const [rekapVisible, setRekapVisible] = useState(false);

  // Live recalculate ROAS whenever any input changes
  useEffect(() => {
    calcROAS();
  }, [budget, revenue, price, cogs]);

  function calcROAS() {
    const b = Number(budget) || 0;
    const r = Number(revenue) || 0;
    const p = Number(price) || 0;
    const c = Number(cogs) || 0;

    if (!b || !r) {
      setRoas(null);
      setProfit(null);
      setVerdict(null);
      return;
    }

    const roasVal = r / b;
    const units = p > 0 ? Math.round(r / p) : 0;
    const platformFee = r * 0.05;
    const profitVal = r - c * units - b - platformFee;

    setRoas(roasVal);
    setProfit(Math.round(profitVal));

    if (roasVal >= 3) {
      setVerdict({
        text: "✅ ROAS bagus! Pertimbangkan untuk scale up budget iklan.",
        cls: "verdict-good",
      });
    } else if (roasVal >= 1.5) {
      setVerdict({
        text: "⚠️ ROAS masih perlu dioptimasi. Cek foto, harga, dan targeting.",
        cls: "verdict-warn",
      });
    } else {
      setVerdict({
        text: "❌ ROAS terlalu rendah — matiin dulu, evaluasi dari foto dan produk.",
        cls: "verdict-bad",
      });
    }
  }

  function generateRekapIklan() {
    const b = Number(budget) || 0;
    const r = Number(revenue) || 0;
    const p = Number(price) || 0;
    const c = Number(cogs) || 0;

    if (!b || !r) {
      alert(
        "Isi dulu kalkulator ROAS di atas — minimal budget iklan dan total penjualan!",
      );
      return;
    }

    const roasVal = r / b;
    const units = p > 0 ? Math.round(r / p) : 0;
    const platformFee = r * 0.05;
    const profitVal = r - c * units - b - platformFee;
    const marginVal = r > 0 ? Math.round((profitVal / r) * 100) : 0;
    const cpoVal = units > 0 ? Math.round(b / units) : 0;

    // Status ROAS
    let statusROAS = "",
      warnaROAS = "";
    if (roasVal >= 4) {
      statusROAS = "Sangat Bagus";
      warnaROAS = "#1a6b4a";
    } else if (roasVal >= 3) {
      statusROAS = "Bagus";
      warnaROAS = "#1a6b4a";
    } else if (roasVal >= 1.5) {
      statusROAS = "Perlu Optimasi";
      warnaROAS = "#b88a1a";
    } else {
      statusROAS = "Merugi";
      warnaROAS = "#b85c1a";
    }

    // Saran berdasarkan kondisi
    const saran = [];
    if (roasVal < 1.5) {
      saran.push({
        icon: "🔴",
        teks: "<b>Matiin iklan dulu.</b> ROAS di bawah 1.5x artinya kamu rugi untuk setiap rupiah yang dikeluarkan. Perbaiki dulu foto produk, harga, dan ulasan sebelum iklan lagi.",
      });
      saran.push({
        icon: "🔍",
        teks: "<b>Audit halaman produk.</b> Kalau orang klik tapi tidak beli — masalahnya di harga, deskripsi, atau kurangnya ulasan. Fokus perbaiki tiga hal itu dulu.",
      });
    } else if (roasVal < 3) {
      saran.push({
        icon: "🟡",
        teks: `<b>Iklan jalan tapi perlu dioptimasi.</b> ROAS ${roasVal.toFixed(1)}x masih bisa ditingkatkan. Coba ganti foto thumbnail dan test keyword yang lebih spesifik (long-tail).`,
      });
      saran.push({
        icon: "💡",
        teks: "<b>Cek CTR iklan.</b> Kalau impresi tinggi tapi klik sedikit, masalahnya di foto atau judul. Kalau CTR bagus tapi konversi rendah, masalahnya di halaman produk.",
      });
    } else {
      saran.push({
        icon: "✅",
        teks: `<b>Iklan kamu profitable!</b> ROAS ${roasVal.toFixed(1)}x artinya setiap Rp 1 yang kamu keluarkan menghasilkan Rp ${roasVal.toFixed(1)}. Naikkan budget 20–30% per minggu secara bertahap.`,
      });
      saran.push({
        icon: "🚀",
        teks: '<b>Scale bertahap, bukan langsung 2x.</b> Naikkan budget perlahan supaya algoritma iklan tidak perlu "belajar ulang" dan performa tetap stabil.',
      });
    }

    if (cpoVal > 0 && c > 0) {
      const profitPerOrder = p - c - p * 0.05;
      if (cpoVal > profitPerOrder * 0.3) {
        saran.push({
          icon: "⚠️",
          teks: `<b>CPO terlalu tinggi.</b> Biaya per order <b>${formatRpFull(cpoVal)}</b> sudah lebih dari 30% profit per item. Pertimbangkan turunkan bid atau perluas target audience.`,
        });
      }
    }

    if (marginVal < 10 && r > 0) {
      saran.push({
        icon: "🚨",
        teks: `<b>Margin produk tipis (${marginVal}%).</b> Bahkan dengan iklan yang bagus, profit kamu akan sangat kecil. Pertimbangkan naikkan harga jual atau cari supplier lebih murah.`,
      });
    }

    setRekapResult({
      statusROAS,
      warnaROAS,
      roasVal,
      profitVal,
      cpoVal,
      saran,
    });
    setRekapVisible(true);
  }

  function toggleCheckItem(idx) {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const checklistTotal = AD_CHECKLIST_ITEMS.length;

  return (
    <div className="ad-section" style={{ padding: "20px 24px 48px" }}>
      <div className="section-title">Panduan Evaluasi Iklan</div>
      <div className="section-desc">
        Sebelum bakar uang di iklan, kamu harus bisa baca angkanya. Ini metrik
        yang paling penting — dan kapan harus matiin iklan yang ga worth it.
      </div>

      {/* ===== ROAS CALCULATOR ===== */}
      <div className="calc-box">
        <div className="calc-title">🧮 Kalkulator ROAS & Iklan</div>
        <div className="calc-row">
          <div className="calc-label">Budget iklan (Rp)</div>
          <input
            className="calc-input"
            type="number"
            placeholder="50000"
            value={budget}
            onInput={(e) => setBudget(e.target.value)}
          />
        </div>
        <div className="calc-row">
          <div className="calc-label">Total penjualan (Rp)</div>
          <input
            className="calc-input"
            type="number"
            placeholder="200000"
            value={revenue}
            onInput={(e) => setRevenue(e.target.value)}
          />
        </div>
        <div className="calc-row">
          <div className="calc-label">Harga produk (Rp)</div>
          <input
            className="calc-input"
            type="number"
            placeholder="85000"
            value={price}
            onInput={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="calc-row">
          <div className="calc-label">Modal produk (Rp)</div>
          <input
            className="calc-input"
            type="number"
            placeholder="40000"
            value={cogs}
            onInput={(e) => setCogs(e.target.value)}
          />
        </div>

        {roas !== null && (
          <div className="calc-result">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}>
              <div>
                <div className="calc-result-label">ROAS</div>
                <div className="calc-result-value">{roas.toFixed(1)}x</div>
              </div>
              <div>
                <div className="calc-result-label">Profit Bersih</div>
                <div className="calc-result-value">{formatRpFull(profit)}</div>
              </div>
            </div>
            {verdict && (
              <div className={`calc-result-verdict ${verdict.cls}`}>
                {verdict.text}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== METRICS GRID ===== */}
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 15,
          color: "var(--brown)",
          marginBottom: 12,
        }}>
        📊 Metrik yang Harus Kamu Pahami
      </div>

      <div className="metrics-grid">
        {AD_METRICS.map((m) => (
          <div className="metric-card" key={m.key}>
            <div className="metric-name">{m.key}</div>
            <div className="metric-full">{m.full}</div>
            <div className="metric-desc">{m.desc}</div>
            <div className={`metric-benchmark ${m.benchClass}`}>
              {m.benchmark}
            </div>
          </div>
        ))}
      </div>

      {/* ===== DECISION TREE ===== */}
      <div className="decision-tree">
        <div className="dt-header">
          🔍 Apa yang harus dilakukan dengan iklanmu?
        </div>
        {DECISION_TREE.map((d, i) => (
          <div className="dt-row" key={i}>
            <div className="dt-condition">{d.condition}</div>
            <div className="dt-arrow">→</div>
            <div className="dt-action">
              <div className="dt-action-title">{d.title}</div>
              <div className="dt-action-desc">{d.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== AD CHECKLIST ===== */}
      <div className="ad-checklist">
        <div className="ad-check-header">
          ✅ Checklist Sebelum Jalankan Iklan
        </div>
        {AD_CHECKLIST_ITEMS.map((item, i) => (
          <div
            className={`check-item ${checkedItems[i] ? "done" : ""}`}
            key={i}
            onClick={() => toggleCheckItem(i)}
            style={{ cursor: "pointer" }}>
            <div className="checkbox">
              <span className="check-icon">✓</span>
            </div>
            <div className="check-body">
              <div className="check-title">{item.title}</div>
              <div className="check-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== HIGHLIGHT BOX ===== */}
      <div className="highlight-box">
        <div className="hb-title">💡 Rahasia yang jarang diajarkan</div>
        <div className="hb-body">
          Seller yang berhasil dengan iklan biasanya bukan yang paling besar
          budgetnya — tapi yang paling rajin evaluasi setiap hari dan berani
          matiin iklan yang ga perform. Iklan bukan mesin pencetak uang
          otomatis. Dia alat amplifikasi — kalau produk dan tokonya bagus, iklan
          akan makin bagus hasilnya. Kalau tokonya belum siap, iklan cuma
          mempercepat habisnya uang kamu.
        </div>
        <div className="hb-pills">
          <span className="hb-pill">Mulai kecil</span>
          <span className="hb-pill">Evaluasi tiap hari</span>
          <span className="hb-pill">Scale yang winner</span>
          <span className="hb-pill">Matiin yang rugi</span>
        </div>
      </div>

      {/* ===== REKAP SARAN IKLAN ===== */}
      <div style={{ marginTop: 4 }}>
        <div
          style={{
            background: "linear-gradient(135deg, var(--dark), var(--brown))",
            borderRadius: 14,
            padding: "18px 16px",
          }}>
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 15,
              color: "var(--gold)",
              marginBottom: 6,
            }}>
            Rekap & Saran Iklan
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(245, 239, 230, 0.7)",
              lineHeight: 1.6,
              marginBottom: 14,
            }}>
            Isi kalkulator ROAS di atas dulu, lalu klik tombol ini untuk dapat
            saran spesifik berdasarkan angkanya.
          </div>
          <button
            onClick={generateRekapIklan}
            style={{
              width: "100%",
              padding: 13,
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: '"DM Sans", sans-serif',
              cursor: "pointer",
              letterSpacing: "0.2px",
            }}>
            Lihat Saran Iklan
          </button>
        </div>

        {rekapVisible && rekapResult && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
              }}>
              <div
                style={{
                  background: "var(--cream)",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <div
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: 14,
                    color: "var(--brown)",
                  }}>
                  Hasil Analisis Iklan
                </div>
              </div>
              <div
                style={{
                  padding: 16,
                  fontSize: 13,
                  color: "var(--text)",
                  lineHeight: 1.8,
                }}>
                {/* Status ROAS */}
                <div
                  style={{
                    background: "var(--cream)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--muted)",
                        fontWeight: 600,
                        letterSpacing: "0.3px",
                        marginBottom: 3,
                      }}>
                      STATUS IKLAN
                    </div>
                    <div
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 18,
                        fontWeight: 700,
                        color: rekapResult.warnaROAS,
                      }}>
                      {rekapResult.statusROAS}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--muted)",
                        marginBottom: 3,
                      }}>
                      ROAS · Profit · CPO
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text)",
                      }}>
                      {rekapResult.roasVal.toFixed(1)}x ·{" "}
                      {formatRpFull(rekapResult.profitVal)} ·{" "}
                      {rekapResult.cpoVal > 0
                        ? formatRpFull(rekapResult.cpoVal)
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Saran */}
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--accent)",
                    letterSpacing: "0.5px",
                    marginBottom: 8,
                  }}>
                  SARAN YANG HARUS DILAKUKAN
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}>
                  {rekapResult.saran.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>
                        {s.icon}
                      </span>
                      <div
                        style={{
                          fontSize: "12.5px",
                          lineHeight: 1.7,
                          color: "var(--text)",
                        }}
                        dangerouslySetInnerHTML={{ __html: s.teks }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
