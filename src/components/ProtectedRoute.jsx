import { Navigate } from "react-router-dom";

export function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div className="page-loading">
        <p>Memuat sesi...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
