import { useState } from 'react';
import {
  Bot, Cpu, Activity, Zap, Database, CheckCircle, Clock,
  ArrowRight, Eye, Shield, Workflow, Brain, Network
} from 'lucide-react';
import { agents, agentActivityLog, getSeverityColor, formatPercent } from '../../data/syntheticData';

function AgentCard({ agent, isSelected, onClick }) {
  const isActive = agent.status === 'active';
  return (
    <button
      onClick={onClick}
      className={`glass-card rounded-xl p-5 text-left transition-all duration-300 cursor-pointer w-full ${
        isSelected ? 'border-blue-500/40 bg-blue-500/5' : 'hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-emerald-500/15' : 'bg-slate-700/50'}`}>
            <Bot className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
            <p className="text-xs text-slate-400">{agent.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
          <span className={`text-xs ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isActive ? 'Active' : 'Idle'}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{agent.description}</p>

      <div className="flex items-center gap-3 text-xs">
        <span className="text-slate-500">Findings today: <span className="text-slate-300 font-medium">{agent.findingsToday}</span></span>
        <span className="text-slate-500">Accuracy: <span className="text-emerald-400 font-medium">{formatPercent(agent.accuracy)}</span></span>
      </div>

      {/* Current Task */}
      <div className="mt-3 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/30">
        <div className="flex items-center gap-1.5 mb-1">
          {isActive ? <Activity className="w-3 h-3 text-blue-400 animate-pulse" /> : <Clock className="w-3 h-3 text-slate-500" />}
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Current Task</span>
        </div>
        <p className="text-xs text-slate-300">{agent.currentTask}</p>
      </div>
    </button>
  );
}

function AgentDetail({ agent }) {
  return (
    <div className="glass-card rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{agent.name}</h3>
          <p className="text-sm text-slate-400">{agent.type}</p>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">{agent.description}</p>

      {/* Model */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Model Architecture</h4>
        <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-slate-200">{agent.model}</span>
        </div>
      </div>

      {/* Data Sources */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Connected Data Sources</h4>
        <div className="space-y-1.5">
          {agent.dataSourcesConnected.map((ds, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-slate-300">{ds}</span>
              <CheckCircle className="w-3 h-3 text-emerald-500 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Performance Metrics</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-white">{agent.metrics.alertsGenerated}</p>
            <p className="text-[10px] text-slate-500">Alerts Generated</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-emerald-400">{formatPercent(agent.metrics.truePositiveRate * 100)}</p>
            <p className="text-[10px] text-slate-500">True Positive Rate</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-blue-400">{agent.metrics.avgResponseTime}</p>
            <p className="text-[10px] text-slate-500">Avg Response</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MultiAgentFlow() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-4.5 h-4.5 text-purple-400" />
        <h3 className="text-sm font-semibold text-white">Multi-Agent Orchestration</h3>
      </div>
      <div className="relative">
        {/* Flow Diagram - Simplified */}
        <div className="flex flex-col items-center gap-3">
          {/* Data Layer */}
          <div className="w-full p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">Data Integration Layer</p>
            <p className="text-[10px] text-slate-400">Core Banking | Market Data | Treasury | Regulatory Feeds</p>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />

          {/* Orchestrator */}
          <div className="w-full p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-center">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">AI Orchestrator</p>
            <p className="text-[10px] text-slate-400">Task routing, priority management, cross-agent coordination</p>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />

          {/* Agents Grid */}
          <div className="w-full grid grid-cols-3 gap-2">
            {agents.slice(0, 6).map((a) => (
              <div key={a.id} className={`p-2 rounded-lg border text-center ${
                a.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <Bot className={`w-3.5 h-3.5 mx-auto mb-1 ${a.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`} />
                <p className="text-[10px] font-medium text-slate-300 leading-tight">{a.name}</p>
              </div>
            ))}
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />

          {/* Output Layer */}
          <div className="w-full p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Risk Intelligence Output</p>
            <p className="text-[10px] text-slate-400">Real-time alerts | Dashboard metrics | Regulatory reports | Recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentsView() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Agents</h2>
            <p className="text-sm text-slate-400">Multi-agent system monitoring and configuration</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-medium">{agents.filter(a => a.status === 'active').length} Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-slate-400">{agents.filter(a => a.status === 'idle').length} Idle</span>
          </div>
        </div>
      </div>

      {/* Agent Grid + Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Agent Cards */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>

        {/* Selected Agent Detail */}
        <div>
          {selectedAgent && <AgentDetail agent={selectedAgent} />}
        </div>
      </div>

      {/* Multi-Agent Flow + Activity Log */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MultiAgentFlow />

        {/* Full Activity Log */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4.5 h-4.5 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Activity Log</h3>
          </div>
          <div className="space-y-1">
            {agentActivityLog.map((log, i) => {
              const colors = getSeverityColor(log.severity);
              return (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-700/20 last:border-0">
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 w-14 flex-shrink-0">{log.timestamp}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-slate-300">{log.agent}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>{log.action}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{log.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
