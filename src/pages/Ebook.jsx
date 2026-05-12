import { PageIntro } from "../components/ui/PageIntro.jsx";

export function EbookPage() {
  return (
    <section className="keu-section page">
      {/* ===== HERO BANNER ===== */}
      <div className="ebook-hero">
        <div className="ebook-hero-label">✦ DARI VERDICT</div>
        <div className="ebook-hero-title">
          Produk <em>Verdict</em>
        </div>
        <p className="ebook-hero-desc">
          Koleksi produk digital yang bisa bantu kamu belajar, berkembang, dan
          berkembang lebih cepat.
        </p>
      </div>

      {/* ===== EBOOK CARD ===== */}
      <div className="ebook-card">
        <div className="ebook-card-badge">📖 RANGKUMAN BUKU</div>
        <div className="ebook-card-body">
          <h3 className="ebook-card-title">
            Rangkuman <em>The Psychology of Money</em>
          </h3>
          <p className="ebook-card-subtitle">
            Alasan Kenapa Orang Pinter Tetap Miskin dan Gimana Cara Kamu Nggak
            Jadi Salah Satunya!
          </p>

          <div className="ebook-benefits">
            <div className="ebook-benefits-title">APA YANG KAMU DAPET</div>
            <ul className="ebook-benefits-list">
              <li>
                <span className="ebook-check">✓</span>
                Insight utama dari buku Morgan Housel — tanpa harus baca 250+
                halaman
              </li>
              <li>
                <span className="ebook-check">✓</span>
                Penjelasan pakai bahasa sehari-hari, bukan bahasa ekonomi yang
                ribet
              </li>
              <li>
                <span className="ebook-check">✓</span>
                Pola pikir soal uang yang sering bikin orang "pintar" tetap
                stuck
              </li>
              <li>
                <span className="ebook-check">✓</span>
                Langkah konkret yang bisa langsung kamu terapin
              </li>
            </ul>
          </div>

          <a
            href="https://lynk.id/adelaaaa.rd"
            target="_blank"
            rel="noopener noreferrer"
            className="ebook-cta">
            Beli Sekarang →
          </a>
          <p className="ebook-footer-note">
            Pembelian & download via <strong>lynk.id/adelaaaa.rd</strong>
          </p>
        </div>
      </div>

      {/* ===== COMING SOON ===== */}
      <div className="ebook-coming-soon">
        <div className="ebook-coming-icon">✨</div>
        <h4 className="ebook-coming-title">Produk lainnya segera hadir</h4>
        <p className="ebook-coming-desc">
          Follow Instagram <strong>@verdict</strong> untuk notifikasi produk &
          konten baru.
        </p>
        <a
          href="https://lynk.id/adelaaaa.rd"
          target="_blank"
          rel="noopener noreferrer"
          className="ebook-coming-link">
          Lihat semua di Lynk.id →
        </a>
      </div>
    </section>
  );
}
