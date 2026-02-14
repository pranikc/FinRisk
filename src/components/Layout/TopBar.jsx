import { useState } from 'react';
import { Bell, Search, Activity, Clock, Building2, AlertTriangle } from 'lucide-react';
import { alerts, institution, getSeverityColor } from '../../data/syntheticData';

export default function TopBar() {
  const [showAlerts, setShowAlerts] = useState(false);
  const unacknowledged = alerts.filter((a) => !a.acknowledged);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Institution Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium">{institution.name}</span>
          <span className="text-xs text-slate-500 border-l border-slate-700 pl-2 ml-1">{institution.regulatoryFramework}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            <div className="relative w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-medium text-emerald-400">Live</span>
        </div>

        {/* Last Updated */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated 45s ago</span>
        </div>

        {/* Alerts */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unacknowledged.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {unacknowledged.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown */}
          {showAlerts && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAlerts(false)} />
              <div className="absolute right-0 top-12 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
                  <span className="text-xs text-slate-400">{unacknowledged.length} unacknowledged</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alerts.slice(0, 5).map((alert) => {
                    const colors = getSeverityColor(alert.severity);
                    return (
                      <div key={alert.id} className={`px-4 py-3 border-b border-slate-700/50 ${!alert.acknowledged ? 'bg-slate-750/50' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                                {alert.severity.toUpperCase()}
                              </span>
                              <span className="text-xs text-slate-500">{alert.category}</span>
                            </div>
                            <p className="text-sm text-slate-200 font-medium">{alert.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
