import { ChecklistItem } from "../components/ui/ChecklistItem.jsx";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { ProgressStrip } from "../components/layout/ProgressStrip.jsx";
import { checklistPhases } from "../data/checklist.js";

const allChecklistItems = checklistPhases.flatMap((phase) => phase.items);

export function ChecklistPage({ auth, checklist }) {
  const completedIds = checklist?.completedIds ?? [];
  const serverVersion = checklist?.serverVersion ?? 0;
  const progressPercent =
    Math.round((completedIds.length / allChecklistItems.length) * 100) || 0;

  async function handleToggle(itemId) {
    if (!auth.user) return;
    const next = completedIds.includes(itemId)
      ? completedIds.filter((x) => x !== itemId)
      : [...completedIds, itemId];
    await checklist.save(next, serverVersion);
  }

  return (
    <section className="content page">
      <PageIntro
        title="Business Checklist"
        description="Centang setiap langkah untuk memastikan fondasi bisnis kamu rapi dari hulu ke hilir."
      />

      <ProgressStrip
        activeTitle="Checklist Bisnis"
        progress={{
          done: completedIds.length,
          total: allChecklistItems.length,
          percent: progressPercent,
        }}
      />

      {checklistPhases.map((phase) => (
        <div className="phase-group" key={phase.id}>
          <div className="phase-header">
            <span className="phase-number">{phase.number}</span>
            <div>
              <h3 className="phase-title">{phase.title}</h3>
              <p className="phase-subtitle">{phase.subtitle}</p>
            </div>
          </div>

          <div className="check-grid">
            {phase.items.map((item) => (
              <ChecklistItem
                disabled={checklist.saving || !auth.user}
                item={item}
                key={item.id}
                done={completedIds.includes(item.id)}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
      ))}

      <InfoBox title="Kenapa ini penting?">
        <p>
          Checklist ini membantu kamu memastikan legalitas, perpajakan, channel,
          logistik, hingga alat pembayaran siap sebelum scale. Setiap centang
          mengurangi risiko operasional.
        </p>
      </InfoBox>
    </section>
  );
}
