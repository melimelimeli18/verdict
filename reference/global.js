(function () {
  const LS_KEY = "verdict_data_v1";

  function defaults() {
    return {
      keuEntries: [],
      stokProduk: [],
      stokRiwayat: [],
      historiHarga: [],
      checklist: [],
    };
  }

  function read() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return defaults();
      return { ...defaults(), ...JSON.parse(raw) };
    } catch {
      return defaults();
    }
  }

  function write(data) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Gagal simpan", e);
    }
  }

  function patch(partial) {
    const cur = read();
    Object.assign(cur, partial);
    write(cur);
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

  window.Verdict = {
    LS_KEY,
    read,
    write,
    patch,
    formatRp,
    formatDate,
  };
})();
