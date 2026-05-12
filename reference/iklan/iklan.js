// ===== ROAS CALCULATOR =====
function calcROAS() {
  const budget =
    parseFloat(document.getElementById("c-budget").value) || 0;
  const revenue =
    parseFloat(document.getElementById("c-revenue").value) || 0;
  const price = parseFloat(document.getElementById("c-price").value) || 0;
  const cogs = parseFloat(document.getElementById("c-cogs").value) || 0;

  if (!budget || !revenue) {
    document.getElementById("calc-result").style.display = "none";
    return;
  }

  const roas = revenue / budget;
  const units = price > 0 ? Math.round(revenue / price) : 0;
  const platformFee = revenue * 0.05;
  const profit = revenue - cogs * units - budget - platformFee;

  document.getElementById("calc-result").style.display = "block";
  document.getElementById("c-roas").textContent = roas.toFixed(1) + "x";
  document.getElementById("c-profit").textContent =
    "Rp " + Math.round(profit).toLocaleString("id");

  const verdict = document.getElementById("c-verdict");
  if (roas >= 3) {
    verdict.textContent =
      "✅ ROAS bagus! Pertimbangkan untuk scale up budget iklan.";
    verdict.className = "calc-result-verdict verdict-good";
  } else if (roas >= 1.5) {
    verdict.textContent =
      "⚠️ ROAS masih perlu dioptimasi. Cek foto, harga, dan targeting.";
    verdict.className = "calc-result-verdict verdict-warn";
  } else {
    verdict.textContent =
      "❌ ROAS terlalu rendah — matiin dulu, evaluasi dari foto dan produk.";
    verdict.className = "calc-result-verdict verdict-bad";
  }
}

// ===== REKAP SARAN IKLAN =====
function generateRekapIklan() {
  const budget =
    parseFloat(document.getElementById("c-budget").value) || 0;
  const revenue =
    parseFloat(document.getElementById("c-revenue").value) || 0;
  const price = parseFloat(document.getElementById("c-price").value) || 0;
  const cogs = parseFloat(document.getElementById("c-cogs").value) || 0;

  if (!budget || !revenue) {
    alert(
      "Isi dulu kalkulator ROAS di atas — minimal budget iklan dan total penjualan!",
    );
    return;
  }

  const roas = revenue / budget;
  const units = price > 0 ? Math.round(revenue / price) : 0;
  const platformFee = revenue * 0.05;
  const profit = revenue - cogs * units - budget - platformFee;
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
  const cpo = units > 0 ? Math.round(budget / units) : 0;

  // Status ROAS
  let statusROAS = "",
    warnaROAS = "";
  if (roas >= 4) {
    statusROAS = "Sangat Bagus";
    warnaROAS = "#1a6b4a";
  } else if (roas >= 3) {
    statusROAS = "Bagus";
    warnaROAS = "#1a6b4a";
  } else if (roas >= 1.5) {
    statusROAS = "Perlu Optimasi";
    warnaROAS = "#b88a1a";
  } else {
    statusROAS = "Merugi";
    warnaROAS = "#b85c1a";
  }

  // Saran berdasarkan kondisi
  const saran = [];
  if (roas < 1.5) {
    saran.push({
      icon: "🔴",
      teks: "<b>Matiin iklan dulu.</b> ROAS di bawah 1.5x artinya kamu rugi untuk setiap rupiah yang dikeluarkan. Perbaiki dulu foto produk, harga, dan ulasan sebelum iklan lagi.",
    });
    saran.push({
      icon: "🔍",
      teks: "<b>Audit halaman produk.</b> Kalau orang klik tapi tidak beli — masalahnya di harga, deskripsi, atau kurangnya ulasan. Fokus perbaiki tiga hal itu dulu.",
    });
  } else if (roas < 3) {
    saran.push({
      icon: "🟡",
      teks: `<b>Iklan jalan tapi perlu dioptimasi.</b> ROAS ${roas.toFixed(1)}x masih bisa ditingkatkan. Coba ganti foto thumbnail dan test keyword yang lebih spesifik (long-tail).`,
    });
    saran.push({
      icon: "💡",
      teks: "<b>Cek CTR iklan.</b> Kalau impresi tinggi tapi klik sedikit, masalahnya di foto atau judul. Kalau CTR bagus tapi konversi rendah, masalahnya di halaman produk.",
    });
  } else {
    saran.push({
      icon: "✅",
      teks: `<b>Iklan kamu profitable!</b> ROAS ${roas.toFixed(1)}x artinya setiap Rp 1 yang kamu keluarkan menghasilkan Rp ${roas.toFixed(1)}. Naikkan budget 20–30% per minggu secara bertahap.`,
    });
    saran.push({
      icon: "🚀",
      teks: '<b>Scale bertahap, bukan langsung 2x.</b> Naikkan budget perlahan supaya algoritma iklan tidak perlu "belajar ulang" dan performa tetap stabil.',
    });
  }

  if (cpo > 0 && cogs > 0) {
    const profitPerOrder = price - cogs - price * 0.05;
    if (cpo > profitPerOrder * 0.3) {
      saran.push({
        icon: "⚠️",
        teks: `<b>CPO terlalu tinggi.</b> Biaya per order <b>${Verdict.formatRp(cpo)}</b> sudah lebih dari 30% profit per item. Pertimbangkan turunkan bid atau perluas target audience.`,
      });
    }
  }

  if (margin < 10 && revenue > 0) {
    saran.push({
      icon: "🚨",
      teks: `<b>Margin produk tipis (${margin}%).</b> Bahkan dengan iklan yang bagus, profit kamu akan sangat kecil. Pertimbangkan naikkan harga jual atau cari supplier lebih murah.`,
    });
  }

  const html = `
    <div style="background:var(--cream); border-radius:10px; padding:12px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
<div>
  <div style="font-size:10px; color:var(--muted); font-weight:600; letter-spacing:0.3px; margin-bottom:3px;">STATUS IKLAN</div>
  <div style="font-family:'Playfair Display',serif; font-size:18px; font-weight:700; color:${warnaROAS};">${statusROAS}</div>
</div>
<div style="text-align:right;">
  <div style="font-size:10px; color:var(--muted); margin-bottom:3px;">ROAS · Profit · CPO</div>
  <div style="font-size:13px; font-weight:700; color:var(--text);">${roas.toFixed(1)}x · ${Verdict.formatRp(profit)} · ${cpo > 0 ? Verdict.formatRp(cpo) : "—"}</div>
</div>
    </div>
    <div style="font-size:10px; font-weight:700; color:var(--accent); letter-spacing:0.5px; margin-bottom:8px;">SARAN YANG HARUS DILAKUKAN</div>
    <div style="display:flex; flex-direction:column; gap:10px;">
${saran
  .map(
    (s) => `
  <div style="display:flex; gap:10px; align-items:flex-start;">
    <span style="font-size:16px; flex-shrink:0;">${s.icon}</span>
    <div style="font-size:12.5px; line-height:1.7; color:var(--text);">${s.teks}</div>
  </div>
`,
  )
  .join("")}
    </div>
  `;

  document.getElementById("rekap-iklan-result").style.display = "block";
  document.getElementById("rekap-iklan-content").innerHTML = html;
}
    </script>
