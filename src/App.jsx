import { useEffect, useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import DashboardView from './components/Dashboard/DashboardView';
import CreditRiskView from './components/CreditRisk/CreditRiskView';
import MarketRiskView from './components/MarketRisk/MarketRiskView';
import LiquidityRiskView from './components/LiquidityRisk/LiquidityRiskView';
import StressTestingView from './components/StressTesting/StressTestingView';
import AgentsView from './components/Agents/AgentsView';
import { StressTestProvider } from './contexts/StressTestContext';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event) => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setMobileSidebarOpen(false);
    }
  }, [isDesktop]);

  const handleNavigate = (view) => {
    setActiveView(view);
    if (!isDesktop) {
      setMobileSidebarOpen(false);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'credit':
        return <CreditRiskView />;
      case 'market':
        return <MarketRiskView />;
      case 'liquidity':
        return <LiquidityRiskView />;
      case 'stress':
        return <StressTestingView />;
      case 'agents':
        return <AgentsView />;
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <StressTestProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isDesktop={isDesktop}
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
        <div
          className={`transition-all duration-300 min-h-screen ${
            isDesktop ? (sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]') : ''
          }`}
        >
          <TopBar onMenuClick={() => setMobileSidebarOpen(true)} showMenuButton={!isDesktop} />
          <main className="p-4 sm:p-6">
            {renderView()}
          </main>
        </div>
      </div>
    </StressTestProvider>
  );
}
