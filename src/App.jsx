import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import DashboardView from './components/Dashboard/DashboardView';
import CreditRiskView from './components/CreditRisk/CreditRiskView';
import MarketRiskView from './components/MarketRisk/MarketRiskView';
import LiquidityRiskView from './components/LiquidityRisk/LiquidityRiskView';
import AgentsView from './components/Agents/AgentsView';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveView} />;
      case 'credit':
        return <CreditRiskView />;
      case 'market':
        return <MarketRiskView />;
      case 'liquidity':
        return <LiquidityRiskView />;
      case 'agents':
        return <AgentsView />;
      default:
        return <DashboardView onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={`transition-all duration-300 min-h-full ${
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[240px]'
        }`}
      >
        <TopBar />
        <main className="p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
