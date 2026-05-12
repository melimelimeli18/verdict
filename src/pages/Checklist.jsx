import { useEffect, useMemo } from "react";
import { useChecklist } from "../hooks/useChecklist";
import { checklistPhases, allChecklistItems } from "../data/checklist";
import { ProgressStrip } from "../components/layout/ProgressStrip.jsx";

export default function ChecklistPage({ auth, onStatsChange }) {
  const { items, toggle, resetAll } = useChecklist(auth);

  const doneSet = new Set(items);

  const stats = useMemo(() => {
    const total = allChecklistItems.length;
    const done = items.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    let phaseDone = 0;
    for (const phase of checklistPhases) {
      const allDone = phase.items.every((item) => doneSet.has(item.id));
      if (allDone) phaseDone++;
    }

    return { total, done, pct, phaseDone };
  }, [items, doneSet]);

  const allDone = stats.done === stats.total && stats.total > 0;

  useEffect(() => {
    if (onStatsChange) {
      onStatsChange({ ...stats, allDone });
    }
  }, [stats, allDone, onStatsChange]);

  const tagClass = (tag) => {
    switch (tag) {
      case "wajib":
        return "tag-wajib";
      case "tips":
        return "tag-tips";
      case "penting":
        return "tag-penting";
      case "bonus":
        return "tag-bonus";
      default:
        return "tag-tips";
    }
  };

  const tagLabel = (tag) => {
    switch (tag) {
      case "wajib":
        return "Wajib";
      case "tips":
        return "Tips";
      case "penting":
        return "Penting";
      case "bonus":
        return "Bonus";
      default:
        return tag;
    }
  };

  const handleReset = async () => {
    if (window.confirm("Reset semua checklist dari awal?")) {
      await resetAll();
    }
  };

  return (
    <>
      <ProgressStrip
        activeTitle=""
        progress={{
          done: stats.done,
          total: stats.total,
          percent: stats.pct,
        }}
      />
      <div>
      {/* Overview stats */}
      <div className="overview">
        <div className="overview-grid">
          <div className="stat-card">
            <span className="stat-number" id="done-count">
              {stats.done}
            </span>
            <div className="stat-label">Selesai</div>
          </div>
          <div className="stat-card">
            <span className="stat-number" id="total-count">
              {stats.total}
            </span>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <span className="stat-number" id="phase-done">
              {stats.phaseDone}
            </span>
            <div className="stat-label">Fase Done</div>
          </div>
          <div className="stat-card">
            <span className="stat-number" id="pct-count">
              {stats.pct}%
            </span>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      </div>

      {/* Quote banner */}
      <div className="quote-banner" style={{ marginTop: 16 }}>
        <div className="quote-eyebrow">✦ INGAT SELALU</div>
        <div className="quote-text">
          "Seller sukses bukan yang paling pintar — tapi yang paling konsisten
          ngerjain hal-hal kecil ini setiap hari."
        </div>
      </div>

      <div className="content">
        {/* Celebration */}
        {allDone && (
          <div className="celebration show" id="celebration">
            <h2>🎉 Kamu udah siap jualan!</h2>
            <p>
              Semua langkah selesai. Sekarang kunci suksesnya satu:{" "}
              <strong>konsistensi</strong>. Upload produk baru minimal 3x
              seminggu, rajin balas chat, dan evaluasi setiap minggu. Orderan
              pertama tinggal nunggu waktu!
            </p>
          </div>
        )}

        {/* Phases */}
        {checklistPhases.map((phase) => {
          const phaseAllDone = phase.items.every((item) =>
            doneSet.has(item.id),
          );
          return (
            <div
              className="phase"
              key={phase.id}
              id={`phase-wrap-${phase.number}`}>
              <div className="phase-header">
                <div className="phase-num">{phase.number}</div>
                <div className="phase-info">
                  <div className="phase-title">{phase.title}</div>
                  <div className="phase-sub">{phase.subtitle}</div>
                </div>
                <div
                  className="phase-badge"
                  style={{ display: phaseAllDone ? "block" : "none" }}
                  id={`badge-${phase.number}`}>
                  ✓ Done
                </div>
              </div>
              <div className="checklist" id={`phase-${phase.number}`}>
                {phase.items.map((item) => {
                  const done = doneSet.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`check-item${done ? " done" : ""}`}
                      onClick={() => toggle(item.id)}>
                      <div className="checkbox">
                        <span className="check-icon">✓</span>
                      </div>
                      <div className="check-body">
                        <div className="check-title">{item.title}</div>
                        <div className="check-desc">{item.description}</div>
                        <span className={`check-tag ${tagClass(item.tag)}`}>
                          {tagLabel(item.tag)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button className="reset-btn" onClick={handleReset}>
          ↺ Reset semua checklist
        </button>
      </div>
    </div>
    </>
  );
}
