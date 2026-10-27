import { Link } from "react-router-dom";
import { Bot, Wrench, Eye, EyeOff } from "lucide-react";
import { agentsAndTools } from "@/mock/data";

export function AgentsTools() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Agents & tools</h1>
        <p className="text-sm text-sentinel-text-secondary">
          AI agents and tools routed through each guardrail, with monitoring status and decision counts.
        </p>
      </div>

      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Guardrail</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Monitored</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Decisions</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {agentsAndTools.map((agent) => (
                <tr key={agent.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        agent.type === "Chatbot" ? "bg-gradient-violet" : "bg-gradient-amber"
                      }`}>
                        {agent.type === "Chatbot" ? <Bot className="w-3.5 h-3.5 text-white" /> : <Wrench className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="font-medium text-sentinel-text">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sentinel-text-secondary">{agent.type}</td>
                  <td className="px-4 py-3">
                    <Link to={`/test/scorecard/${agent.guardrailId}`} className="text-sentinel-teal hover:underline font-medium">
                      {agent.guardrailName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {agent.monitored ? (
                      <span className="flex items-center gap-1 text-sentinel-green-dark text-xs font-medium">
                        <Eye className="w-3.5 h-3.5" /> Monitored
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sentinel-text-muted text-xs">
                        <EyeOff className="w-3.5 h-3.5" /> Not monitored
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-sentinel-text">{agent.decisionCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sentinel-text-secondary text-xs">{agent.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
