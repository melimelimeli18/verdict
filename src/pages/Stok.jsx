import { useState, useEffect } from "react";
import { formatRpFull, formatDate } from "../utils/formatters.js";
import { ALASAN_MASUK, ALASAN_KELUAR, KATEGORI_PRODUK } from "../data/stok.js";

const STORAGE_KEY = "verdict_stok_data";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return {
        stokProduk: d.stokProduk || [],
        stokRiwayat: d.stokRiwayat || [],
        historiHarga: d.historiHarga || [],
      };
    }
  } catch (_) {
    /* ignore */
  }
  return { stokProduk: [], stokRiwayat: [], historiHarga: [] };
}

function saveToStorage(stokProduk, stokRiwayat, historiHarga) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stokProduk, stokRiwayat, historiHarga }),
    );
  } catch (_) {
    /* ignore */
  }
}

// ---- EMPTY FORMS ----
const INITIAL_PRODUCT_FORM = {
  nama: "",
  sku: "",
  kategori: "",
  supplier: "",
  hargaBeli: "",
  hargaJual: "",
  jumlah: "",
  minimum: "",
};

const INITIAL_GERAK_FORM = {
  alasan: "",
  jumlah: "",
  hargaBeli: "",
  supplier: "",
  nota: "",
  note: "",
};

export function StokPage() {
  // ---- Core state (loaded from localStorage) ----
  const [stokProduk, setStokProduk] = useState([]);
  const [stokRiwayat, setStokRiwayat] = useState([]);
  const [historiHarga, setHistoriHarga] = useState([]);

  // ---- UI state ----
  const [stokFilter, setStokFilter] = useState("semua");
  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);
  const [activeGerakId, setActiveGerakId] = useState(null);
  const [gerakType, setGerakType] = useState("masuk");
  const [gerakForm, setGerakForm] = useState(INITIAL_GERAK_FORM);
  const [rekapVisible, setRekapVisible] = useState(false);
  const [rekapResult, setRekapResult] = useState(null);

  // Load on mount
  useEffect(() => {
    const data = loadFromStorage();
    setStokProduk(data.stokProduk);
    setStokRiwayat(data.stokRiwayat);
    setHistoriHarga(data.historiHarga);
  }, []);

  // Persist on change
  useEffect(() => {
    saveToStorage(stokProduk, stokRiwayat, historiHarga);
  }, [stokProduk, stokRiwayat, historiHarga]);

  // ===== COMPUTED STATS =====
  const totalProduk = stokProduk.length;
  const totalItem = stokProduk.reduce((s, p) => s + p.stok, 0);
  const warning = stokProduk.filter((p) => p.stok <= (p.minimum || 5)).length;
  const nilaiStok = stokProduk.reduce((s, p) => s + p.stok * p.hargaBeli, 0);

  const kritisList = stokProduk.filter((p) => p.stok <= (p.minimum || 5));

  // ===== PRODUCT FORM =====
  function handleProductChange(e) {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  }

  function tambahProduk() {
    const nama = productForm.nama.trim();
    const sku = productForm.sku.trim();
    const kategori = productForm.kategori;
    const supplier = productForm.supplier.trim();
    const hargaBeli = Number(productForm.hargaBeli) || 0;
    const hargaJual = Number(productForm.hargaJual) || 0;
    const jumlah = Number(productForm.jumlah) || 0;
    const minimum = Number(productForm.minimum) || 5;

    if (!nama) {
      alert("Nama produk wajib diisi!");
      return;
    }

    const now = new Date().toISOString().slice(0, 10);
    const existingIdx = stokProduk.findIndex(
      (p) => p.nama.toLowerCase() === nama.toLowerCase(),
    );

    let newProduk = [...stokProduk];
    let newRiwayat = [...stokRiwayat];
    let newHistori = [...historiHarga];

    if (existingIdx >= 0) {
      const existing = { ...newProduk[existingIdx] };

      if (hargaBeli > 0 && hargaBeli !== existing.hargaBeli) {
        newHistori = [
          {
            id: Date.now(),
            produkId: existing.id,
            produkNama: existing.nama,
            hargaLama: existing.hargaBeli,
            hargaBaru: hargaBeli,
            date: now,
            supplier: supplier || existing.supplier,
            nota: "",
          },
          ...newHistori,
        ];
        existing.hargaBeli = hargaBeli;
      }
      if (hargaJual > 0) existing.hargaJual = hargaJual;
      if (sku) existing.sku = sku;
      if (kategori) existing.kategori = kategori;
      if (supplier) existing.supplier = supplier;
      existing.minimum = minimum;
      existing.stok += jumlah;

      if (jumlah > 0) {
        newRiwayat = [
          {
            id: Date.now(),
            produkId: existing.id,
            produkNama: existing.nama,
            type: "masuk",
            alasan: "Restock / Pembelian",
            jumlah,
            note: "Update dari form",
            supplier,
            nota: "",
            date: now,
          },
          ...newRiwayat,
        ];
      }

      newProduk = newProduk.map((p, i) => (i === existingIdx ? existing : p));
    } else {
      const produk = {
        id: Date.now(),
        nama,
        sku,
        kategori,
        supplier,
        hargaBeli,
        hargaJual,
        stok: jumlah,
        minimum,
      };
      newProduk = [produk, ...newProduk];

      if (jumlah > 0) {
        newRiwayat = [
          {
            id: Date.now() + 1,
            produkId: produk.id,
            produkNama: nama,
            type: "masuk",
            alasan: "Stok awal",
            jumlah,
            note: "",
            supplier,
            nota: "",
            date: now,
          },
          ...newRiwayat,
        ];
      }
      if (hargaBeli > 0) {
        newHistori = [
          {
            id: Date.now() + 2,
            produkId: produk.id,
            produkNama: nama,
            hargaLama: 0,
            hargaBaru: hargaBeli,
            date: now,
            supplier,
            nota: "",
          },
          ...newHistori,
        ];
      }
    }

    setStokProduk(newProduk);
    setStokRiwayat(newRiwayat);
    setHistoriHarga(newHistori);
    setProductForm(INITIAL_PRODUCT_FORM);
  }

  // ===== FILTER =====
  function getFilteredProduk() {
    if (stokFilter === "aman")
      return stokProduk.filter((p) => p.stok > (p.minimum || 5));
    if (stokFilter === "tipis")
      return stokProduk.filter((p) => p.stok <= (p.minimum || 5));
    return stokProduk;
  }

  // ===== STOCK MOVEMENT =====
  function bukaGerakForm(produkId) {
    setActiveGerakId(produkId);
    setGerakType("masuk");
    setGerakForm(INITIAL_GERAK_FORM);
  }

  function tutupGerakForm() {
    setActiveGerakId(null);
  }

  function handleGerakChange(e) {
    setGerakForm({ ...gerakForm, [e.target.name]: e.target.value });
  }

  function catatPergerakan() {
    const alasan = gerakForm.alasan;
    const jumlah = Number(gerakForm.jumlah) || 0;
    const note = gerakForm.note.trim();
    const nota = gerakForm.nota.trim();
    const supplier = gerakForm.supplier.trim();
    const hargaBeliBaru = Number(gerakForm.hargaBeli) || 0;

    if (!alasan || jumlah <= 0) {
      alert("Lengkapi alasan dan jumlah ya!");
      return;
    }

    const idx = stokProduk.findIndex((p) => p.id === activeGerakId);
    if (idx < 0) return;

    const produk = { ...stokProduk[idx] };
    if (gerakType === "keluar" && jumlah > produk.stok) {
      alert(
        `Stok tidak cukup! Stok ${produk.nama} saat ini: ${produk.stok} unit.`,
      );
      return;
    }

    let newHistori = [...historiHarga];
    const now = new Date().toISOString().slice(0, 10);

    if (
      gerakType === "masuk" &&
      hargaBeliBaru > 0 &&
      hargaBeliBaru !== produk.hargaBeli
    ) {
      newHistori = [
        {
          id: Date.now(),
          produkId: produk.id,
          produkNama: produk.nama,
          hargaLama: produk.hargaBeli,
          hargaBaru: hargaBeliBaru,
          date: now,
          supplier,
          nota,
        },
        ...newHistori,
      ];
      produk.hargaBeli = hargaBeliBaru;
    }
    if (gerakType === "masuk" && supplier) produk.supplier = supplier;

    produk.stok += gerakType === "masuk" ? jumlah : -jumlah;

    const riwayatEntry = {
      id: Date.now(),
      produkId: activeGerakId,
      produkNama: produk.nama,
      type: gerakType,
      alasan,
      jumlah,
      note,
      supplier,
      nota,
      date: now,
    };

    setStokProduk(stokProduk.map((p, i) => (i === idx ? produk : p)));
    setStokRiwayat([riwayatEntry, ...stokRiwayat]);
    setHistoriHarga(newHistori);
    tutupGerakForm();
  }

  // ===== DELETE =====
  function hapusProduk(id) {
    if (!confirm("Hapus produk ini?")) return;
    setStokProduk(stokProduk.filter((p) => p.id !== id));
    setStokRiwayat(stokRiwayat.filter((r) => r.produkId !== id));
    setHistoriHarga(historiHarga.filter((h) => h.produkId !== id));
  }

  function resetStok() {
    if (!confirm("Hapus semua data stok?")) return;
    setStokProduk([]);
    setStokRiwayat([]);
    setHistoriHarga([]);
    setRekapVisible(false);
    setRekapResult(null);
  }

  // ===== CSV EXPORT =====
  function exportStokCSV() {
    if (stokRiwayat.length === 0 && stokProduk.length === 0) {
      alert("Belum ada data untuk diekspor.");
      return;
    }
    let csv =
      "Tanggal,Produk,SKU,Kategori,Tipe,Alasan,Jumlah,Supplier,Nota,Catatan\n";
    stokRiwayat.forEach((r) => {
      const p = stokProduk.find((x) => x.id === r.produkId);
      csv += `"${r.date}","${r.produkNama}","${p?.sku || ""}","${p?.kategori || ""}","${r.type}","${r.alasan}","${r.jumlah}","${r.supplier || ""}","${r.nota || ""}","${r.note || ""}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stok-verdict.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ===== REKAP STOK =====
  function generateRekapStok() {
    if (stokProduk.length === 0) {
      alert("Belum ada produk. Tambahkan dulu ya!");
      return;
    }

    const habis = stokProduk.filter((p) => p.stok === 0);
    const kritis = stokProduk.filter(
      (p) => p.stok > 0 && p.stok <= Math.floor((p.minimum || 5) / 2),
    );
    const tipis = stokProduk.filter(
      (p) =>
        p.stok > Math.floor((p.minimum || 5) / 2) && p.stok <= (p.minimum || 5),
    );
    const aman = stokProduk.filter((p) => p.stok > (p.minimum || 5));
    const nilaiStokVal = stokProduk.reduce(
      (s, p) => s + p.stok * p.hargaBeli,
      0,
    );
    const potensiOmzet = stokProduk.reduce(
      (s, p) => s + p.stok * p.hargaJual,
      0,
    );

    const keluarCount = {};
    stokRiwayat
      .filter((r) => r.type === "keluar" && r.alasan === "Terjual")
      .forEach((r) => {
        keluarCount[r.produkNama] = (keluarCount[r.produkNama] || 0) + r.jumlah;
      });
    const topTerjual = Object.entries(keluarCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const numpuk = stokProduk
      .filter((p) => p.stok > (p.minimum || 5) * 3 && !keluarCount[p.nama])
      .slice(0, 3);

    let kondisi = "";
    if (habis.length > 0)
      kondisi = `🔴 <b>${habis.length} produk habis</b>: ${habis.map((p) => "<b>" + p.nama + "</b>").join(", ")}. Restock segera!`;
    else if (kritis.length > 0)
      kondisi = `🟡 <b>${kritis.length} produk kritis</b> — stok di bawah setengah minimum. Siapkan restock sebelum kehabisan.`;
    else if (tipis.length > 0)
      kondisi = `🟡 Stok umumnya aman, tapi <b>${tipis.length} produk</b> sudah di bawah batas minimum yang kamu set.`;
    else
      kondisi = `✅ Semua <b>${aman.length} produk</b> stoknya aman. Nilai stok: <b>${formatRpFull(nilaiStokVal)}</b>.`;

    const perluRestock = [...habis, ...kritis];
    let darurat =
      perluRestock.length === 0
        ? "Tidak ada produk yang perlu restock mendesak."
        : perluRestock
            .map(
              (p) =>
                `<b>${p.nama}</b>${p.sku ? " (" + p.sku + ")" : ""} — sisa <b>${p.stok}</b> unit${p.supplier ? " · Supplier: " + p.supplier : ""}`,
            )
            .join("<br>");

    let terlaris =
      topTerjual.length === 0
        ? 'Belum ada data penjualan. Catat stok keluar dengan alasan "Terjual".'
        : topTerjual
            .map((t, i) => `${i + 1}. <b>${t[0]}</b> — ${t[1]} unit terjual`)
            .join("<br>");
    if (numpuk.length > 0)
      terlaris +=
        `<br><br><b>Stok numpuk (belum ada penjualan):</b><br>` +
        numpuk
          .map(
            (p) =>
              `<b>${p.nama}</b> — ${p.stok} unit, pertimbangkan promosi atau diskon`,
          )
          .join("<br>");

    const aksi = [];
    if (habis.length > 0)
      aksi.push(`Restock segera: ${habis.map((p) => p.nama).join(", ")}.`);
    if (kritis.length > 0)
      aksi.push(`Siapkan PO untuk: ${kritis.map((p) => p.nama).join(", ")}.`);
    if (potensiOmzet > 0)
      aksi.push(
        `Potensi omzet dari stok saat ini: <b>${formatRpFull(potensiOmzet)}</b>.`,
      );
    const rusak = stokRiwayat
      .filter((r) => r.alasan === "Rusak / Cacat")
      .reduce((s, r) => s + r.jumlah, 0);
    if (rusak > 0)
      aksi.push(
        `<b>${rusak} unit</b> tercatat rusak — evaluasi kualitas packaging atau supplier.`,
      );
    if (aksi.length < 2)
      aksi.push(
        "Lakukan stock opname — cocokkan stok di sistem dengan stok fisik.",
      );

    const now = new Date();
    const timestamp = `${now.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][now.getMonth()]} ${now.getFullYear()}`;

    setRekapResult({ kondisi, darurat, terlaris, aksi, timestamp });
    setRekapVisible(true);
  }

  // ===== Active produk for movement =====
  const activeProduk = stokProduk.find((p) => p.id === activeGerakId);
  const reasonOptions = gerakType === "masuk" ? ALASAN_MASUK : ALASAN_KELUAR;

  // ===== Filtered list =====
  const filteredProduk = getFilteredProduk();

  return (
    <div style={{ padding: "20px 24px 48px" }}>
      {/* Title */}
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 20,
          color: "var(--brown)",
          marginBottom: 4,
        }}>
        Manajemen Stok
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--muted)",
          marginBottom: 20,
          lineHeight: 1.6,
        }}>
        Catat produk, pantau stok masuk & keluar, dan lihat rekap kesehatan stok
        kamu.
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 20,
        }}>
        <div className="keu-stat">
          <div className="keu-stat-label">Total Produk</div>
          <div className="keu-stat-val">{totalProduk}</div>
        </div>
        <div className="keu-stat">
          <div className="keu-stat-label">Total Item Stok</div>
          <div className="keu-stat-val">{totalItem}</div>
        </div>
        <div className="keu-stat">
          <div className="keu-stat-label">Stok Hampir Habis</div>
          <div className="keu-stat-val red">{warning}</div>
        </div>
        <div className="keu-stat">
          <div className="keu-stat-label">Nilai Stok (Modal)</div>
          <div className="keu-stat-val">{formatRpFull(nilaiStok)}</div>
        </div>
      </div>

      {/* ===== ALERT STOK KRITIS ===== */}
      {kritisList.length > 0 && (
        <div
          style={{
            background: "#fde8d8",
            border: "1px solid #f5b898",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 16,
          }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#b85c1a",
              marginBottom: 6,
            }}>
            ALERT — STOK DI BAWAH MINIMUM
          </div>
          <div style={{ fontSize: 12, color: "#b85c1a", lineHeight: 1.7 }}>
            {kritisList.map((p) => (
              <div key={p.id}>
                <b>{p.nama}</b>
                {p.sku ? ` (${p.sku})` : ""} — sisa <b>{p.stok} unit</b>,
                minimum: {p.minimum || 5} unit
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== FORM TAMBAH PRODUK ===== */}
      <div className="keu-form">
        <div className="keu-form-header">+ Tambah / Update Produk</div>
        <div className="keu-form-body">
          <div className="keu-row">
            <input
              className="keu-input wide"
              type="text"
              name="nama"
              placeholder="Nama produk..."
              value={productForm.nama}
              onChange={handleProductChange}
            />
            <input
              className="keu-input"
              type="text"
              name="sku"
              placeholder="SKU / kode"
              value={productForm.sku}
              onChange={handleProductChange}
            />
          </div>
          <div className="keu-row">
            <select
              className="keu-select"
              name="kategori"
              value={productForm.kategori}
              onChange={handleProductChange}>
              <option value="">Kategori...</option>
              {KATEGORI_PRODUK.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              className="keu-input"
              type="text"
              name="supplier"
              placeholder="Nama supplier"
              value={productForm.supplier}
              onChange={handleProductChange}
            />
          </div>
          <div className="keu-row">
            <input
              className="keu-input"
              type="number"
              name="hargaBeli"
              placeholder="Harga beli (Rp)"
              value={productForm.hargaBeli}
              onChange={handleProductChange}
            />
            <input
              className="keu-input"
              type="number"
              name="hargaJual"
              placeholder="Harga jual (Rp)"
              value={productForm.hargaJual}
              onChange={handleProductChange}
            />
          </div>
          <div className="keu-row">
            <input
              className="keu-input"
              type="number"
              name="jumlah"
              placeholder="Jumlah stok awal"
              value={productForm.jumlah}
              onChange={handleProductChange}
            />
            <input
              className="keu-input"
              type="number"
              name="minimum"
              placeholder="Stok minimum alert"
              value={productForm.minimum}
              onChange={handleProductChange}
            />
          </div>
          <button className="keu-add-btn" onClick={tambahProduk} type="button">
            + Tambah Produk
          </button>
        </div>
      </div>

      {/* ===== DAFTAR PRODUK ===== */}
      <div className="keu-list">
        <div className="keu-list-header">
          <div className="keu-list-title">Daftar Produk</div>
          <div className="keu-filter">
            <button
              className={`keu-filter-btn${stokFilter === "semua" ? " active" : ""}`}
              onClick={() => setStokFilter("semua")}>
              Semua
            </button>
            <button
              className={`keu-filter-btn${stokFilter === "aman" ? " active" : ""}`}
              onClick={() => setStokFilter("aman")}>
              Aman
            </button>
            <button
              className={`keu-filter-btn${stokFilter === "tipis" ? " active" : ""}`}
              onClick={() => setStokFilter("tipis")}>
              Tipis
            </button>
          </div>
        </div>
        <div>
          {filteredProduk.length === 0 ? (
            <div className="keu-empty">
              Belum ada produk.
              <br />
              Tambahkan produk pertama kamu 👆
            </div>
          ) : (
            filteredProduk.map((p) => {
              const margin =
                p.hargaJual > 0 && p.hargaBeli > 0
                  ? Math.round(
                      ((p.hargaJual - p.hargaBeli) / p.hargaJual) * 100,
                    )
                  : 0;
              const min = p.minimum || 5;
              const statusColor =
                p.stok === 0
                  ? "#b85c1a"
                  : p.stok <= Math.floor(min / 2)
                    ? "#b85c1a"
                    : p.stok <= min
                      ? "#b88a1a"
                      : "#1a6b4a";
              const statusLabel =
                p.stok === 0
                  ? "Habis"
                  : p.stok <= Math.floor(min / 2)
                    ? "Kritis"
                    : p.stok <= min
                      ? "Tipis"
                      : "Aman";
              const statusBg =
                p.stok === 0
                  ? "#fde8d8"
                  : p.stok <= Math.floor(min / 2)
                    ? "#fde8d8"
                    : p.stok <= min
                      ? "#fdf3d8"
                      : "#d4f1e4";

              return (
                <div
                  className="keu-entry"
                  key={p.id}
                  style={{
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "stretch",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text)",
                          marginBottom: 2,
                        }}>
                        {p.nama}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                          marginBottom: 2,
                        }}>
                        {p.sku && (
                          <span
                            style={{
                              fontSize: 10,
                              background: "var(--cream)",
                              color: "var(--muted)",
                              padding: "1px 6px",
                              borderRadius: 5,
                              fontWeight: 600,
                            }}>
                            SKU: {p.sku}
                          </span>
                        )}
                        {p.kategori && (
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--muted)",
                            }}>
                            {p.kategori}
                          </span>
                        )}
                        {p.supplier && (
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--muted)",
                            }}>
                            Supplier: {p.supplier}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}>
                        {p.hargaBeli > 0 && (
                          <span style={{ fontSize: 10, color: "var(--muted)" }}>
                            Modal: {formatRpFull(p.hargaBeli)}
                          </span>
                        )}
                        {p.hargaJual > 0 && (
                          <span style={{ fontSize: 10, color: "var(--muted)" }}>
                            Jual: {formatRpFull(p.hargaJual)}
                          </span>
                        )}
                        {margin > 0 && (
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--accent)",
                              fontWeight: 600,
                            }}>
                            Margin {margin}%
                          </span>
                        )}
                        <span style={{ fontSize: 10, color: "var(--muted)" }}>
                          Min: {min} unit
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontFamily: '"Playfair Display", serif',
                          fontSize: 22,
                          color: "var(--brown)",
                          lineHeight: 1,
                        }}>
                        {p.stok}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>
                        unit
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: 8,
                        background: statusBg,
                        color: statusColor,
                      }}>
                      {statusLabel}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => bukaGerakForm(p.id)}
                        style={{
                          padding: "6px 12px",
                          background: "var(--accent)",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: '"DM Sans", sans-serif',
                          cursor: "pointer",
                        }}
                        type="button">
                        Catat Gerak
                      </button>
                      <button
                        onClick={() => hapusProduk(p.id)}
                        style={{
                          padding: "6px 10px",
                          background: "transparent",
                          border: "1.5px solid rgba(100, 60, 30, 0.15)",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "var(--muted)",
                          cursor: "pointer",
                        }}
                        type="button">
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===== FORM PERGERAKAN STOK ===== */}
      {activeGerakId !== null && activeProduk && (
        <div className="keu-form">
          <div className="keu-form-header">Catat Pergerakan Stok</div>
          <div className="keu-form-body">
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                marginBottom: 10,
              }}>
              Produk: <strong>{activeProduk.nama}</strong>
            </div>
            <div className="keu-type-btn">
              <button
                className={`type-btn${gerakType === "masuk" ? " active-masuk" : ""}`}
                onClick={() => {
                  setGerakType("masuk");
                  setGerakForm({ ...gerakForm, alasan: "" });
                }}
                type="button">
                + Stok Masuk
              </button>
              <button
                className={`type-btn${gerakType === "keluar" ? " active-keluar" : ""}`}
                onClick={() => {
                  setGerakType("keluar");
                  setGerakForm({ ...gerakForm, alasan: "" });
                }}
                type="button">
                − Stok Keluar
              </button>
            </div>
            <div className="keu-row">
              <select
                className="keu-select"
                name="alasan"
                value={gerakForm.alasan}
                onChange={handleGerakChange}>
                <option value="">Alasan...</option>
                {reasonOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <input
                className="keu-input"
                type="number"
                name="jumlah"
                placeholder="Jumlah"
                value={gerakForm.jumlah}
                onChange={handleGerakChange}
              />
            </div>
            {/* SUPPLIER SECTION (only for masuk) */}
            {gerakType === "masuk" && (
              <>
                <div className="keu-row">
                  <input
                    className="keu-input"
                    type="number"
                    name="hargaBeli"
                    placeholder={
                      activeProduk.hargaBeli > 0
                        ? `Harga beli saat ini: ${formatRpFull(activeProduk.hargaBeli)}`
                        : "Harga beli baru (Rp)"
                    }
                    value={gerakForm.hargaBeli}
                    onChange={handleGerakChange}
                  />
                  <input
                    className="keu-input"
                    type="text"
                    name="supplier"
                    placeholder="Supplier (opsional)"
                    value={gerakForm.supplier}
                    onChange={handleGerakChange}
                  />
                </div>
                <div className="keu-row">
                  <input
                    className="keu-input wide"
                    type="text"
                    name="nota"
                    placeholder="No. nota / invoice (opsional)"
                    value={gerakForm.nota}
                    onChange={handleGerakChange}
                  />
                </div>
              </>
            )}
            <div className="keu-row">
              <input
                className="keu-input wide"
                type="text"
                name="note"
                placeholder="Catatan tambahan..."
                value={gerakForm.note}
                onChange={handleGerakChange}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button
                className="keu-add-btn"
                onClick={catatPergerakan}
                style={{ flex: 2 }}
                type="button">
                Simpan
              </button>
              <button
                onClick={tutupGerakForm}
                style={{
                  flex: 1,
                  padding: 11,
                  background: "transparent",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                  fontFamily: '"DM Sans", sans-serif',
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
                type="button">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RIWAYAT PERGERAKAN ===== */}
      <div className="keu-list" style={{ marginTop: 16 }}>
        <div className="keu-list-header">
          <div className="keu-list-title">Riwayat Pergerakan</div>
          <button
            onClick={exportStokCSV}
            style={{
              padding: "5px 11px",
              background: "var(--dark)",
              color: "var(--gold)",
              border: "none",
              borderRadius: 7,
              fontSize: 10,
              fontWeight: 600,
              fontFamily: '"DM Sans", sans-serif',
              cursor: "pointer",
              letterSpacing: "0.3px",
            }}
            type="button">
            Export CSV
          </button>
        </div>
        <div>
          {stokRiwayat.length === 0 ? (
            <div className="keu-empty">Belum ada pergerakan stok tercatat.</div>
          ) : (
            stokRiwayat.slice(0, 30).map((r) => (
              <div className="keu-entry" key={r.id}>
                <div
                  className={`keu-entry-dot ${r.type === "masuk" ? "dot-masuk" : "dot-keluar"}`}
                />
                <div className="keu-entry-body">
                  <div className="keu-entry-cat">{r.produkNama}</div>
                  <div className="keu-entry-note">
                    {r.alasan}
                    {r.nota ? " · Nota: " + r.nota : ""}
                    {r.supplier ? " · " + r.supplier : ""}
                    {r.note ? " · " + r.note : ""}
                  </div>
                  <div className="keu-entry-date">{formatDate(r.date)}</div>
                </div>
                <div
                  className={`keu-entry-amount ${r.type === "masuk" ? "amount-masuk" : "amount-keluar"}`}>
                  {r.type === "masuk" ? "+" : "-"}
                  {r.jumlah} unit
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== HISTORI HARGA BELI ===== */}
      <div className="keu-list" style={{ marginTop: 16 }}>
        <div className="keu-list-header">
          <div className="keu-list-title">Histori Harga Beli</div>
        </div>
        <div>
          {historiHarga.length === 0 ? (
            <div className="keu-empty">
              Harga beli yang berubah saat restock akan tercatat di sini.
            </div>
          ) : (
            historiHarga.map((h) => (
              <div className="keu-entry" key={h.id}>
                <div className="keu-entry-dot dot-keluar" />
                <div className="keu-entry-body">
                  <div className="keu-entry-cat">{h.produkNama}</div>
                  <div className="keu-entry-note">
                    {h.hargaLama > 0
                      ? formatRpFull(h.hargaLama) + " → "
                      : "Harga awal: "}
                    {formatRpFull(h.hargaBaru)}
                    {h.supplier ? " · " + h.supplier : ""}
                    {h.nota ? " · Nota: " + h.nota : ""}
                  </div>
                  <div className="keu-entry-date">{formatDate(h.date)}</div>
                </div>
                <div
                  className="keu-entry-amount"
                  style={{
                    color: "var(--accent)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                  {formatRpFull(h.hargaBaru)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== REKAP STOK ===== */}
      <div style={{ marginTop: 20 }}>
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
            Rekap Kondisi Stok
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(245, 239, 230, 0.7)",
              lineHeight: 1.6,
              marginBottom: 14,
            }}>
            Analisis otomatis kondisi stok kamu — mana yang perlu restock, mana
            yang numpuk.
          </div>
          <button
            onClick={generateRekapStok}
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
            }}
            type="button">
            Lihat Rekap Stok
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
                  Hasil Analisis Stok
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  {rekapResult.timestamp}
                </div>
              </div>
              <div
                style={{
                  padding: 16,
                  fontSize: 13,
                  color: "var(--text)",
                  lineHeight: 1.8,
                }}>
                {/* Kondisi Stok */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--accent)",
                      letterSpacing: "0.5px",
                      marginBottom: 5,
                    }}>
                    KONDISI STOK
                  </div>
                  <div
                    style={{ fontSize: 13, lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: rekapResult.kondisi }}
                  />
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "12px 0",
                  }}
                />
                {/* Produk Perlu Restock */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--accent)",
                      letterSpacing: "0.5px",
                      marginBottom: 5,
                    }}>
                    PRODUK PERLU RESTOCK
                  </div>
                  <div
                    style={{ fontSize: "12.5px", lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: rekapResult.darurat }}
                  />
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "12px 0",
                  }}
                />
                {/* Produk Terlaris */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--accent)",
                      letterSpacing: "0.5px",
                      marginBottom: 5,
                    }}>
                    PRODUK TERLARIS
                  </div>
                  <div
                    style={{ fontSize: "12.5px", lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: rekapResult.terlaris }}
                  />
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "12px 0",
                  }}
                />
                {/* Aksi */}
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--accent)",
                      letterSpacing: "0.5px",
                      marginBottom: 6,
                    }}>
                    AKSI YANG PERLU DILAKUKAN
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}>
                    {rekapResult.aksi.slice(0, 3).map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                        }}>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            background: "var(--accent)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                            marginTop: 1,
                          }}>
                          {i + 1}
                        </div>
                        <div
                          style={{ fontSize: "12.5px", lineHeight: 1.6 }}
                          dangerouslySetInnerHTML={{ __html: a }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== RESET ===== */}
      <button
        className="reset-btn"
        onClick={resetStok}
        style={{ marginTop: 16 }}
        type="button">
        ↺ Hapus semua data stok
      </button>
    </div>
  );
}
