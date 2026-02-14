import { useState, useEffect } from 'react';
import {
  AlertTriangle, TrendingUp, TrendingDown, Activity, Shield, Bot,
  CreditCard, Droplets, ArrowUpRight, ArrowDownRight, Eye, Clock,
  Zap, Target
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  riskScores, alerts, agentActivityLog, agents, institution,
  formatCurrency, getRiskColor, getSeverityColor
} from '../../data/syntheticData';

function RiskGauge({ label, score, icon: Icon, onClick }) {
  const { color, label: riskLabel } = getRiskColor(score);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <button
      onClick={onClick}
      className="glass-card rounded-xl p-5 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4.5 h-4.5 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">{label}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="40" fill="none" stroke="#1e293b" strokeWidth="6" />
            <circle
              cx="45" cy="45" r="40" fill="none"
              stroke={color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{score}</span>
          </div>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{riskLabel}</span>
          <p className="text-xs text-slate-500 mt-0.5">Risk Score</p>
        </div>
      </div>
    </button>
  );
}

function AlertsPanel() {
  const recentAlerts = alerts.slice(0, 4);
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
        </div>
        <span className="text-xs text-slate-500">{alerts.filter(a => !a.acknowledged).length} unresolved</span>
      </div>
      <div className="space-y-3">
        {recentAlerts.map((alert) => {
          const colors = getSeverityColor(alert.severity);
          return (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>{alert.severity}</span>
                  <span className="text-[10px] text-slate-500">{alert.category}</span>
                </div>
                <p className="text-sm text-slate-200 font-medium mt-0.5 leading-snug">{alert.title}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Bot className="w-3 h-3" /> {alert.agent}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentActivityPanel() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Agent Activity</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400">{agents.filter(a => a.status === 'active').length} active</span>
        </div>
      </div>
      <div className="space-y-2">
        {agentActivityLog.slice(0, 6).map((log, i) => {
          const colors = getSeverityColor(log.severity);
          return (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-700/30 last:border-0">
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 w-14 flex-shrink-0">{log.timestamp}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-300">{log.agent}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>{log.action}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{log.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RiskTrendChart() {
  const data = riskScores.history;
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Risk Score Trend (30 Days)</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" /> Overall</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-rose-500 rounded-full inline-block" /> Credit</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 rounded-full inline-block" /> Market</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" /> Liquidity</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradOverall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 70]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value) => [value.toFixed(1), '']}
            />
            <Area type="monotone" dataKey="overall" stroke="#3b82f6" fill="url(#gradOverall)" strokeWidth={2} />
            <Area type="monotone" dataKey="credit" stroke="#f43f5e" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            <Area type="monotone" dataKey="market" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            <Area type="monotone" dataKey="liquidity" stroke="#10b981" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function InstitutionSummary() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4.5 h-4.5 text-slate-400" />
        <h3 className="text-sm font-semibold text-white">Key Metrics</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Assets', value: formatCurrency(institution.totalAssets, true), change: '+2.3%' },
          { label: 'Tier 1 Capital', value: formatCurrency(institution.tier1Capital, true), change: '+0.8%' },
          { label: 'Total Loans', value: formatCurrency(institution.totalLoans, true), change: '+1.5%' },
          { label: 'CET1 Ratio', value: '12.4%', change: '-0.2%', negative: true },
          { label: 'NPL Ratio', value: '1.82%', change: '+0.15%', negative: true },
          { label: 'ROA', value: '1.08%', change: '+0.04%' },
        ].map((m, i) => (
          <div key={i} className="bg-slate-800/40 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">{m.label}</p>
            <p className="text-lg font-semibold text-white">{m.value}</p>
            <span className={`text-xs ${m.negative ? 'text-rose-400' : 'text-emerald-400'}`}>{m.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardView({ onNavigate }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Risk Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time risk monitoring powered by multi-agent AI
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono text-slate-300">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-xs text-slate-500">{time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Risk Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <RiskGauge label="Overall Risk" score={riskScores.overall} icon={Shield} onClick={() => {}} />
        <RiskGauge label="Credit Risk" score={riskScores.credit} icon={CreditCard} onClick={() => onNavigate('credit')} />
        <RiskGauge label="Market Risk" score={riskScores.market} icon={TrendingDown} onClick={() => onNavigate('market')} />
        <RiskGauge label="Liquidity Risk" score={riskScores.liquidity} icon={Droplets} onClick={() => onNavigate('liquidity')} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Risk Trend (spans 2 cols) */}
        <div className="xl:col-span-2">
          <RiskTrendChart />
        </div>
        {/* Right: Key Metrics */}
        <div>
          <InstitutionSummary />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AlertsPanel />
        <AgentActivityPanel />
      </div>
    </div>
  );
}
