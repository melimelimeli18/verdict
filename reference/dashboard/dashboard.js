
function updateDashboard() {
  const d = Verdict.read();
  const keuEntries = d.keuEntries || [];
  const stokProduk = d.stokProduk || [];
  const checklist = d.checklist || [];

  const now = new Date();
  const days = [
    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
  ];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  document.getElementById("dash-date").textContent =
    `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const masuk = keuEntries
    .filter((e) => e.type === "masuk")
    .reduce((s, e) => s + e.amount, 0);
  const keluar = keuEntries
    .filter((e) => e.type === "keluar")
    .reduce((s, e) => s + e.amount, 0);
  const profit = masuk - keluar;
  const margin = masuk > 0 ? Math.round((profit / masuk) * 100) : 0;
  document.getElementById("dash-masuk").textContent = Verdict.formatRp(masuk);
  const profitEl = document.getElementById("dash-profit");
  profitEl.textContent = (profit >= 0 ? "+" : "") + Verdict.formatRp(profit);
  profitEl.className = "keu-stat-val " + (profit >= 0 ? "green" : "red");
  const marginEl = document.getElementById("dash-margin");
  marginEl.textContent = margin + "%";
  marginEl.className =
    "keu-stat-val " + (margin >= 20 ? "green" : margin >= 10 ? "" : "red");

  const done = checklist.filter(Boolean).length;
  const total = checklist.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("dash-pct").textContent = pct + "%";
  document.getElementById("dash-progress-bar").style.width = pct + "%";
  document.getElementById("dash-progress-text").textContent =
    `${done} dari ${total} langkah selesai`;

  const totalProduk = stokProduk.length;
  const totalItem = stokProduk.reduce((s, p) => s + p.stok, 0);
  const nilaiStok = stokProduk.reduce((s, p) => s + p.stok * p.hargaBeli, 0);
  const kritis = stokProduk.filter((p) => p.stok <= (p.minimum || 5));
  document.getElementById("dash-total-produk").textContent = totalProduk;
  document.getElementById("dash-total-item").textContent = totalItem;
  document.getElementById("dash-nilai-stok").textContent =
    Verdict.formatRp(nilaiStok);
  document.getElementById("dash-stok-kritis").textContent = kritis.length;
  const stokAlert = document.getElementById("dash-stok-alert");
  if (kritis.length > 0) {
    stokAlert.style.display = "block";
    stokAlert.textContent = `Perlu restock: ${kritis.map((p) => p.nama).join(", ")}`;
  } else {
    stokAlert.style.display = "none";
  }

  const byKat = {};
  keuEntries
    .filter((e) => e.type === "keluar")
    .forEach((e) => {
      byKat[e.kategori] = (byKat[e.kategori] || 0) + e.amount;
    });
  const topKeluar = Object.entries(byKat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const topEl = document.getElementById("dash-top-keluar");
  if (topKeluar.length === 0) {
    topEl.innerHTML =
      '<div style="padding:16px; text-align:center; color:var(--muted); font-size:12px;">Belum ada data pengeluaran.</div>';
  } else {
    const maxVal = topKeluar[0][1];
    topEl.innerHTML = topKeluar
      .map(
        ([kat, val]) => `
      <div style="padding:10px 16px; border-bottom:1px solid rgba(100,60,30,0.05);">
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
          <span style="font-size:12px; color:var(--text); font-weight:500;">${kat}</span>
          <span style="font-size:12px; font-weight:700; color:var(--accent);">${Verdict.formatRp(val)}</span>
        </div>
        <div style="height:4px; background:rgba(100,60,30,0.08); border-radius:3px; overflow:hidden;">
          <div style="height:100%; width:${Math.round((val / maxVal) * 100)}%; background:linear-gradient(90deg,var(--accent),var(--gold)); border-radius:3px;"></div>
        </div>
      </div>
    `,
      )
      .join("");
  }
}

updateDashboard();

