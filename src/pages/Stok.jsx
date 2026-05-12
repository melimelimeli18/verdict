import { useState, useEffect } from "react";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { formatDate } from "../utils/formatters.js";
import { ALASAN_MASUK, ALASAN_KELUAR, KATEGORI_PRODUK } from "../data/stok.js";

const INITIAL_FORM = {
  productName: "",
  category: "",
  type: "keluar",
  qty: "",
  reason: "",
  note: "",
};

export function StokPage({ auth, inventory }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.user && inventory) {
      inventory.list().then(setLogs);
    }
  }, [auth.user, inventory]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!auth.user || !inventory) return;
    if (!form.productName.trim() || !form.qty) return;

    setLoading(true);
    await inventory.add({
      product_name: form.productName.trim(),
      category: form.category || "Lainnya",
      type: form.type,
      qty_change: Number(form.qty),
      reason: form.reason || "Lainnya",
      note: form.note.trim(),
    });
    const updated = await inventory.list();
    setLogs(updated);
    setForm(INITIAL_FORM);
    setLoading(false);
  }

  const reasonOptions = form.type === "masuk" ? ALASAN_MASUK : ALASAN_KELUAR;

  return (
    <section className="keu-section page">
      <div className="section-title">Manajemen Stok</div>
      <div className="section-desc">
        Catat produk, pantau stok masuk & keluar, dan lihat rekap kesehatan stok
        kamu.
      </div>

      {/* ===== STOCK FORM ===== */}
      <form className="calc-form" onSubmit={handleSubmit}>
        <input
          name="productName"
          placeholder="Nama Produk"
          value={form.productName}
          onChange={handleChange}
          required
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Pilih Kategori</option>
          {KATEGORI_PRODUK.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="stok-type-toggle">
          <button
            type="button"
            className={`stok-type-btn ${form.type === "masuk" ? "active" : ""}`}
            onClick={() => setForm({ ...form, type: "masuk", reason: "" })}>
            📥 Barang Masuk
          </button>
          <button
            type="button"
            className={`stok-type-btn ${form.type === "keluar" ? "active" : ""}`}
            onClick={() => setForm({ ...form, type: "keluar", reason: "" })}>
            📤 Barang Keluar
          </button>
        </div>

        <input
          name="qty"
          placeholder="Jumlah (pcs)"
          type="number"
          min="1"
          value={form.qty}
          onChange={handleChange}
          required
        />

        <select name="reason" value={form.reason} onChange={handleChange}>
          <option value="">Alasan</option>
          {reasonOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <input
          name="note"
          placeholder="Catatan (opsional)"
          value={form.note}
          onChange={handleChange}
        />

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Catat"}
        </button>
      </form>

      {/* ===== STOCK LOG TABLE ===== */}
      {logs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Riwayat Stok</h3>
          <div className="stok-log-table">
            <div className="stok-log-header">
              <span>Tanggal</span>
              <span>Produk</span>
              <span>Kategori</span>
              <span>Tipe</span>
              <span>Qty</span>
              <span>Alasan</span>
            </div>
            {logs.map((log) => (
              <div className="stok-log-row" key={log.id}>
                <span className="stok-date">{formatDate(log.created_at)}</span>
                <span className="stok-product">{log.product_name}</span>
                <span className="stok-category">{log.category || "-"}</span>
                <span
                  className={`stok-type ${log.type === "masuk" ? "in" : "out"}`}>
                  {log.type === "masuk" ? "📥 Masuk" : "📤 Keluar"}
                </span>
                <span className="stok-qty">{log.qty_change}</span>
                <span className="stok-reason">{log.reason || "-"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <div className="empty-state">
          <p>
            Belum ada catatan stok. Tambahkan barang masuk atau keluar di atas.
          </p>
        </div>
      )}

      <InfoBox title="Tips Stok">
        <p>
          Catat setiap pergerakan stok secara konsisten. Ini membantu kamu tahu
          produk mana yang cepat habis, kapan harus restock, dan apakah ada
          barang yang sering rusak atau hilang. Data stok yang rapi = keputusan
          bisnis yang lebih tepat.
        </p>
      </InfoBox>
    </section>
  );
}
