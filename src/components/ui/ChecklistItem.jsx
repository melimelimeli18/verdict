export function ChecklistItem({ disabled = false, item, done, onToggle }) {
  return (
    <button
      className={`check-item ${done ? "done" : ""}`}
      disabled={disabled}
      onClick={onToggle}
      type="button">
      <span className="checkbox" aria-hidden="true">
        <span className="check-icon">OK</span>
      </span>
      <span className="check-body">
        <span className="check-title">{item.title}</span>
        <span className="check-desc">{item.description}</span>
        {item.tag ? (
          <span className={`check-tag tag-${item.tag}`}>{item.tag}</span>
        ) : null}
      </span>
    </button>
  );
}
