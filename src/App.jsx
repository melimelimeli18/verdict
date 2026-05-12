import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";
import { useChecklist } from "./hooks/useChecklist.js";
import { useTransactions } from "./hooks/useTransactions.js";
import { useCalculators } from "./hooks/useCalculators.js";
import { useInventory } from "./hooks/useInventory.js";
import { Header } from "./components/layout/Header.jsx";
import { SiteFooter } from "./components/layout/SiteFooter.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { navItems } from "./data/navigation.js";
import { LoginPage } from "./pages/Login.jsx";
import { DashboardPage } from "./pages/Dashboard.jsx";
import ChecklistPage from "./pages/Checklist.jsx";
import { KeuanganPage } from "./pages/Keuangan.jsx";
import { IklanPage } from "./pages/Iklan.jsx";
import { HppCalculatorPage } from "./pages/HppCalculator.jsx";
import { StokPage } from "./pages/Stok.jsx";
import { RoadmapPage } from "./pages/Roadmap.jsx";
import { FAQPage } from "./pages/FAQ.jsx";
import { EbookPage } from "./pages/Ebook.jsx";

export default function App() {
  const auth = useAuth();
  const checklist = useChecklist(auth.user);
  const transactions = useTransactions(auth.user);
  const calculators = useCalculators(auth.user);
  const inventory = useInventory(auth.user);

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
              inventory={inventory}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function LayoutRoutes({
  auth,
  checklist,
  transactions,
  calculators,
  inventory,
}) {
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
            inventory={inventory}
          />
        }
      />
    </Routes>
  );
}

function Layout({ auth, checklist, transactions, calculators, inventory }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageProps = { auth, checklist, transactions, calculators, inventory };

  const activePage =
    navItems.find((item) =>
      item.id === "dashboard"
        ? pathname === "/" || pathname === "/dashboard"
        : pathname === `/${item.id}`,
    )?.id ?? null;

  function handleNavigate(pageId) {
    const path = pageId === "dashboard" ? "/" : `/${pageId}`;
    navigate(path);
  }

  return (
    <>
      <Header
        activePage={activePage}
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
          <Route path="/iklan" element={<IklanPage {...pageProps} />} />
          <Route path="/hpp" element={<HppCalculatorPage {...pageProps} />} />
          <Route
            path="/stok"
            element={
              <ProtectedRoute user={auth.user} loading={auth.loading}>
                <StokPage {...pageProps} />
              </ProtectedRoute>
            }
          />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/produk" element={<EbookPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
