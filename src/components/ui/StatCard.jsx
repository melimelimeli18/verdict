export function StatCard({ label, value, tone = "" }) {
  return (
    <div className="stat-card">
      <span className={`stat-number ${tone}`}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
