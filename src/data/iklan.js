export const AD_METRICS = [
  {
    key: "ROAS",
    full: "Return on Ad Spend",
    desc: "Berapa rupiah yang masuk untuk setiap 1 rupiah yang kamu keluarkan untuk iklan.",
    benchmark: "✓ Bagus: ≥ 3x",
    benchClass: "bench-good",
  },
  {
    key: "CTR",
    full: "Click-Through Rate",
    desc: "Persentase orang yang klik iklan kamu dari total yang lihat. Rendah = masalah foto/judul.",
    benchmark: "Target: ≥ 2%",
    benchClass: "bench-warn",
  },
  {
    key: "CVR",
    full: "Conversion Rate",
    desc: "% yang beli setelah klik. Rendah = masalah harga, deskripsi, atau ulasan.",
    benchmark: "Target: ≥ 3%",
    benchClass: "bench-good",
  },
  {
    key: "CPC",
    full: "Cost per Click",
    desc: "Biaya per klik iklan. Makin rendah makin efisien — tapi kualitas klik juga penting.",
    benchmark: "Ideal: Rp 200–500",
    benchClass: "bench-warn",
  },
  {
    key: "CPO",
    full: "Cost per Order",
    desc: "Biaya iklan yang dikeluarkan untuk mendapat 1 order. Harus jauh di bawah profit per order.",
    benchmark: "Bahaya: > 30% profit",
    benchClass: "bench-bad",
  },
  {
    key: "Impression",
    full: "Tayangan Iklan",
    desc: "Berapa kali iklan kamu muncul. Rendah = budget terlalu kecil atau keyword terlalu sempit.",
    benchmark: "Monitor per hari",
    benchClass: "bench-warn",
  },
];

export const DECISION_TREE = [
  {
    condition: "ROAS < 1.5x",
    title: "Matiin dulu, evaluasi dari awal",
    desc: "ROAS di bawah 1.5 artinya kamu rugi. Cek dulu: foto produk, harga, dan ulasan. Perbaiki itu sebelum iklan lagi.",
  },
  {
    condition: "ROAS 1.5–2.9x",
    title: "Jalan tapi perlu optimasi",
    desc: "Masih bisa lanjut kalau margin produk tinggi. Tapi wajib coba ubah targeting, turunkan keyword yang mahal, dan test foto baru.",
  },
  {
    condition: "ROAS ≥ 3x",
    title: "Scale up budget-nya!",
    desc: "Iklan kamu profitable. Naikkan budget 20–30% per minggu secara bertahap. Jangan langsung 2x karena bisa ubah performa algoritma.",
  },
  {
    condition: "CTR rendah, Impresi tinggi",
    title: "Masalah di foto & judul",
    desc: "Orang lihat tapi ga klik = thumbnail kamu kalah menarik. Ganti foto utama dan uji judul baru dengan keyword berbeda.",
  },
  {
    condition: "CTR bagus, CVR rendah",
    title: "Masalah di halaman produk",
    desc: "Orang klik tapi ga beli = harga terlalu mahal, deskripsi kurang meyakinkan, atau ulasan kurang. Perbaiki tiga hal itu dulu.",
  },
  {
    condition: "Impresi sangat rendah",
    title: "Budget atau keyword bermasalah",
    desc: "Naikkan bid iklan, tambah variasi keyword (long-tail keyword lebih murah), atau perluas target audience-nya.",
  },
];

export const AD_CHECKLIST_ITEMS = [
  {
    title: "Toko sudah punya minimal 10 ulasan bintang 4–5",
    desc: "Iklan yang bawa traffic ke toko tanpa ulasan = buang uang. Orang akan klik, tapi langsung keluar.",
  },
  {
    title: "Foto produk sudah dioptimasi & CTR organik bagus",
    desc: "Kalau foto organik aja sudah dapat CTR rendah, iklan cuma bikin lebih banyak orang lihat tapi tetap ga klik.",
  },
  {
    title: "Hitung break-even ROAS sebelum mulai",
    desc: "Break-even ROAS = Harga Jual ÷ (Harga Jual - Modal - Fee Platform). Ini ROAS minimum agar kamu tidak rugi.",
  },
  {
    title: "Set budget harian yang bisa kamu relakan jika merugi",
    desc: "Anggap biaya iklan awal = biaya belajar. Mulai dari Rp 20–50rb/hari. Jangan langsung besar sebelum kamu paham angkanya.",
  },
  {
    title: "Monitor iklan setiap hari selama 7 hari pertama",
    desc: "7 hari pertama adalah periode test. Jangan evaluasi terlalu cepat (< 3 hari) karena data belum cukup, tapi jangan dibiarkan begitu saja.",
  },
];
