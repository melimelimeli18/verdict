export const checklistPhases = [
  {
    id: "phase-1",
    number: "1",
    title: "Riset & Persiapan",
    subtitle: "Sebelum buka toko — ini wajib dulu",
    items: [
      {
        id: "niche-specific",
        title: "Tentukan niche / kategori produk yang spesifik",
        description:
          "Jangan jual semua hal. Toko yang fokus 1 kategori konversinya 2x lebih tinggi dari toko serba ada. Pilih niche yang kamu suka ATAU yang pasarnya jelas.",
        tag: "wajib",
      },
      {
        id: "competitor-analysis",
        title: "Riset kompetitor — analisis 5 toko laris",
        description:
          "Cek harga, foto, deskripsi, ulasan. Cari tahu kenapa mereka laris. 70% seller gagal karena skip tahap ini dan langsung jualan tanpa tahu lanskap pasar.",
        tag: "wajib",
      },
      {
        id: "hpp-margin",
        title: "Hitung HPP & margin keuntungan",
        description:
          "Harga jual min = modal + ongkir + fee platform (Shopee ~4–6%, TikTok Shop ~2–5%) + profit. Tanpa ini, kamu bisa rugi tanpa sadar.",
        tag: "wajib",
      },
      {
        id: "supplier-verify",
        title: "Tentukan & verifikasi supplier / sumber produk",
        description:
          "Pesan sampel dulu sebelum stok banyak. Cek kualitas, packaging, dan kecepatan pengiriman supplier. Supplier yang lambat = rating toko kamu turun.",
        tag: "penting",
      },
      {
        id: "keyword-research",
        title: "Riset keyword produk di Shopee / TikTok",
        description:
          "Ketik keyword di search bar dan lihat autocomplete — itu keyword yang banyak dicari orang. Simpan list keyword utama untuk judul produk nanti.",
        tag: "penting",
      },
    ],
  },
  {
    id: "phase-2",
    number: "2",
    title: "Setup Toko",
    subtitle: "Bikin kesan pertama yang nggak bisa dilupain",
    items: [
      {
        id: "business-email",
        title: "Buat akun dengan email bisnis terpisah",
        description:
          "Email bisnis = lebih profesional dan mudah dikelola tim kalau suatu saat kamu hire orang. Jangan campur dengan email pribadi.",
        tag: "wajib",
      },
      {
        id: "store-name",
        title: "Pilih nama toko yang mudah diingat & relevan",
        description:
          "Simpel, relevan dengan produk, hindari angka/simbol random. Nama toko = brand pertama kamu. Susah diubah setelah banyak pelanggan.",
        tag: "wajib",
      },
      {
        id: "store-banner",
        title: "Upload foto profil & banner toko yang menarik",
        description:
          "Toko dengan foto profil punya conversion trust 40% lebih tinggi. Bisa pakai logo simpel, Canva, atau foto produk unggulan yang bersih.",
        tag: "penting",
      },
      {
        id: "store-info",
        title: "Isi semua info toko — lokasi, jam, deskripsi",
        description:
          "Profil toko yang lengkap ningkatin kepercayaan pembeli. Buyer sering cek ini sebelum checkout, terutama untuk order pertama.",
        tag: "penting",
      },
      {
        id: "shipping-couriers",
        title: "Aktifkan minimal 3 ekspedisi pengiriman",
        description:
          "JNE, J&T, Sicepat minimal. Makin banyak pilihan ongkir, makin gampang pembeli dari berbagai daerah checkout. Aktifkan COD kalau memungkinkan.",
        tag: "wajib",
      },
      {
        id: "auto-reply",
        title: "Setting auto-reply chat & template respons",
        description:
          "Response rate 95%+ bikin toko kamu muncul lebih tinggi di search. Set auto-reply untuk jam istirahat dan malam hari supaya tetap responsif.",
        tag: "tips",
      },
    ],
  },
  {
    id: "phase-3",
    number: "3",
    title: "Upload Produk",
    subtitle: "Ini yang bikin orang mau klik & beli",
    items: [
      {
        id: "product-photos",
        title: "Foto produk minimal 5 angle — background putih + lifestyle",
        description:
          "Foto bagus bisa tingkatkan CTR 3–5x. Gunakan background putih untuk foto utama (standar Shopee), tambahkan 1–2 foto lifestyle supaya pembeli bisa bayangin produk dipakai.",
        tag: "wajib",
      },
      {
        id: "product-title",
        title: "Tulis judul produk dengan keyword yang tepat",
        description:
          'Format: [Keyword Utama] + [Spesifikasi] + [Keunggulan]. Max 120 karakter. Contoh: "Tas Kanvas Wanita Aesthetic Tote Bag Besar A4 Kuliah Kerja Sekolah".',
        tag: "wajib",
      },
      {
        id: "product-description",
        title: "Deskripsi produk yang lengkap & jujur",
        description:
          "Isi: ukuran, bahan, warna, cara perawatan, cara pemesanan varian. Pembeli yang info-nya lengkap: jarang complain, jarang retur, lebih sering kasih bintang 5.",
        tag: "wajib",
      },
      {
        id: "competitive-price",
        title: "Set harga kompetitif dengan margin yang sehat",
        description:
          "Untuk toko baru: boleh sedikit di bawah kompetitor untuk dapat ulasan pertama. Tapi jangan under-price — kamu bisa naikkan harga pelan-pelan setelah punya review.",
        tag: "wajib",
      },
      {
        id: "product-variants",
        title: "Isi variasi produk (ukuran, warna, dll)",
        description:
          "Produk dengan variasi lengkap dapat lebih banyak traffic karena muncul di lebih banyak filter pencarian. Jangan bikin listing terpisah untuk tiap varian.",
        tag: "penting",
      },
      {
        id: "min-15-products",
        title: "Upload minimal 10–15 produk sebelum promosi",
        description:
          "Toko dengan banyak produk terlihat lebih serius & punya lebih banyak entry point untuk ditemukan pembeli lewat search organik.",
        tag: "penting",
      },
      {
        id: "product-video",
        title: "Tambahkan video produk singkat (15–30 detik)",
        description:
          "Listing dengan video dapat 80% lebih banyak tayangan di Shopee. Cukup video simpel: unboxing, detail produk, atau cara pakai. Nggak perlu cinematic.",
        tag: "tips",
      },
    ],
  },
  {
    id: "phase-4",
    number: "4",
    title: "Promosi & Ulasan Pertama",
    subtitle: "Biar ada yang tau & percaya toko kamu",
    items: [
      {
        id: "share-social",
        title: "Share produk ke sosmed & WAG terdekat",
        description:
          "Pembeli pertama hampir selalu dari circle sendiri. Jangan malu share — mereka juga bisa kasih ulasan awal yang sangat berharga untuk trust toko baru.",
        tag: "penting",
      },
      {
        id: "free-shipping-voucher",
        title: "Aktifkan voucher toko / gratis ongkir",
        description:
          "Gratis ongkir adalah faktor #1 yang mempengaruhi keputusan beli di Shopee (data internal Shopee 2023). Ikut program gratis ongkir Shopee dulu sebelum iklan berbayar.",
        tag: "wajib",
      },
      {
        id: "fast-response",
        title: "Balas semua chat dalam 1 jam — target response rate 95%+",
        description:
          "Response Rate tinggi = peringkat toko lebih tinggi di search Shopee. Set notifikasi, pasang auto-reply malam hari, dan usahain balas di hari yang sama.",
        tag: "wajib",
      },
      {
        id: "nice-packaging",
        title: "Packaging rapi + sisipkan kartu ucapan / thank you note",
        description:
          "Packaging yang rapi & personal bikin pembeli lebih mau kasih ulasan bintang 5 dan kembali lagi. Ini investasi kecil yang returnnya besar banget.",
        tag: "penting",
      },
      {
        id: "first-10-reviews",
        title: "Kejar 10 ulasan bintang 5 pertama",
        description:
          "Toko dengan 10+ ulasan bintang 5 punya conversion rate 70% lebih tinggi dari toko tanpa ulasan. Boleh follow-up pembeli lewat chat dengan sopan untuk minta review.",
        tag: "wajib",
      },
      {
        id: "tiktok-content",
        title: "Coba 1 konten TikTok / Reels produk per minggu",
        description:
          "TikTok dan Reels bisa kasih eksposur ribuan orang tanpa biaya iklan. Mulai dari: unboxing, review jujur, atau behind-the-scenes cara kamu packing produk.",
        tag: "tips",
      },
    ],
  },
  {
    id: "phase-5",
    number: "5",
    title: "Evaluasi & Optimasi Rutin",
    subtitle: "Yang konsisten evaluasi, yang maju",
    items: [
      {
        id: "seller-insight",
        title: "Cek Shopee Seller Insight tiap minggu",
        description:
          "Lihat: produk mana yang banyak dilihat tapi jarang dibeli (masalah foto/harga), produk mana yang langsung laku. Data ini jauh lebih jujur dari feeling kamu.",
        tag: "penting",
      },
      {
        id: "ab-test",
        title: "A/B test foto & judul produk terlaris",
        description:
          "Ganti foto thumbnail atau judul produk terlaris, pantau CTR selama 1 minggu. Kalau naik, pertahankan. Kalau turun, kembalikan. Lakukan terus sampai optimal.",
        tag: "tips",
      },
      {
        id: "flash-sale",
        title: "Ikut Flash Sale Shopee / TikTok Shop",
        description:
          "Flash Sale adalah cara dapat eksposur gratis paling efektif untuk toko baru. Daftarkan 1–2 produk unggulan dengan diskon minimal 20% untuk lolos kurasi.",
        tag: "bonus",
      },
      {
        id: "ads-small-budget",
        title: "Mulai iklan Shopee Ads / TikTok Ads dengan budget kecil",
        description:
          "Mulai setelah punya minimal 10 ulasan dan CTR organik bagus. Budget Rp 20–50rb/hari cukup untuk test. Evaluasi ROAS-nya setelah 7 hari. Lihat tab Iklan untuk panduan lengkap.",
        tag: "tips",
      },
      {
        id: "sop-packing",
        title: "Buat SOP packing & pengiriman yang konsisten",
        description:
          "Buat checklist packing sendiri supaya kualitas packaging selalu sama meski orderan sedang banyak. Konsistensi = bintang 5 yang konsisten.",
        tag: "bonus",
      },
    ],
  },
];

export const allChecklistItems = checklistPhases.flatMap(
  (phase) => phase.items,
);
