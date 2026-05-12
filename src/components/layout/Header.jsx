import { Link } from "react-router-dom";

export function Header({ activePage, auth, navItems, onNavigate }) {
  return (
    <header>
      <div className="header-inner">
        <Link className="logo" to="/">
          Verdict
        </Link>
        <nav className="nav-tabs" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <button
              className={`nav-tab ${activePage === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button">
              {item.label}
            </button>
          ))}
        </nav>
        <div className="auth-actions">
          {auth.loading ? (
            <span className="auth-status">Loading</span>
          ) : auth.user ? (
            <>
              <span className="auth-status">{auth.user.name}</span>
              <button className="auth-btn" onClick={auth.logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <button
              className="auth-btn primary"
              onClick={auth.login}
              type="button">
              Login Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
