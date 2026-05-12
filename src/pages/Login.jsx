import { useNavigate } from "react-router-dom";

export function LoginPage({ auth }) {
  const navigate = useNavigate();

  if (auth.loading) {
    return (
      <section className="content page">
        <p style={{ color: "var(--muted)", textAlign: "center" }}>
          Memuat sesi login...
        </p>
      </section>
    );
  }

  if (auth.user) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <section className="content page">
      <div className="login-hero">
        <div className="logo login-logo">Verdict</div>
        <h1
          className="section-title"
          style={{ textAlign: "center", marginTop: 16 }}>
          Akses Penuh Satu Klik
        </h1>
        <p
          className="section-desc"
          style={{ textAlign: "center", maxWidth: 400, margin: "8px auto 0" }}>
          Login dengan Google untuk menyimpan checklist, catatan keuangan, dan
          perhitungan kamu.
        </p>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button
            className="auth-btn primary"
            onClick={auth.login}
            type="button"
            style={{ fontSize: 14, padding: "12px 24px" }}>
            Login dengan Google
          </button>
        </div>
        <div className="info-box" style={{ marginTop: 24 }}>
          <div className="info-box-title">Kenapa harus login?</div>
          <div className="info-box-body">
            <p>
              Data kamu disimpan di Supabase dengan Row Level Security. Hanya
              kamu yang bisa melihat dan mengubah data milikmu sendiri.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
