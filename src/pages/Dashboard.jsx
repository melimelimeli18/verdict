import { Link } from "react-router-dom";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { StatCard } from "../components/ui/StatCard.jsx";
import { navItems } from "../data/navigation.js";

export function DashboardPage({ auth, checklist }) {
  const completedCount = checklist?.completedIds?.length ?? 0;
  const totalItems = 17;

  return (
    <section className="content page">
      <PageIntro
        title={`Halo${auth.user ? `, ${auth.user.name}` : ""}!`}
        description="Catalyst membantu kamu membangun fondasi bisnis online yang rapi, terukur, dan siap scale."
      />

      <div className="overview">
        <div className="overview-grid">
          <StatCard
            label="Checklist Selesai"
            value={`${completedCount}/${totalItems}`}
          />
          <StatCard label="Fitur" value={navItems.length - 1} />
        </div>
      </div>

      <div className="dashboard-links">
        {navItems.slice(1).map((item) => (
          <Link
            className="dash-link-card"
            key={item.id}
            to={`/${item.id === "dashboard" ? "" : item.id}`}>
            <span className="dash-link-label">{item.label}</span>
            <span className="dash-link-arrow">&rarr;</span>
          </Link>
        ))}
      </div>

      <InfoBox title="Mulai dari mana?">
        <p>
          Isi checklist bisnis dulu untuk memastikan fondasi kamu rapi. Lalu
          catat keuangan rutin dan pelajari kalkulator HPP & ROAS sebelum scale.
        </p>
      </InfoBox>
    </section>
  );
}
