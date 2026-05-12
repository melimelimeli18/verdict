export function ProgressStrip({ progress, activeTitle }) {
  return (
    <section className="sticky-progress" aria-label="Progress">
      {activeTitle ? (
        <div className="sp-context">{activeTitle}</div>
      ) : null}
      <div className="sp-bar">
        <div className="sp-fill" style={{ width: `${progress.percent}%` }} />
      </div>
      <div className="sp-text">
        {progress.done}/{progress.total} selesai
      </div>
    </section>
  );
}
