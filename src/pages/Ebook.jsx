export function EbookPage() {
  return (
    <div style={{ padding: "20px 24px 48px" }}>
      {/* ===== HERO BANNER ===== */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--dark), var(--brown))",
          borderRadius: 16,
          padding: "24px 20px",
          marginBottom: 24,
          textAlign: "center",
        }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--gold)",
            letterSpacing: "1.5px",
            fontWeight: 700,
            opacity: 0.7,
            marginBottom: 8,
          }}>
          ✦ DARI VERDICT
        </div>
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 20,
            color: "var(--cream)",
            marginBottom: 8,
            lineHeight: 1.4,
          }}>
          Produk <em>Verdict</em>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(245, 239, 230, 0.65)",
            lineHeight: 1.7,
          }}>
          Koleksi produk digital yang bisa bantu kamu belajar, berkembang, dan
          berkembang lebih cepat.
        </div>
      </div>

      {/* ===== EBOOK CARD ===== */}
      <div
        style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          marginBottom: 16,
        }}>
        {/* BADGE */}
        <div
          style={{
            background: "linear-gradient(90deg, var(--accent), var(--gold))",
            padding: "6px 16px",
            fontSize: 10,
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.5px",
          }}>
          📖 RANGKUMAN BUKU
        </div>

        <div style={{ padding: "18px 16px" }}>
          {/* JUDUL */}
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 16,
              color: "var(--brown)",
              lineHeight: 1.45,
              marginBottom: 10,
            }}>
            Rangkuman <em>The Psychology of Money</em>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: 14,
            }}>
            Alasan Kenapa Orang Pinter Tetap Miskin dan Gimana Cara Kamu Nggak
            Jadi Salah Satunya!
          </div>

          {/* WHAT YOU GET */}
          <div
            style={{
              background: "#f5efe6",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 16,
            }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.5px",
                marginBottom: 8,
              }}>
              APA YANG KAMU DAPET
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--text)",
                }}>
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                  ✓
                </span>
                Insight utama dari buku Morgan Housel — tanpa harus baca 250+
                halaman
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--text)",
                }}>
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                  ✓
                </span>
                Penjelasan pakai bahasa sehari-hari, bukan bahasa ekonomi yang
                ribet
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--text)",
                }}>
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                  ✓
                </span>
                Pola pikir soal uang yang sering bikin orang "pintar" tetap
                stuck
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--text)",
                }}>
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                  ✓
                </span>
                Langkah konkret yang bisa langsung kamu terapin
              </div>
            </div>
          </div>

          {/* CTA BUTTON */}
          <a
            href="https://lynk.id/adelaaaa.rd"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: "linear-gradient(135deg, var(--accent), var(--warm))",
              color: "white",
              textAlign: "center",
              padding: 14,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: '"DM Sans", sans-serif',
              textDecoration: "none",
              letterSpacing: "0.2px",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
            }}>
            Beli Sekarang →
          </a>

          <div
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 11,
              color: "var(--muted)",
            }}>
            Pembelian & download via <strong>lynk.id/adelaaaa.rd</strong>
          </div>
        </div>
      </div>

      {/* ===== MORE SOON ===== */}
      <div
        style={{
          background: "white",
          border: "1.5px dashed rgba(100, 60, 30, 0.15)",
          borderRadius: 16,
          padding: "24px 16px",
          textAlign: "center",
          marginBottom: 16,
        }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>✨</div>
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 15,
            color: "var(--brown)",
            marginBottom: 6,
          }}>
          Produk lainnya segera hadir
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          Follow Instagram <strong>@verdict</strong> untuk notifikasi produk &
          konten baru.
        </div>
        <a
          href="https://lynk.id/adelaaaa.rd"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: 14,
            background: "#160c05",
            color: "var(--gold)",
            padding: "9px 20px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            textDecoration: "none",
            fontFamily: '"DM Sans", sans-serif',
            letterSpacing: "0.3px",
          }}>
          Lihat semua di Lynk.id →
        </a>
      </div>
    </div>
  );
}
