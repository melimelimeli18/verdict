export function PageIntro({ title, description }) {
  return (
    <div className="page-intro">
      <h1 className="section-title">{title}</h1>
      {description ? <p className="section-desc">{description}</p> : null}
    </div>
  );
}
