export const adMetrics = [
  {
    name: "ROAS",
    full: "Return on Ad Spend",
    description:
      "Berapa rupiah omzet yang masuk untuk setiap 1 rupiah biaya iklan.",
    benchmark: ">= 3x bagus",
    status: "good",
  },
  {
    name: "CTR",
    full: "Click Through Rate",
    description: "Persentase orang yang klik iklan dari total yang melihat.",
    benchmark: "Rendah = foto/judul lemah",
    status: "warn",
  },
  {
    name: "CPC",
    full: "Cost Per Click",
    description:
      "Biaya per klik iklan. Rendah bagus, tapi kualitas klik tetap penting.",
    benchmark: "Bandingkan per keyword",
    status: "warn",
  },
  {
    name: "CPA",
    full: "Cost Per Acquisition",
    description: "Biaya iklan untuk mendapatkan satu order.",
    benchmark: "Harus di bawah profit/order",
    status: "bad",
  },
];

export const adDecisions = [
  {
    condition: "ROAS < 1.5x",
    action: "Matikan dulu",
    description:
      "Produk belum siap di-scale. Perbaiki foto, harga, ulasan, dan listing sebelum lanjut iklan.",
  },
  {
    condition: "ROAS 1.5-3x",
    action: "Optimasi",
    description:
      "Masih ada potensi. Cek keyword, bid, foto utama, dan margin produk.",
  },
  {
    condition: "ROAS >= 3x",
    action: "Scale bertahap",
    description:
      "Naikkan budget 20-30% per minggu sambil pantau profit bersih.",
  },
];

export const adChecklist = [
  "Produk punya minimal 10 ulasan atau social proof yang kuat",
  "Foto utama sudah jelas dan menarik saat dilihat di mobile",
  "Harga masih memberi margin sehat setelah biaya iklan",
  "Budget test kecil sudah disiapkan selama minimal 7 hari",
  "Punya catatan harian untuk ROAS, CTR, CPC, CPA, dan omzet",
];
