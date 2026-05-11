import { useState } from "react";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { qnaItems } from "../data/qna.js";

export function FAQPage() {
  // Using a Set-like approach with state
  const [open, setOpen] = useState({});

  function toggle(id) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className="content page">
      <PageIntro
        title="FAQ"
        description="Pertanyaan yang sering ditanyakan oleh founder bisnis online pemula."
      />

      <div className="faq-list">
        {qnaItems.map((item, i) => {
          const expanded = !!open[i];
          return (
            <div className={`faq-card ${expanded ? "expanded" : ""}`} key={i}>
              <button className="faq-q" onClick={() => toggle(i)} type="button">
                <span>{item.question}</span>
                <span className="faq-arrow" aria-hidden="true">
                  {expanded ? "\u25B2" : "\u25BC"}
                </span>
              </button>
              {expanded && <div className="faq-a">{item.answer}</div>}
            </div>
          );
        })}
      </div>

      <InfoBox title="Masih bingung?">
        <p>
          Mulai dari Roadmap untuk lihat gambaran besar, lalu lanjut ke
          Checklist untuk memastikan setiap langkah siap sebelum scale.
          Kalkulator HPP dan ROAS akan membantu kamu saat sudah siap beriklan.
        </p>
      </InfoBox>
    </section>
  );
}
