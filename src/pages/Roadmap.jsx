import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { roadmapStages } from "../data/roadmap.js";

export function RoadmapPage() {
  return (
    <section className="content page">
      <PageIntro
        title="Roadmap"
        description="Langkah-langkah membangun bisnis online dari nol sampai siap scale. Ikuti urutannya."
      />

      <div className="roadmap-timeline">
        {roadmapStages.map((stage, i) => (
          <div className="rm-card" key={i}>
            <div className="rm-marker">{stage.year}</div>
            <div className="rm-body">
              <span className="rm-label">{stage.name}</span>
              <span className="rm-rev">{stage.revenue}</span>
              <p className="rm-desc">{stage.goal}</p>
              <ul className="rm-targets">
                {stage.targets.map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
              <p className="rm-decision">
                <strong>Keputusan:</strong> {stage.decision}
              </p>
            </div>
          </div>
        ))}
      </div>

      <InfoBox title="Fleksibel tapi terarah">
        <p>
          Roadmap ini bukan aturan kaku — setiap bisnis punya kecepatan berbeda.
          Tapi urutannya sudah diuji: legalitas dulu, lalu channel, produk,
          logistik, keuangan, iklan, dan terakhir scale.
        </p>
      </InfoBox>
    </section>
  );
}
