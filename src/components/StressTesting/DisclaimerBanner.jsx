import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function DisclaimerBanner() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-2.5 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-medium text-amber-400">Disclaimer</span>
        </div>
        {collapsed ? (
          <ChevronDown className="w-3.5 h-3.5 text-amber-400/60" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-amber-400/60" />
        )}
      </button>
      {!collapsed && (
        <div className="px-4 pb-3 -mt-1">
          <p className="text-xs text-amber-200/70 leading-relaxed">
            For illustrative purposes only. Results are based on synthetic data and simplified models
            (Vasicek single-factor, static balance sheet). Not intended for regulatory reporting,
            capital planning, or investment decisions. Actual stress test outcomes depend on
            institution-specific portfolios, models, and assumptions.
          </p>
        </div>
      )}
    </div>
  );
}
