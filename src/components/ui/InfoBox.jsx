export function InfoBox({ title, children, variant = "light" }) {
  return (
    <div className={variant === "dark" ? "highlight-box" : "info-box"}>
      <div className={variant === "dark" ? "hb-title" : "info-box-title"}>
        {title}
      </div>
      <div className={variant === "dark" ? "hb-body" : "info-box-body"}>
        {children}
      </div>
    </div>
  );
}
