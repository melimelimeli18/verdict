import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";
import { useChecklist } from "./hooks/useChecklist.js";
import { useTransactions } from "./hooks/useTransactions.js";
import { useCalculators } from "./hooks/useCalculators.js";
import { Header } from "./components/layout/Header.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { navItems } from "./data/navigation.js";
import { LoginPage } from "./pages/Login.jsx";
import { DashboardPage } from "./pages/Dashboard.jsx";
import { ChecklistPage } from "./pages/Checklist.jsx";
import { KeuanganPage } from "./pages/Keuangan.jsx";
import { HppCalculatorPage } from "./pages/HppCalculator.jsx";
import { RoasCalculatorPage } from "./pages/RoasCalculator.jsx";
import { RoadmapPage } from "./pages/Roadmap.jsx";
import { FAQPage } from "./pages/FAQ.jsx";

export default function App() {
  const auth = useAuth();
  const checklist = useChecklist(auth.user);
  const transactions = useTransactions(auth.user);
  const calculators = useCalculators(auth.user);

  if (auth.loading) {
    return (
      <div className="page-loading">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login — standalone, no layout */}
        <Route path="/login" element={<LoginPage auth={auth} />} />

        {/* All other pages — in layout wrapper */}
        <Route
          path="*"
          element={
            <LayoutRoutes
              auth={auth}
              checklist={checklist}
              transactions={transactions}
              calculators={calculators}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function LayoutRoutes({ auth, checklist, transactions, calculators }) {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <Layout
            auth={auth}
            checklist={checklist}
            transactions={transactions}
            calculators={calculators}
          />
        }
      />
    </Routes>
  );
}

function Layout({ auth, checklist, transactions, calculators }) {
  const pageProps = { auth, checklist, transactions, calculators };

  function handleNavigate(pageId) {
    const path = pageId === "dashboard" ? "/" : `/${pageId}`;
    window.location.href = path; // simple navigation — BrowserRouter handles
  }

  return (
    <>
      <Header
        activePage={getActivePage()}
        auth={auth}
        navItems={navItems}
        onNavigate={handleNavigate}
      />
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage {...pageProps} />} />
          <Route
            path="/checklist"
            element={
              <ProtectedRoute user={auth.user} loading={auth.loading}>
                <ChecklistPage {...pageProps} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/keuangan"
            element={
              <ProtectedRoute user={auth.user} loading={auth.loading}>
                <KeuanganPage {...pageProps} />
              </ProtectedRoute>
            }
          />
          <Route path="/hpp" element={<HppCalculatorPage {...pageProps} />} />
          <Route path="/roas" element={<RoasCalculatorPage {...pageProps} />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </main>
    </>
  );
}

function getActivePage() {
  const path = window.location.pathname.replace("/", "");
  if (!path) return "dashboard";
  const found = navItems.find((n) => n.id === path);
  return found ? path : "dashboard";
}
