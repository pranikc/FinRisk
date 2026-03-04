import { useStressTest } from '../../contexts/StressTestContext';
import { getScenariosByCategory, SEVERITY_LEVELS } from '../../data/stressScenarioLibrary';

const categoryBadge = {
  Historical: 'bg-slate-700 text-slate-300',
  Regulatory: 'bg-blue-500/20 text-blue-400',
  Hypothetical: 'bg-indigo-500/20 text-indigo-400',
};

export default function ScenarioSelector() {
  const { selectedScenarioId, severity, selectScenario, setSeverity } = useStressTest();
  const grouped = getScenariosByCategory();

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex flex-col xl:flex-row xl:items-end gap-5">
        {/* Scenario Dropdown */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-2">Stress Scenario</label>
          <select
            value={selectedScenarioId}
            onChange={(e) => selectScenario(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {Object.entries(grouped).map(([category, scenarios]) => (
              <optgroup key={category} label={category}>
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Severity Radio Buttons */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Severity Level</label>
          <div className="flex gap-1.5">
            {SEVERITY_LEVELS.map((level) => {
              const isActive = severity === level.id;
              const colorMap = {
                mild: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                moderate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                severe: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
                extreme: 'bg-red-500/15 text-red-400 border-red-500/30',
              };
              return (
                <button
                  key={level.id}
                  onClick={() => setSeverity(level.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    isActive
                      ? colorMap[level.id]
                      : 'bg-slate-800/50 text-slate-400 border-slate-700/30 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                  title={level.returnPeriod}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
