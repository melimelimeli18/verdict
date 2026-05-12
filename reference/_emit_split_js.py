#!/usr/bin/env python3
"""Build page JS bundles from _extracted_app.js"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
src = (ROOT / "_extracted_app.js").read_text(encoding="utf-8").splitlines()


def strip_line(ln: str) -> str:
    return ln[6:] if ln.startswith("      ") else ln


def slice_lines(a: int, b: int) -> str:
    """1-based inclusive."""
    return "\n".join(strip_line(x) for x in src[a - 1 : b])


# panduan: checklist + Q&A (no localstorage block)
panduan = slice_lines(13, 76)
panduan = panduan.replace("saveToLocal();", "saveChecklistState();")

panduan += """

function saveChecklistState() {
  const items = document.querySelectorAll("#page-checklist .check-item");
  Verdict.patch({
    checklist: Array.from(items).map((el) => el.classList.contains("done")),
  });
}

(function initPanduan() {
  const d = Verdict.read();
  const items = document.querySelectorAll("#page-checklist .check-item");
  if (d.checklist && d.checklist.length === items.length) {
    d.checklist.forEach((done, i) => {
      if (items[i] && done) items[i].classList.add("done");
    });
  } else {
    Verdict.patch({
      checklist: Array.from(items).map((el) => el.classList.contains("done")),
    });
  }
  const _origToggle = toggle;
  window.toggle = function (el) {
    _origToggle(el);
    saveChecklistState();
  };
  updateStats();
})();
"""

# iklan: ROAS + rekap iklan
iklan = slice_lines(77, 116) + "\n" + slice_lines(1578, len(src))

# keuangan: keu + HPP + weekly generateRekap (NOT stock block 625+)
keu_parts = (
    slice_lines(117, 330)
    + "\n"
    + slice_lines(358, 623)
    + "\n"
    + slice_lines(1219, 1392)
)
keu_parts = keu_parts.replace("formatRp(", "Verdict.formatRp(")
keu_parts = keu_parts.replace("formatDate(", "Verdict.formatDate(")
keu_parts = re.sub(r"\n\s*updateDashboard\(\);\n", "\n", keu_parts, count=1)
keu_parts += """

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
"""

# stock (ends before weekly keu generateRekap)
stock = slice_lines(625, 1217)
stock = stock.replace("formatRp(", "Verdict.formatRp(")
stock = stock.replace("formatDate(", "Verdict.formatDate(")
stock = stock.replace(
    'if (typeof updateDashboard === "function") updateDashboard();',
    "",
)
stock += """

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
"""

# dashboard
dashboard = """
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
"""

iklan = iklan.replace("formatRp(", "Verdict.formatRp(")

(ROOT / "panduan" / "panduan.js").write_text(panduan + "\n", encoding="utf-8")
(ROOT / "iklan" / "iklan.js").write_text(iklan + "\n", encoding="utf-8")
(ROOT / "keuangan" / "keuangan.js").write_text(keu_parts + "\n", encoding="utf-8")
(ROOT / "stock" / "stock.js").write_text(stock + "\n", encoding="utf-8")
(ROOT / "dashboard" / "dashboard.js").write_text(dashboard + "\n", encoding="utf-8")
(ROOT / "product" / "product.js").write_text(
    "/* Produk: static content */\n", encoding="utf-8"
)
print("Emitted *.js")
