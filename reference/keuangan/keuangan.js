// ===== KEUANGAN =====
const KAT_MASUK = [
  "Penjualan Produk",
  "Refund Diterima",
  "Bonus / Insentif Platform",
  "Penjualan Affiliate",
  "Lainnya (Masuk)",
];
const KAT_KELUAR = [
  "Modal / Stok Produk",
  "Biaya Iklan",
  "Packaging & Packing",
  "Ongkir",
  "Fee Platform",
  "Gaji / Upah",
  "Operasional",
  "Lainnya (Keluar)",
];

let keuType = "masuk";
let keuEntries = [];
let keuFilter = "semua";

function setType(type) {
  keuType = type;
  document.getElementById("btn-masuk").className =
    "type-btn" + (type === "masuk" ? " active-masuk" : "");
  document.getElementById("btn-keluar").className =
    "type-btn" + (type === "keluar" ? " active-keluar" : "");
  const sel = document.getElementById("keu-kategori");
  sel.innerHTML = '<option value="">Pilih Kategori...</option>';
  const list = type === "masuk" ? KAT_MASUK : KAT_KELUAR;
  list.forEach((k) => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = k;
    sel.appendChild(o);
  });
}

function addEntry() {
  const kat = document.getElementById("keu-kategori").value;
  const note = document.getElementById("keu-note").value.trim();
  const amount = parseFloat(document.getElementById("keu-amount").value);
  const date = document.getElementById("keu-date").value;

  if (!kat || !amount || amount <= 0) {
    alert("Lengkapi kategori dan nominal ya!");
    return;
  }

  const entry = {
    id: Date.now(),
    type: keuType,
    kategori: kat,
    note: note || kat,
    amount: amount,
    date: date || new Date().toISOString().slice(0, 10),
  };
  keuEntries.unshift(entry);
  renderEntries();
  updateKeuStats();
  saveToLocal();

  document.getElementById("keu-note").value = "";
  document.getElementById("keu-amount").value = "";
}

function deleteEntry(id) {
  keuEntries = keuEntries.filter((e) => e.id !== id);
  renderEntries();
  updateKeuStats();
  saveToLocal();
}

function filterEntries(f, btn) {
  keuFilter = f;
  document
    .querySelectorAll(".keu-filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderEntries();
}

function renderEntries() {
  const container = document.getElementById("keu-entries");
  const filtered =
    keuFilter === "semua"
      ? keuEntries
      : keuEntries.filter((e) => e.type === keuFilter);

  if (filtered.length === 0) {
    container.innerHTML =
      '<div class="keu-empty">Belum ada catatan.<br>Mulai catat transaksi pertama bisnis kamu 👆</div>';
    return;
  }

  container.innerHTML = filtered
    .map(
      (e) => `
    <div class="keu-entry">
<div class="keu-entry-dot ${e.type === "masuk" ? "dot-masuk" : "dot-keluar"}"></div>
<div class="keu-entry-body">
  <div class="keu-entry-cat">${e.kategori}</div>
  <div class="keu-entry-note">${e.note}</div>
  <div class="keu-entry-date">${Verdict.formatDate(e.date)}</div>
</div>
<div class="keu-entry-amount ${e.type === "masuk" ? "amount-masuk" : "amount-keluar"}">
  ${e.type === "masuk" ? "+" : "-"}${Verdict.formatRp(e.amount)}
</div>
<button class="keu-delete" onclick="deleteEntry(${e.id})">×</button>
    </div>
  `,
    )
    .join("");
}

function updateKeuStats() {
  const masuk = keuEntries
    .filter((e) => e.type === "masuk")
    .reduce((s, e) => s + e.amount, 0);
  const keluar = keuEntries
    .filter((e) => e.type === "keluar")
    .reduce((s, e) => s + e.amount, 0);
  const profit = masuk - keluar;

  document.getElementById("keu-total-masuk").textContent =
    Verdict.formatRp(masuk);
  document.getElementById("keu-total-keluar").textContent =
    Verdict.formatRp(keluar);
  const profitEl = document.getElementById("keu-profit");
  profitEl.textContent = (profit >= 0 ? "+" : "") + Verdict.formatRp(profit);
  profitEl.className = "keu-stat-val " + (profit >= 0 ? "green" : "red");

  const total = masuk + keluar;
  if (total > 0) {
    document.getElementById("keu-chart").style.display = "block";
    document.getElementById("bar-masuk-label").textContent =
      Verdict.formatRp(masuk);
    document.getElementById("bar-keluar-label").textContent =
      Verdict.formatRp(keluar);
    document.getElementById("bar-masuk").style.width =
      Math.round((masuk / total) * 100) + "%";
    document.getElementById("bar-keluar").style.width =
      Math.round((keluar / total) * 100) + "%";
  } else {
    document.getElementById("keu-chart").style.display = "none";
  }

  if (masuk > 0) {
    document.getElementById("keu-health").style.display = "block";

    const margin = Math.max(0, Math.round((profit / masuk) * 100));
    const marginBar = document.getElementById("h-margin-bar");
    marginBar.style.width = Math.min(margin, 100) + "%";
    marginBar.className =
      "health-fill " +
      (margin >= 20 ? "hf-green" : margin >= 10 ? "hf-yellow" : "hf-red");
    document.getElementById("h-margin-val").textContent =
      margin + "% " + (margin >= 20 ? "✅" : margin >= 10 ? "⚠️" : "❌");

    const iklanKeluar = keuEntries
      .filter((e) => e.type === "keluar" && e.kategori === "Biaya Iklan")
      .reduce((s, e) => s + e.amount, 0);
    const iklanRatio = Math.round((iklanKeluar / masuk) * 100);
    const iklanBar = document.getElementById("h-iklan-bar");
    iklanBar.style.width = Math.min(iklanRatio * 2, 100) + "%";
    iklanBar.className =
      "health-fill " +
      (iklanRatio <= 20
        ? "hf-green"
        : iklanRatio <= 35
          ? "hf-yellow"
          : "hf-red");
    document.getElementById("h-iklan-val").textContent =
      iklanRatio +
      "% dari omzet " +
      (iklanRatio <= 20 ? "✅" : iklanRatio <= 35 ? "⚠️" : "❌");

    const opsKeluar = keuEntries
      .filter(
        (e) =>
          e.type === "keluar" &&
          !["Biaya Iklan", "Modal / Stok Produk"].includes(e.kategori),
      )
      .reduce((s, e) => s + e.amount, 0);
    const opsRatio = Math.round((opsKeluar / masuk) * 100);
    const opsBar = document.getElementById("h-ops-bar");
    opsBar.style.width = Math.min(opsRatio * 2, 100) + "%";
    opsBar.className =
      "health-fill " +
      (opsRatio <= 20
        ? "hf-green"
        : opsRatio <= 35
          ? "hf-yellow"
          : "hf-red");
    document.getElementById("h-ops-val").textContent =
      opsRatio +
      "% dari omzet " +
      (opsRatio <= 20 ? "✅" : opsRatio <= 35 ? "⚠️" : "❌");
  } else {
    document.getElementById("keu-health").style.display = "none";
  }
}

function resetKeuangan() {
  if (confirm("Hapus semua catatan keuangan?")) {
    keuEntries = [];
    renderEntries();
    updateKeuStats();
    saveToLocal();
  }
}
// ===== HPP CALCULATOR =====
let hppTab = "reseller";
let iklanAutoMode = false;
let iklanAutoVal = 0;

function toggleIklanMode() {
  iklanAutoMode = !iklanAutoMode;
  const toggle = document.getElementById("iklan-toggle");
  const dot = document.getElementById("iklan-toggle-dot");
  toggle.style.background = iklanAutoMode
    ? "var(--accent)"
    : "rgba(100,60,30,0.15)";
  dot.style.left = iklanAutoMode ? "19px" : "3px";
  document.getElementById("iklan-manual").style.display = iklanAutoMode
    ? "none"
    : "block";
  document.getElementById("iklan-auto").style.display = iklanAutoMode
    ? "block"
    : "none";
  calcHPP();
}

function calcIklanAuto() {
  const budget =
    parseFloat(document.getElementById("hpp-budget-hari").value) || 0;
  const target =
    parseFloat(document.getElementById("hpp-target-order").value) || 0;
  const resultEl = document.getElementById("iklan-auto-result");
  if (!budget || !target) {
    resultEl.style.display = "none";
    iklanAutoVal = 0;
    calcHPP();
    return;
  }
  iklanAutoVal = Math.round(budget / target);
  resultEl.style.display = "block";
  document.getElementById("iklan-auto-val").textContent =
    "Rp " + iklanAutoVal.toLocaleString("id");
  let note = `Dari budget Rp ${budget.toLocaleString("id")}/hari dibagi ${target} order target. `;
  if (iklanAutoVal <= 3000)
    note += "✅ Biaya iklan per item sangat efisien.";
  else if (iklanAutoVal <= 8000)
    note +=
      "⚠️ Masih wajar — pastikan margin produk di atas Rp " +
      (iklanAutoVal * 3).toLocaleString("id") +
      " per item.";
  else
    note +=
      "🚨 Biaya iklan cukup tinggi per item. Pertimbangkan optimalkan iklan atau naikkan target order.";
  document.getElementById("iklan-auto-note").textContent = note;
  calcHPP();
}

function pakaiBiayaIklan() {
  iklanAutoMode = false;
  document.getElementById("iklan-toggle").style.background =
    "rgba(100,60,30,0.15)";
  document.getElementById("iklan-toggle-dot").style.left = "3px";
  document.getElementById("iklan-manual").style.display = "block";
  document.getElementById("iklan-auto").style.display = "none";
  document.getElementById("hpp-iklan").value = iklanAutoVal;
  iklanAutoVal = 0;
  calcHPP();
}

function hppSetTab(tab) {
  hppTab = tab;
  document.getElementById("hpp-reseller").style.display =
    tab === "reseller" ? "block" : "none";
  document.getElementById("hpp-produksi").style.display =
    tab === "produksi" ? "block" : "none";
  document.getElementById("hpp-tab-reseller").className =
    "type-btn" + (tab === "reseller" ? " active-masuk" : "");
  document.getElementById("hpp-tab-produksi").className =
    "type-btn" + (tab === "produksi" ? " active-masuk" : "");
  calcHPP();
}

function calcHPP() {
  const g = (id) => parseFloat(document.getElementById(id)?.value) || 0;
  let modalDasar = 0;
  const breakdown = [];

  if (hppTab === "reseller") {
    const beli = g("hpp-beli"),
      ongkirSup = g("hpp-ongkir-sup");
    modalDasar = beli + ongkirSup;
    if (beli) breakdown.push({ label: "Harga beli produk", val: beli });
    if (ongkirSup)
      breakdown.push({ label: "Ongkir dari supplier", val: ongkirSup });
  } else {
    const bahan = g("hpp-bahan"),
      tenaga = g("hpp-tenaga"),
      overhead = g("hpp-overhead");
    modalDasar = bahan + tenaga + overhead;
    if (bahan) breakdown.push({ label: "Bahan baku", val: bahan });
    if (tenaga) breakdown.push({ label: "Tenaga kerja", val: tenaga });
    if (overhead)
      breakdown.push({ label: "Overhead / listrik", val: overhead });
  }

  const pack = g("hpp-pack"),
    bubble = g("hpp-bubble"),
    jual = g("hpp-jual");
  const feePct = g("hpp-fee-pct"),
    ongkirSub = g("hpp-ongkir-sub");
  const iklan = iklanAutoMode
    ? iklanAutoVal
    : parseFloat(document.getElementById("hpp-iklan")?.value) || 0;
  const feePlatform = jual * (feePct / 100);

  if (pack) breakdown.push({ label: "Packaging", val: pack });
  if (bubble)
    breakdown.push({ label: "Bubble wrap / lakban", val: bubble });
  if (ongkirSub)
    breakdown.push({ label: "Subsidi ongkir", val: ongkirSub });
  if (feePct && jual)
    breakdown.push({
      label: `Fee platform (${feePct}%)`,
      val: Math.round(feePlatform),
    });
  if (iklan)
    breakdown.push({ label: "Biaya iklan per item", val: iklan });

  const hpp =
    modalDasar + pack + bubble + ongkirSub + feePlatform + iklan;
  const profit = jual - hpp;
  const margin = jual > 0 ? Math.round((profit / jual) * 100) : 0;
  const hargaMin = Math.ceil(hpp * 1.15);

  if (modalDasar === 0 && !pack && !bubble) {
    document.getElementById("hpp-result").style.display = "none";
    return;
  }

  document.getElementById("hpp-result").style.display = "block";
  document.getElementById("hpp-total-val").textContent =
    "Rp " + Math.round(hpp).toLocaleString("id");

  const profitEl = document.getElementById("hpp-profit-val");
  profitEl.textContent =
    (profit >= 0 ? "+" : "") +
    "Rp " +
    Math.round(profit).toLocaleString("id");
  profitEl.style.color = profit >= 0 ? "#40c07a" : "#e8783a";

  const marginEl = document.getElementById("hpp-margin-val");
  marginEl.textContent = margin + "%";
  marginEl.style.color =
    margin >= 20 ? "#40c07a" : margin >= 10 ? "#e8c840" : "#e8783a";

  document.getElementById("hpp-min-val").textContent =
    "Rp " + hargaMin.toLocaleString("id");

  // Color palette per komponen
  const colorMap = [
    "#c4783a", // accent/brown - modal utama
    "#8b4a1e", // mid brown
    "#5c2d10", // warm
    "#3a7ca5", // blue - packaging
    "#2d8a5e", // green - ongkir
    "#9b59b6", // purple - fee
    "#e67e22", // orange - iklan
    "#1a6b4a", // dark green
  ];

  document.getElementById("hpp-breakdown-total-label").textContent =
    "Total: Rp " + Math.round(hpp).toLocaleString("id");

  // Jika ada harga jual, tambahin juga "Profit" sebagai segmen di visual bar
  const showProfit = jual > 0 && profit > 0;
  const totalBar = showProfit ? jual : hpp;

  // Visual stacked bar di atas
  const stackedSegments = breakdown
    .map((b, i) => {
      const pct = totalBar > 0 ? (b.val / totalBar) * 100 : 0;
      return `<div style="height:100%; width:${pct.toFixed(1)}%; background:${colorMap[i % colorMap.length]}; transition:width 0.5s;" title="${b.label}: Rp ${Math.round(b.val).toLocaleString("id")}"></div>`;
    })
    .join("");

  const profitPct = showProfit ? (profit / totalBar) * 100 : 0;
  const profitSegment = showProfit
    ? `<div style="height:100%; width:${profitPct.toFixed(1)}%; background:#1a6b4a; opacity:0.85;" title="Profit: Rp ${Math.round(profit).toLocaleString("id")}"></div>`
    : "";

  const stackedBar = `
    <div style="display:flex; height:14px; border-radius:8px; overflow:hidden; margin-bottom:14px; gap:1px; background:rgba(100,60,30,0.08);">
${stackedSegments}${profitSegment}
    </div>
  `;

  // Per-komponen row dengan bar individual
  const rowsHTML = breakdown
    .map((b, i) => {
      const pct = hpp > 0 ? Math.round((b.val / hpp) * 100) : 0;
      const color = colorMap[i % colorMap.length];
      const barWidth = Math.max(pct, 3);
      return `
<div style="margin-bottom:2px;">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
    <div style="display:flex; align-items:center; gap:7px;">
      <div style="width:10px; height:10px; border-radius:3px; background:${color}; flex-shrink:0;"></div>
      <span style="font-size:12px; color:var(--text);">${b.label}</span>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-size:10px; color:var(--muted); font-weight:600;">${pct}%</span>
      <span style="font-size:12px; font-weight:700; color:var(--text); min-width:60px; text-align:right;">Rp ${Math.round(b.val).toLocaleString("id")}</span>
    </div>
  </div>
  <div style="height:5px; background:rgba(100,60,30,0.08); border-radius:3px; overflow:hidden;">
    <div style="height:100%; width:${barWidth}%; background:${color}; border-radius:3px; transition:width 0.5s cubic-bezier(0.4,0,0.2,1);"></div>
  </div>
</div>
    `;
    })
    .join("");

  // Baris profit (kalau ada harga jual)
  const profitRow = showProfit
    ? `
    <div style="margin-bottom:2px; margin-top:4px; padding-top:10px; border-top:1px dashed rgba(100,60,30,0.12);">
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
  <div style="display:flex; align-items:center; gap:7px;">
    <div style="width:10px; height:10px; border-radius:3px; background:#1a6b4a; flex-shrink:0;"></div>
    <span style="font-size:12px; color:#1a6b4a; font-weight:600;">Profit bersih</span>
  </div>
  <div style="display:flex; align-items:center; gap:8px;">
    <span style="font-size:10px; color:#1a6b4a; font-weight:600;">${Math.round(profitPct)}%</span>
    <span style="font-size:12px; font-weight:700; color:#1a6b4a; min-width:60px; text-align:right;">+Rp ${Math.round(profit).toLocaleString("id")}</span>
  </div>
</div>
<div style="height:5px; background:rgba(100,60,30,0.08); border-radius:3px; overflow:hidden;">
  <div style="height:100%; width:${Math.max(Math.round(profitPct), 3)}%; background:#1a6b4a; border-radius:3px; transition:width 0.5s;"></div>
</div>
    </div>
  `
    : "";

  document.getElementById("hpp-breakdown").innerHTML =
    stackedBar + rowsHTML + profitRow;

  const vEl = document.getElementById("hpp-verdict-box");
  if (!jual) {
    vEl.style.display = "none";
    return;
  }
  vEl.style.display = "block";
  if (margin >= 20) {
    vEl.style.background = "#d4f1e4";
    vEl.style.color = "#1a6b4a";
    vEl.textContent = `✅ Margin ${margin}% — sehat! Harga jual kamu sudah cukup baik. Jaga konsistensi dan cari cara turunkan HPP sedikit demi sedikit.`;
  } else if (margin >= 10) {
    vEl.style.background = "#fdf3d8";
    vEl.style.color = "#b88a1a";
    vEl.textContent = `⚠️ Margin ${margin}% — tipis. Pertimbangkan naikkan harga ke Rp ${hargaMin.toLocaleString("id")} untuk margin lebih sehat.`;
  } else if (margin >= 0) {
    vEl.style.background = "#fde8d8";
    vEl.style.color = "#b85c1a";
    vEl.textContent = `🚨 Margin hanya ${margin}% — sangat berisiko. Naikkan harga ke minimal Rp ${hargaMin.toLocaleString("id")} atau cari supplier lebih murah.`;
  } else {
    vEl.style.background = "#fde8d8";
    vEl.style.color = "#b85c1a";
    vEl.textContent = `❌ Harga jual di bawah HPP — kamu sedang RUGI Rp ${Math.abs(Math.round(profit)).toLocaleString("id")} per item! Harga jual minimum yang aman: Rp ${hargaMin.toLocaleString("id")}.`;
  }
}
// ===== REKAP MINGGUAN (rule-based) =====
function generateRekap() {
  if (keuEntries.length === 0) {
    alert("Belum ada transaksi yang dicatat. Tambahkan dulu ya!");
    return;
  }

  const masuk = keuEntries
    .filter((e) => e.type === "masuk")
    .reduce((s, e) => s + e.amount, 0);
  const keluar = keuEntries
    .filter((e) => e.type === "keluar")
    .reduce((s, e) => s + e.amount, 0);
  const profit = masuk - keluar;
  const margin = masuk > 0 ? Math.round((profit / masuk) * 100) : 0;

  // Hitung per kategori keluar
  const byKat = {};
  keuEntries
    .filter((e) => e.type === "keluar")
    .forEach((e) => {
      byKat[e.kategori] = (byKat[e.kategori] || 0) + e.amount;
    });
  const topKeluar = Object.entries(byKat).sort((a, b) => b[1] - a[1]);
  const iklanKeluar = byKat["Biaya Iklan"] || 0;
  const modalKeluar = byKat["Modal / Stok Produk"] || 0;
  const iklanRatio =
    masuk > 0 ? Math.round((iklanKeluar / masuk) * 100) : 0;
  const modalRatio =
    masuk > 0 ? Math.round((modalKeluar / masuk) * 100) : 0;

  // ===== KONDISI MINGGU INI =====
  let kondisi = "";
  if (masuk === 0) {
    kondisi =
      "⚠️ Minggu ini belum ada pemasukan tercatat. Pastikan semua penjualan sudah dicatat ya.";
  } else if (margin >= 25) {
    kondisi = `✅ Kondisi keuangan minggu ini <b>sehat</b>. Profit bersih <b>${Verdict.formatRp(profit)}</b> dengan margin <b>${margin}%</b> — di atas target minimum 20%.`;
  } else if (margin >= 10) {
    kondisi = `⚠️ Kondisi keuangan <b>cukup</b>, tapi margin masih tipis di <b>${margin}%</b>. Profit bersih <b>${Verdict.formatRp(profit)}</b>. Ada ruang untuk dioptimasi.`;
  } else if (margin >= 0) {
    kondisi = `🚨 Margin minggu ini hanya <b>${margin}%</b> — sangat rentan. Profit bersih cuma <b>${Verdict.formatRp(profit)}</b> dari omzet <b>${Verdict.formatRp(masuk)}</b>.`;
  } else {
    kondisi = `❌ Minggu ini <b>merugi</b> sebesar <b>${Verdict.formatRp(Math.abs(profit))}</b>. Total keluar (<b>${Verdict.formatRp(keluar)}</b>) melebihi pemasukan (<b>${Verdict.formatRp(masuk)}</b>).`;
  }

  // ===== PENGELUARAN TERBESAR =====
  let pengeluaran = "";
  if (topKeluar.length === 0) {
    pengeluaran = "Belum ada pengeluaran tercatat minggu ini.";
  } else {
    const top = topKeluar[0];
    const topPct = masuk > 0 ? Math.round((top[1] / masuk) * 100) : 0;
    pengeluaran = `Pengeluaran terbesar: <b>${top[0]}</b> sebesar <b>${Verdict.formatRp(top[1])}</b> (${topPct}% dari omzet).`;
    if (top[0] === "Biaya Iklan" && topPct > 30) {
      pengeluaran +=
        " Porsi iklan cukup besar — pastikan ROAS-nya sepadan.";
    } else if (top[0] === "Modal / Stok Produk") {
      pengeluaran +=
        " Wajar — modal stok adalah investasi untuk penjualan berikutnya.";
    }
    if (topKeluar.length > 1) {
      pengeluaran += ` Disusul <b>${topKeluar[1][0]}</b> (${Verdict.formatRp(topKeluar[1][1])}).`;
    }
  }

  // ===== YANG PERLU DIPERHATIKAN =====
  const warnings = [];
  if (iklanRatio > 35)
    warnings.push(
      `🔴 Biaya iklan <b>${iklanRatio}%</b> dari omzet — terlalu tinggi. Idealnya maksimal 20–25%. Evaluasi ROAS iklan kamu.`,
    );
  else if (iklanRatio > 20)
    warnings.push(
      `🟡 Biaya iklan <b>${iklanRatio}%</b> dari omzet — masih wajar, tapi pantau terus supaya tidak membengkak.`,
    );
  else if (iklanRatio > 0)
    warnings.push(
      `🟢 Biaya iklan <b>${iklanRatio}%</b> dari omzet — efisien!`,
    );

  if (margin < 0)
    warnings.push(
      `🔴 Bisnis sedang rugi. Cek apakah ada biaya yang bisa dipangkas atau harga jual yang perlu dinaikkan.`,
    );
  else if (margin < 15 && masuk > 0)
    warnings.push(
      `🟡 Margin di bawah 15% — rentan terhadap kenaikan biaya. Pertimbangkan naikkan harga atau cari supplier lebih murah.`,
    );

  const opsKeluar = keuEntries
    .filter(
      (e) =>
        e.type === "keluar" &&
        !["Biaya Iklan", "Modal / Stok Produk"].includes(e.kategori),
    )
    .reduce((s, e) => s + e.amount, 0);
  const opsRatio = masuk > 0 ? Math.round((opsKeluar / masuk) * 100) : 0;
  if (opsRatio > 25)
    warnings.push(
      `🟡 Biaya operasional <b>${opsRatio}%</b> dari omzet — cukup tinggi. Review apakah ada pos yang bisa dihemat.`,
    );

  if (warnings.length === 0 && masuk > 0)
    warnings.push(
      `🟢 Semua rasio keuangan dalam batas normal. Pertahankan dan terus tingkatkan volume penjualan!`,
    );

  // ===== AKSI MINGGU DEPAN =====
  const aksi = [];
  if (margin < 20 && masuk > 0)
    aksi.push(
      `Hitung ulang HPP dan cek apakah ada komponen biaya yang bisa dikurangi.`,
    );
  if (iklanRatio > 25)
    aksi.push(
      `Evaluasi iklan yang sedang berjalan — matiin yang ROAS-nya di bawah 1.5x.`,
    );
  if (masuk > 0 && modalRatio < 30)
    aksi.push(
      `Pertimbangkan tambah variasi produk atau restock stok yang hampir habis.`,
    );
  if (keuEntries.filter((e) => e.type === "masuk").length < 3)
    aksi.push(
      `Aktifkan lebih banyak channel penjualan — share produk ke sosmed atau ikut flash sale.`,
    );
  aksi.push(
    `Rekap keuangan lagi minggu depan dan bandingkan dengan minggu ini.`,
  );

  // ===== RENDER =====
  const html = `
    <div style="margin-bottom:14px;">
<div style="font-size:10px; font-weight:700; color:var(--accent); letter-spacing:0.5px; margin-bottom:5px;">KONDISI MINGGU INI</div>
<div style="font-size:13px; line-height:1.7; color:var(--text);">${kondisi}</div>
    </div>
    <div style="height:1px; background:var(--border); margin:12px 0;"></div>
    <div style="margin-bottom:14px;">
<div style="font-size:10px; font-weight:700; color:var(--accent); letter-spacing:0.5px; margin-bottom:5px;">PENGELUARAN TERBESAR</div>
<div style="font-size:13px; line-height:1.7; color:var(--text);">${pengeluaran}</div>
    </div>
    <div style="height:1px; background:var(--border); margin:12px 0;"></div>
    <div style="margin-bottom:14px;">
<div style="font-size:10px; font-weight:700; color:var(--accent); letter-spacing:0.5px; margin-bottom:6px;">YANG PERLU DIPERHATIKAN</div>
<div style="display:flex; flex-direction:column; gap:6px;">
  ${warnings.map((w) => `<div style="font-size:12.5px; line-height:1.6; color:var(--text);">${w}</div>`).join("")}
</div>
    </div>
    <div style="height:1px; background:var(--border); margin:12px 0;"></div>
    <div>
<div style="font-size:10px; font-weight:700; color:var(--accent); letter-spacing:0.5px; margin-bottom:6px;">AKSI MINGGU DEPAN</div>
<div style="display:flex; flex-direction:column; gap:6px;">
  ${aksi
    .slice(0, 3)
    .map(
      (a, i) => `
    <div style="display:flex; gap:10px; align-items:flex-start;">
      <div style="width:20px; height:20px; background:var(--accent); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:white; flex-shrink:0; margin-top:1px;">${i + 1}</div>
      <div style="font-size:12.5px; line-height:1.6; color:var(--text);">${a}</div>
    </div>
  `,
    )
    .join("")}
</div>
    </div>
  `;

  document.getElementById("rekap-result").style.display = "block";
  document.getElementById("rekap-content").innerHTML = html;

  const now = new Date();
  document.getElementById("rekap-timestamp").textContent =
    `${now.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][now.getMonth()]} ${now.getFullYear()}`;
}

function saveToLocal() {
  Verdict.patch({ keuEntries });
}

(function initKeuangan() {
  const d = Verdict.read();
  keuEntries = d.keuEntries || [];
  setType("masuk");
  renderEntries();
  updateKeuStats();
})();

