import {
  LayoutDashboard,
  CreditCard,
  TrendingDown,
  Droplets,
  Flame,
  Bot,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'credit', label: 'Credit Risk', icon: CreditCard },
  { id: 'market', label: 'Market Risk', icon: TrendingDown },
  { id: 'liquidity', label: 'Liquidity Risk', icon: Droplets },
  { id: 'stress', label: 'Stress Testing', icon: Flame },
  { id: 'agents', label: 'AI Agents', icon: Bot },
];

export default function Sidebar({
  activeView,
  onNavigate,
  collapsed,
  onToggle,
  isDesktop,
  mobileOpen,
  onClose,
}) {
  return (
    <>
      {!isDesktop && mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700/50 z-40 transition-all duration-300 flex flex-col ${
          isDesktop
            ? (collapsed ? 'w-[68px]' : 'w-[240px]')
            : `w-[240px] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
      >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700/50">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || !isDesktop) && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">FinRisk</h1>
            <p className="text-[10px] text-blue-400 font-medium tracking-widest uppercase">AI Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
              title={collapsed && isDesktop ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
              {(!collapsed || !isDesktop) && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 pb-4">
        {isDesktop ? (
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors text-sm cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Close Menu</span>
          </button>
        )}
      </div>
      </aside>
    </>
  );
}
