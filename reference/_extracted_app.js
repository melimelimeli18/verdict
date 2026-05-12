      // ===== NAVIGATION =====
      function showPage(name, el) {
        document
          .querySelectorAll(".page")
          .forEach((p) => p.classList.remove("active"));
        document
          .querySelectorAll(".nav-tab")
          .forEach((t) => t.classList.remove("active"));
        document.getElementById("page-" + name).classList.add("active");
        el.classList.add("active");
      }

      // ===== CHECKLIST =====
      function toggle(el) {
        el.classList.toggle("done");
        updateStats();
      }

      function updateStats() {
        const all = document.querySelectorAll("#page-checklist .check-item");
        const done = document.querySelectorAll(
          "#page-checklist .check-item.done",
        );
        const pct = all.length
          ? Math.round((done.length / all.length) * 100)
          : 0;

        document.getElementById("done-count").textContent = done.length;
        document.getElementById("total-count").textContent = all.length;
        document.getElementById("pct-count").textContent = pct + "%";
        document.getElementById("sp-fill").style.width = pct + "%";
        document.getElementById("sp-text").textContent =
          done.length + " / " + all.length + " selesai";

        let phaseDone = 0;
        for (let i = 1; i <= 5; i++) {
          const phase = document.getElementById("phase-" + i);
          if (!phase) continue;
          const items = phase.querySelectorAll(".check-item");
          const doneItems = phase.querySelectorAll(".check-item.done");
          const badge = document.getElementById("badge-" + i);
          if (items.length > 0 && items.length === doneItems.length) {
            badge.style.display = "block";
            phaseDone++;
          } else {
            badge.style.display = "none";
          }
        }
        document.getElementById("phase-done").textContent = phaseDone;

        if (done.length === all.length && all.length > 0) {
          document.getElementById("celebration").classList.add("show");
        } else {
          document.getElementById("celebration").classList.remove("show");
        }
      }

      function resetAll() {
        if (confirm("Reset semua checklist dari awal?")) {
          document
            .querySelectorAll("#page-checklist .check-item")
            .forEach((el) => el.classList.remove("done"));
          updateStats();
          saveToLocal();
        }
      }

      // ===== Q&A =====
      function toggleQNA(el) {
        const isOpen = el.classList.contains("open");
        document
          .querySelectorAll(".qna-item")
          .forEach((q) => q.classList.remove("open"));
        if (!isOpen) el.classList.add("open");
      }

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
        <div class="keu-entry-date">${formatDate(e.date)}</div>
      </div>
      <div class="keu-entry-amount ${e.type === "masuk" ? "amount-masuk" : "amount-keluar"}">
        ${e.type === "masuk" ? "+" : "-"}${formatRp(e.amount)}
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
          formatRp(masuk);
        document.getElementById("keu-total-keluar").textContent =
          formatRp(keluar);
        const profitEl = document.getElementById("keu-profit");
        profitEl.textContent = (profit >= 0 ? "+" : "") + formatRp(profit);
        profitEl.className = "keu-stat-val " + (profit >= 0 ? "green" : "red");

        const total = masuk + keluar;
        if (total > 0) {
          document.getElementById("keu-chart").style.display = "block";
          document.getElementById("bar-masuk-label").textContent =
            formatRp(masuk);
          document.getElementById("bar-keluar-label").textContent =
            formatRp(keluar);
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
        updateDashboard();
      }

      function resetKeuangan() {
        if (confirm("Hapus semua catatan keuangan?")) {
          keuEntries = [];
          renderEntries();
          updateKeuStats();
          saveToLocal();
        }
      }

      function formatRp(n) {
        if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(1) + "jt";
        if (n >= 1000) return "Rp " + Math.round(n / 1000) + "rb";
        return "Rp " + Math.round(n).toLocaleString("id");
      }

      function formatDate(d) {
        if (!d) return "";
        const [y, m, day] = d.split("-");
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];
        return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
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
              ${p.hargaBeli > 0 ? `<span style="font-size:10px; color:var(--muted);">Modal: ${formatRp(p.hargaBeli)}</span>` : ""}
              ${p.hargaJual > 0 ? `<span style="font-size:10px; color:var(--muted);">Jual: ${formatRp(p.hargaJual)}</span>` : ""}
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
            ? `Harga beli saat ini: ${formatRp(produk.hargaBeli)}`
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
        <div class="keu-entry-date">${formatDate(r.date)}</div>
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
        <div class="keu-entry-note">${h.hargaLama > 0 ? formatRp(h.hargaLama) + " → " : "Harga awal: "}${formatRp(h.hargaBaru)}${h.supplier ? " · " + h.supplier : ""}${h.nota ? " · Nota: " + h.nota : ""}</div>
        <div class="keu-entry-date">${formatDate(h.date)}</div>
      </div>
      <div class="keu-entry-amount" style="color:var(--accent); font-size:12px; font-weight:700;">${formatRp(h.hargaBaru)}</div>
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
        document.getElementById("stok-nilai").textContent = formatRp(nilaiStok);

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
        if (typeof updateDashboard === "function") updateDashboard();
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
          kondisi = `✅ Semua <b>${aman.length} produk</b> stoknya aman. Nilai stok: <b>${formatRp(nilaiStok)}</b>.`;

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
            `Potensi omzet dari stok saat ini: <b>${formatRp(potensiOmzet)}</b>.`,
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
          kondisi = `✅ Kondisi keuangan minggu ini <b>sehat</b>. Profit bersih <b>${formatRp(profit)}</b> dengan margin <b>${margin}%</b> — di atas target minimum 20%.`;
        } else if (margin >= 10) {
          kondisi = `⚠️ Kondisi keuangan <b>cukup</b>, tapi margin masih tipis di <b>${margin}%</b>. Profit bersih <b>${formatRp(profit)}</b>. Ada ruang untuk dioptimasi.`;
        } else if (margin >= 0) {
          kondisi = `🚨 Margin minggu ini hanya <b>${margin}%</b> — sangat rentan. Profit bersih cuma <b>${formatRp(profit)}</b> dari omzet <b>${formatRp(masuk)}</b>.`;
        } else {
          kondisi = `❌ Minggu ini <b>merugi</b> sebesar <b>${formatRp(Math.abs(profit))}</b>. Total keluar (<b>${formatRp(keluar)}</b>) melebihi pemasukan (<b>${formatRp(masuk)}</b>).`;
        }

        // ===== PENGELUARAN TERBESAR =====
        let pengeluaran = "";
        if (topKeluar.length === 0) {
          pengeluaran = "Belum ada pengeluaran tercatat minggu ini.";
        } else {
          const top = topKeluar[0];
          const topPct = masuk > 0 ? Math.round((top[1] / masuk) * 100) : 0;
          pengeluaran = `Pengeluaran terbesar: <b>${top[0]}</b> sebesar <b>${formatRp(top[1])}</b> (${topPct}% dari omzet).`;
          if (top[0] === "Biaya Iklan" && topPct > 30) {
            pengeluaran +=
              " Porsi iklan cukup besar — pastikan ROAS-nya sepadan.";
          } else if (top[0] === "Modal / Stok Produk") {
            pengeluaran +=
              " Wajar — modal stok adalah investasi untuk penjualan berikutnya.";
          }
          if (topKeluar.length > 1) {
            pengeluaran += ` Disusul <b>${topKeluar[1][0]}</b> (${formatRp(topKeluar[1][1])}).`;
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

      // ===== LOCALSTORAGE =====
      const LS_KEY = "verdict_data_v1";

      function saveToLocal() {
        try {
          const data = {
            keuEntries,
            stokProduk,
            stokRiwayat,
            historiHarga,
            checklist: Array.from(
              document.querySelectorAll("#page-checklist .check-item"),
            ).map((el) => el.classList.contains("done")),
          };
          localStorage.setItem(LS_KEY, JSON.stringify(data));
        } catch (e) {
          console.warn("Gagal simpan", e);
        }
      }

      function loadFromLocal() {
        try {
          const raw = localStorage.getItem(LS_KEY);
          if (!raw) return false;
          const data = JSON.parse(raw);
          if (data.keuEntries) keuEntries = data.keuEntries;
          if (data.stokProduk) stokProduk = data.stokProduk;
          if (data.stokRiwayat) stokRiwayat = data.stokRiwayat;
          if (data.historiHarga) historiHarga = data.historiHarga;
          if (data.checklist) window._savedChecklist = data.checklist;
          return true;
        } catch (e) {
          return false;
        }
      }

      function applyChecklist() {
        if (!window._savedChecklist) return;
        const items = document.querySelectorAll("#page-checklist .check-item");
        window._savedChecklist.forEach((done, i) => {
          if (items[i] && done) items[i].classList.add("done");
        });
        delete window._savedChecklist;
      }

      // Patch toggle untuk auto-save
      const _origToggle = toggle;
      window.toggle = function (el) {
        _origToggle(el);
        saveToLocal();
      };

      // Load data dari localStorage dulu sebelum render
      loadFromLocal();

      updateStats();
      setType("masuk");
      renderEntries();
      updateKeuStats();
      renderStok();
      renderRiwayat();
      renderHistoriHarga();
      updateStokStats();
      applyChecklist();
      updateStats();
      updateDashboard();

      // ===== DASHBOARD =====
      function updateDashboard() {
        // Date greeting
        const now = new Date();
        const days = [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ];
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];
        document.getElementById("dash-date").textContent =
          `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

        // Keuangan
        const masuk = keuEntries
          .filter((e) => e.type === "masuk")
          .reduce((s, e) => s + e.amount, 0);
        const keluar = keuEntries
          .filter((e) => e.type === "keluar")
          .reduce((s, e) => s + e.amount, 0);
        const profit = masuk - keluar;
        const margin = masuk > 0 ? Math.round((profit / masuk) * 100) : 0;
        document.getElementById("dash-masuk").textContent = formatRp(masuk);
        const profitEl = document.getElementById("dash-profit");
        profitEl.textContent = (profit >= 0 ? "+" : "") + formatRp(profit);
        profitEl.className = "keu-stat-val " + (profit >= 0 ? "green" : "red");
        const marginEl = document.getElementById("dash-margin");
        marginEl.textContent = margin + "%";
        marginEl.className =
          "keu-stat-val " +
          (margin >= 20 ? "green" : margin >= 10 ? "" : "red");

        // Checklist progress
        const all = document.querySelectorAll("#page-checklist .check-item");
        const done = document.querySelectorAll(
          "#page-checklist .check-item.done",
        );
        const pct = all.length
          ? Math.round((done.length / all.length) * 100)
          : 0;
        document.getElementById("dash-pct").textContent = pct + "%";
        document.getElementById("dash-progress-bar").style.width = pct + "%";
        document.getElementById("dash-progress-text").textContent =
          `${done.length} dari ${all.length} langkah selesai`;

        // Stok
        const totalProduk = stokProduk.length;
        const totalItem = stokProduk.reduce((s, p) => s + p.stok, 0);
        const nilaiStok = stokProduk.reduce(
          (s, p) => s + p.stok * p.hargaBeli,
          0,
        );
        const kritis = stokProduk.filter((p) => p.stok <= (p.minimum || 5));
        document.getElementById("dash-total-produk").textContent = totalProduk;
        document.getElementById("dash-total-item").textContent = totalItem;
        document.getElementById("dash-nilai-stok").textContent =
          formatRp(nilaiStok);
        document.getElementById("dash-stok-kritis").textContent = kritis.length;
        const stokAlert = document.getElementById("dash-stok-alert");
        if (kritis.length > 0) {
          stokAlert.style.display = "block";
          stokAlert.textContent = `Perlu restock: ${kritis.map((p) => p.nama).join(", ")}`;
        } else {
          stokAlert.style.display = "none";
        }

        // Top pengeluaran
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
          <span style="font-size:12px; font-weight:700; color:var(--accent);">${formatRp(val)}</span>
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
              teks: `<b>CPO terlalu tinggi.</b> Biaya per order <b>${formatRp(cpo)}</b> sudah lebih dari 30% profit per item. Pertimbangkan turunkan bid atau perluas target audience.`,
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
        <div style="font-size:13px; font-weight:700; color:var(--text);">${roas.toFixed(1)}x · ${formatRp(profit)} · ${cpo > 0 ? formatRp(cpo) : "—"}</div>
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
