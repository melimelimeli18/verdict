// ===== STOK =====
let stokProduk = [];
let stokRiwayat = [];
let historiHarga = [];
let stokFilter = "semua";
let activeGerakId = null;
let gerakType = "masuk";

const ALASAN_MASUK = [
  "Restock / Pembelian",
  "Retur dari pembeli",
  "Koreksi stok",
  "Lainnya",
];
const ALASAN_KELUAR = [
  "Terjual",
  "Rusak / Cacat",
  "Sampel / Tester",
  "Koreksi stok",
  "Lainnya",
];

function tambahProduk() {
  const nama = document.getElementById("stok-nama").value.trim();
  const sku = document.getElementById("stok-sku").value.trim();
  const kategori = document.getElementById("stok-kategori").value;
  const supplier = document.getElementById("stok-supplier").value.trim();
  const hargaBeli =
    parseFloat(document.getElementById("stok-harga-beli").value) || 0;
  const hargaJual =
    parseFloat(document.getElementById("stok-harga-jual").value) || 0;
  const jumlah =
    parseInt(document.getElementById("stok-jumlah").value) || 0;
  const minimum =
    parseInt(document.getElementById("stok-minimum").value) || 5;

  if (!nama) {
    alert("Nama produk wajib diisi!");
    return;
  }

  const existing = stokProduk.find(
    (p) => p.nama.toLowerCase() === nama.toLowerCase(),
  );
  if (existing) {
    if (hargaBeli > 0 && hargaBeli !== existing.hargaBeli) {
      historiHarga.unshift({
        id: Date.now(),
        produkId: existing.id,
        produkNama: existing.nama,
        hargaLama: existing.hargaBeli,
        hargaBaru: hargaBeli,
        date: new Date().toISOString().slice(0, 10),
        supplier: supplier || existing.supplier,
        nota: "",
      });
      existing.hargaBeli = hargaBeli;
    }
    if (hargaJual > 0) existing.hargaJual = hargaJual;
    if (sku) existing.sku = sku;
    if (kategori) existing.kategori = kategori;
    if (supplier) existing.supplier = supplier;
    existing.minimum = minimum;
    existing.stok += jumlah;
    if (jumlah > 0)
      stokRiwayat.unshift({
        id: Date.now(),
        produkId: existing.id,
        produkNama: existing.nama,
        type: "masuk",
        alasan: "Restock / Pembelian",
        jumlah,
        note: "Update dari form",
        supplier,
        nota: "",
        date: new Date().toISOString().slice(0, 10),
      });
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
    stokProduk.unshift(produk);
    if (jumlah > 0)
      stokRiwayat.unshift({
        id: Date.now() + 1,
        produkId: produk.id,
        produkNama: nama,
        type: "masuk",
        alasan: "Stok awal",
        jumlah,
        note: "",
        supplier,
        nota: "",
        date: new Date().toISOString().slice(0, 10),
      });
    if (hargaBeli > 0)
      historiHarga.unshift({
        id: Date.now() + 2,
        produkId: produk.id,
        produkNama: nama,
        hargaLama: 0,
        hargaBaru: hargaBeli,
        date: new Date().toISOString().slice(0, 10),
        supplier,
        nota: "",
      });
  }

  [
    "stok-nama",
    "stok-sku",
    "stok-supplier",
    "stok-harga-beli",
    "stok-harga-jual",
    "stok-jumlah",
    "stok-minimum",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("stok-kategori").value = "";
  renderStok();
  renderRiwayat();
  renderHistoriHarga();
  updateStokStats();
  saveToLocal();
}

function filterStok(f, btn) {
  stokFilter = f;
  document
    .querySelectorAll("#stok-produk-list .keu-filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderStok();
}

function renderStok() {
  const container = document.getElementById("stok-entries");
  let list = [...stokProduk];
  if (stokFilter === "aman")
    list = list.filter((p) => p.stok > (p.minimum || 5));
  if (stokFilter === "tipis")
    list = list.filter((p) => p.stok <= (p.minimum || 5));

  if (list.length === 0) {
    container.innerHTML =
      '<div class="keu-empty">Belum ada produk.<br>Tambahkan produk pertama kamu 👆</div>';
    return;
  }

  container.innerHTML = list
    .map((p) => {
      const margin =
        p.hargaJual > 0 && p.hargaBeli > 0
          ? Math.round(((p.hargaJual - p.hargaBeli) / p.hargaJual) * 100)
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
      return `
<div class="keu-entry" style="flex-direction:column; gap:8px; align-items:stretch;">
  <div style="display:flex; align-items:flex-start; gap:10px;">
    <div style="flex:1; min-width:0;">
      <div style="font-size:13px; font-weight:600; color:var(--text); margin-bottom:2px;">${p.nama}</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:2px;">
        ${p.sku ? `<span style="font-size:10px; background:var(--cream); color:var(--muted); padding:1px 6px; border-radius:5px; font-weight:600;">SKU: ${p.sku}</span>` : ""}
        ${p.kategori ? `<span style="font-size:10px; color:var(--muted);">${p.kategori}</span>` : ""}
        ${p.supplier ? `<span style="font-size:10px; color:var(--muted);">Supplier: ${p.supplier}</span>` : ""}
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${p.hargaBeli > 0 ? `<span style="font-size:10px; color:var(--muted);">Modal: ${Verdict.formatRp(p.hargaBeli)}</span>` : ""}
        ${p.hargaJual > 0 ? `<span style="font-size:10px; color:var(--muted);">Jual: ${Verdict.formatRp(p.hargaJual)}</span>` : ""}
        ${margin > 0 ? `<span style="font-size:10px; color:var(--accent); font-weight:600;">Margin ${margin}%</span>` : ""}
        <span style="font-size:10px; color:var(--muted);">Min: ${min} unit</span>
      </div>
    </div>
    <div style="text-align:right; flex-shrink:0;">
      <div style="font-family:'Playfair Display',serif; font-size:22px; color:var(--brown); line-height:1;">${p.stok}</div>
      <div style="font-size:10px; color:var(--muted);">unit</div>
    </div>
  </div>
  <div style="display:flex; align-items:center; justify-content:space-between;">
    <span style="font-size:10px; font-weight:700; padding:3px 9px; border-radius:8px; background:${statusBg}; color:${statusColor};">${statusLabel}</span>
    <div style="display:flex; gap:6px;">
      <button onclick="bukaGerakForm(${p.id})" style="padding:6px 12px; background:var(--accent); color:white; border:none; border-radius:8px; font-size:11px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer;">Catat Gerak</button>
      <button onclick="hapusProduk(${p.id})" style="padding:6px 10px; background:transparent; border:1.5px solid rgba(100,60,30,0.15); border-radius:8px; font-size:12px; color:var(--muted); cursor:pointer;">×</button>
    </div>
  </div>
</div>
    `;
    })
    .join("");
}

function bukaGerakForm(produkId) {
  activeGerakId = produkId;
  const produk = stokProduk.find((p) => p.id === produkId);
  document.getElementById("stok-gerak-nama").textContent = produk.nama;
  document.getElementById("stok-gerak-form").style.display = "block";
  document.getElementById("stok-gerak-harga-beli").placeholder =
    produk.hargaBeli > 0
      ? `Harga beli saat ini: ${Verdict.formatRp(produk.hargaBeli)}`
      : "Harga beli baru (Rp)";
  document.getElementById("stok-gerak-supplier").value =
    produk.supplier || "";
  setGerakType("masuk");
  [
    "stok-gerak-jumlah",
    "stok-gerak-note",
    "stok-gerak-nota",
    "stok-gerak-harga-beli",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document
    .getElementById("stok-gerak-form")
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

function tutupGerakForm() {
  document.getElementById("stok-gerak-form").style.display = "none";
  activeGerakId = null;
}

function setGerakType(type) {
  gerakType = type;
  document.getElementById("gerak-btn-masuk").className =
    "type-btn" + (type === "masuk" ? " active-masuk" : "");
  document.getElementById("gerak-btn-keluar").className =
    "type-btn" + (type === "keluar" ? " active-keluar" : "");
  document.getElementById("stok-gerak-supplier-section").style.display =
    type === "masuk" ? "block" : "none";
  const sel = document.getElementById("stok-gerak-alasan");
  sel.innerHTML = '<option value="">Alasan...</option>';
  (type === "masuk" ? ALASAN_MASUK : ALASAN_KELUAR).forEach((a) => {
    const o = document.createElement("option");
    o.value = a;
    o.textContent = a;
    sel.appendChild(o);
  });
}

function catatPergerakan() {
  const alasan = document.getElementById("stok-gerak-alasan").value;
  const jumlah =
    parseInt(document.getElementById("stok-gerak-jumlah").value) || 0;
  const note = document.getElementById("stok-gerak-note").value.trim();
  const nota = document.getElementById("stok-gerak-nota").value.trim();
  const supplier = document
    .getElementById("stok-gerak-supplier")
    .value.trim();
  const hargaBeliBaru =
    parseFloat(document.getElementById("stok-gerak-harga-beli").value) ||
    0;

  if (!alasan || jumlah <= 0) {
    alert("Lengkapi alasan dan jumlah ya!");
    return;
  }

  const produk = stokProduk.find((p) => p.id === activeGerakId);
  if (!produk) return;

  if (gerakType === "keluar" && jumlah > produk.stok) {
    alert(
      `Stok tidak cukup! Stok ${produk.nama} saat ini: ${produk.stok} unit.`,
    );
    return;
  }

  if (
    gerakType === "masuk" &&
    hargaBeliBaru > 0 &&
    hargaBeliBaru !== produk.hargaBeli
  ) {
    historiHarga.unshift({
      id: Date.now(),
      produkId: produk.id,
      produkNama: produk.nama,
      hargaLama: produk.hargaBeli,
      hargaBaru: hargaBeliBaru,
      date: new Date().toISOString().slice(0, 10),
      supplier,
      nota,
    });
    produk.hargaBeli = hargaBeliBaru;
  }
  if (gerakType === "masuk" && supplier) produk.supplier = supplier;

  produk.stok += gerakType === "masuk" ? jumlah : -jumlah;
  stokRiwayat.unshift({
    id: Date.now(),
    produkId: activeGerakId,
    produkNama: produk.nama,
    type: gerakType,
    alasan,
    jumlah,
    note,
    supplier,
    nota,
    date: new Date().toISOString().slice(0, 10),
  });

  tutupGerakForm();
  renderStok();
  renderRiwayat();
  renderHistoriHarga();
  updateStokStats();
  saveToLocal();
}

function renderRiwayat() {
  const container = document.getElementById("stok-riwayat");
  if (stokRiwayat.length === 0) {
    container.innerHTML =
      '<div class="keu-empty">Belum ada pergerakan stok tercatat.</div>';
    return;
  }
  container.innerHTML = stokRiwayat
    .slice(0, 30)
    .map(
      (r) => `
    <div class="keu-entry">
<div class="keu-entry-dot ${r.type === "masuk" ? "dot-masuk" : "dot-keluar"}"></div>
<div class="keu-entry-body">
  <div class="keu-entry-cat">${r.produkNama}</div>
  <div class="keu-entry-note">${r.alasan}${r.nota ? " · Nota: " + r.nota : ""}${r.supplier ? " · " + r.supplier : ""}${r.note ? " · " + r.note : ""}</div>
  <div class="keu-entry-date">${Verdict.formatDate(r.date)}</div>
</div>
<div class="keu-entry-amount ${r.type === "masuk" ? "amount-masuk" : "amount-keluar"}">${r.type === "masuk" ? "+" : "-"}${r.jumlah} unit</div>
    </div>
  `,
    )
    .join("");
}

function renderHistoriHarga() {
  const container = document.getElementById("histori-harga-list");
  if (historiHarga.length === 0) {
    container.innerHTML =
      '<div class="keu-empty">Harga beli yang berubah saat restock akan tercatat di sini.</div>';
    return;
  }
  container.innerHTML = historiHarga
    .map(
      (h) => `
    <div class="keu-entry">
<div class="keu-entry-dot dot-keluar"></div>
<div class="keu-entry-body">
  <div class="keu-entry-cat">${h.produkNama}</div>
  <div class="keu-entry-note">${h.hargaLama > 0 ? Verdict.formatRp(h.hargaLama) + " → " : "Harga awal: "}${Verdict.formatRp(h.hargaBaru)}${h.supplier ? " · " + h.supplier : ""}${h.nota ? " · Nota: " + h.nota : ""}</div>
  <div class="keu-entry-date">${Verdict.formatDate(h.date)}</div>
</div>
<div class="keu-entry-amount" style="color:var(--accent); font-size:12px; font-weight:700;">${Verdict.formatRp(h.hargaBaru)}</div>
    </div>
  `,
    )
    .join("");
}

function updateStokStats() {
  const totalProduk = stokProduk.length;
  const totalItem = stokProduk.reduce((s, p) => s + p.stok, 0);
  const warning = stokProduk.filter(
    (p) => p.stok <= (p.minimum || 5),
  ).length;
  const nilaiStok = stokProduk.reduce(
    (s, p) => s + p.stok * p.hargaBeli,
    0,
  );

  document.getElementById("stok-total-produk").textContent = totalProduk;
  document.getElementById("stok-total-item").textContent = totalItem;
  document.getElementById("stok-warning").textContent = warning;
  document.getElementById("stok-nilai").textContent = Verdict.formatRp(nilaiStok);

  const alertBox = document.getElementById("stok-alert-box");
  const kritis = stokProduk.filter((p) => p.stok <= (p.minimum || 5));
  if (kritis.length > 0) {
    alertBox.style.display = "block";
    document.getElementById("stok-alert-list").innerHTML = kritis
      .map(
        (p) =>
          `<b>${p.nama}</b>${p.sku ? " (" + p.sku + ")" : ""} — sisa <b>${p.stok} unit</b>, minimum: ${p.minimum || 5} unit`,
      )
      .join("<br>");
  } else {
    alertBox.style.display = "none";
  }
  
}

function hapusProduk(id) {
  if (!confirm("Hapus produk ini?")) return;
  stokProduk = stokProduk.filter((p) => p.id !== id);
  stokRiwayat = stokRiwayat.filter((r) => r.produkId !== id);
  historiHarga = historiHarga.filter((h) => h.produkId !== id);
  renderStok();
  renderRiwayat();
  renderHistoriHarga();
  updateStokStats();
  saveToLocal();
}

function resetStok() {
  if (!confirm("Hapus semua data stok?")) return;
  stokProduk = [];
  stokRiwayat = [];
  historiHarga = [];
  renderStok();
  renderRiwayat();
  renderHistoriHarga();
  updateStokStats();
  saveToLocal();
}

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
      p.stok > Math.floor((p.minimum || 5) / 2) &&
      p.stok <= (p.minimum || 5),
  );
  const aman = stokProduk.filter((p) => p.stok > (p.minimum || 5));
  const nilaiStok = stokProduk.reduce(
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
      keluarCount[r.produkNama] =
        (keluarCount[r.produkNama] || 0) + r.jumlah;
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
    kondisi = `✅ Semua <b>${aman.length} produk</b> stoknya aman. Nilai stok: <b>${Verdict.formatRp(nilaiStok)}</b>.`;

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
          .map(
            (t, i) => `${i + 1}. <b>${t[0]}</b> — ${t[1]} unit terjual`,
          )
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
    aksi.push(
      `Siapkan PO untuk: ${kritis.map((p) => p.nama).join(", ")}.`,
    );
  if (potensiOmzet > 0)
    aksi.push(
      `Potensi omzet dari stok saat ini: <b>${Verdict.formatRp(potensiOmzet)}</b>.`,
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

  const html = `
    <div style="margin-bottom:14px;"><div style="font-size:10px;font-weight:700;color:var(--accent);letter-spacing:0.5px;margin-bottom:5px;">KONDISI STOK</div><div style="font-size:13px;line-height:1.7;">${kondisi}</div></div>
    <div style="height:1px;background:var(--border);margin:12px 0;"></div>
    <div style="margin-bottom:14px;"><div style="font-size:10px;font-weight:700;color:var(--accent);letter-spacing:0.5px;margin-bottom:5px;">PRODUK PERLU RESTOCK</div><div style="font-size:12.5px;line-height:1.8;">${darurat}</div></div>
    <div style="height:1px;background:var(--border);margin:12px 0;"></div>
    <div style="margin-bottom:14px;"><div style="font-size:10px;font-weight:700;color:var(--accent);letter-spacing:0.5px;margin-bottom:5px;">PRODUK TERLARIS</div><div style="font-size:12.5px;line-height:1.8;">${terlaris}</div></div>
    <div style="height:1px;background:var(--border);margin:12px 0;"></div>
    <div><div style="font-size:10px;font-weight:700;color:var(--accent);letter-spacing:0.5px;margin-bottom:6px;">AKSI YANG PERLU DILAKUKAN</div>
<div style="display:flex;flex-direction:column;gap:8px;">
  ${aksi
    .slice(0, 3)
    .map(
      (a, i) =>
        `<div style="display:flex;gap:10px;align-items:flex-start;"><div style="width:20px;height:20px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:white;flex-shrink:0;margin-top:1px;">${i + 1}</div><div style="font-size:12.5px;line-height:1.6;">${a}</div></div>`,
    )
    .join("")}
</div>
    </div>
  `;

  document.getElementById("rekap-stok-result").style.display = "block";
  document.getElementById("rekap-stok-content").innerHTML = html;
  const now = new Date();
  document.getElementById("rekap-stok-timestamp").textContent =
    `${now.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][now.getMonth()]} ${now.getFullYear()}`;
}

function saveToLocal() {
  Verdict.patch({ stokProduk, stokRiwayat, historiHarga });
}

(function initStock() {
  const d = Verdict.read();
  stokProduk = d.stokProduk || [];
  stokRiwayat = d.stokRiwayat || [];
  historiHarga = d.historiHarga || [];
  renderStok();
  renderRiwayat();
  renderHistoriHarga();
  updateStokStats();
})();

