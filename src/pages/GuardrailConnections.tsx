import { Link } from "react-router-dom";
import { Cloud, CheckCircle2, XCircle, AlertCircle, Plus, ChevronRight } from "lucide-react";
import { guardrailConnections } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";

const cloudConfig: Record<string, { gradient: string; color: string }> = {
  "AWS": { gradient: "bg-gradient-amber", color: "text-sentinel-amber" },
  "Azure": { gradient: "bg-gradient-blue", color: "text-sentinel-blue" },
  "Google Cloud": { gradient: "bg-gradient-green", color: "text-sentinel-green" },
};

const connStatusMap = {
  connected: { icon: CheckCircle2, color: "text-sentinel-green-dark", label: "Connected" },
  disconnected: { icon: XCircle, color: "text-sentinel-text-muted", label: "Disconnected" },
  error: { icon: AlertCircle, color: "text-sentinel-red-dark", label: "Error" },
};

const accessStatusMap = {
  granted: { status: "matches_policy" as const, label: "Granted" },
  not_granted: { status: "not_measured" as const, label: "Not granted" },
  pending: { status: "pending" as const, label: "Pending" },
};

export function GuardrailConnections() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-sentinel-text mb-1">Guardrails & connections</h1>
          <p className="text-sm text-sentinel-text-secondary">
            Connected guardrails for each cloud provider, with connection status, test access, and monthly test budget.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-white text-sm font-bold hover:opacity-90 transition-opacity touch-target shadow-glow-teal">
          <Plus className="w-4 h-4" />
          Connect guardrail
        </button>
      </div>

      {/* Connection cards by cloud */}
      <div className="space-y-4">
        {["AWS", "Azure", "Google Cloud"].map((cloud) => {
          const conns = guardrailConnections.filter((c) => c.cloud === cloud);
          if (conns.length === 0) return null;
          const cc = cloudConfig[cloud];
          return (
            <div key={cloud} className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md ${cc.gradient} flex items-center justify-center`}>
                  <Cloud className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-sm font-bold text-sentinel-text">{cloud}</h2>
                <span className="text-xs text-sentinel-text-muted">{conns.length} guardrail{conns.length > 1 ? "s" : ""}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Guardrail</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Provider</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Region</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Connection</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Test access</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Test budget</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {conns.map((conn) => {
                      const cs = connStatusMap[conn.connectionStatus];
                      const ts = accessStatusMap[conn.testAccessStatus];
                      const budgetPct = conn.monthlyTestBudget > 0 ? (conn.testsThisMonth / conn.monthlyTestBudget) * 100 : 0;
                      return (
                        <tr key={conn.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                          <td className="px-4 py-3">
                            <Link to={`/test/scorecard/${conn.id.replace("gc-", "")}`} className="font-semibold text-sentinel-text hover:text-sentinel-teal transition-colors">
                              {conn.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sentinel-text-secondary">{conn.provider}</td>
                          <td className="px-4 py-3 font-mono text-xs text-sentinel-text-secondary">{conn.region}</td>
                          <td className="px-4 py-3">
                            <span className={`flex items-center gap-1.5 ${cs.color}`}>
                              <cs.icon className="w-4 h-4" />
                              <span className="text-xs font-medium">{cs.label}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusPill status={ts.status} label={ts.label} size="sm" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 w-32">
                              <span className="font-mono text-xs text-sentinel-text">
                                {conn.testsThisMonth.toLocaleString()} / {conn.monthlyTestBudget.toLocaleString()}
                              </span>
                              <div className="h-1.5 rounded bg-sentinel-border overflow-hidden">
                                <div
                                  className={`h-full rounded ${budgetPct > 90 ? "bg-gradient-amber" : "bg-gradient-primary"}`}
                                  style={{ width: `${Math.min(budgetPct, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <ChevronRight className="w-4 h-4 text-sentinel-text-muted" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
