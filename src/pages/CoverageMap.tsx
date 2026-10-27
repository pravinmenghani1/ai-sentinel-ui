import { aiSystemCoverage } from "@/mock/data";
import { ShieldCheck, ShieldAlert, ShieldX, ShieldOff, HelpCircle } from "lucide-react";

const statusConfig = {
  governed: { icon: ShieldCheck, color: "text-sentinel-green-dark", bg: "bg-gradient-green", label: "Governed", badge: "bg-sentinel-green-light text-sentinel-green-dark border-sentinel-green/20" },
  partly_governed: { icon: ShieldAlert, color: "text-sentinel-amber-dark", bg: "bg-gradient-amber", label: "Partly governed", badge: "bg-sentinel-amber-light text-sentinel-amber-dark border-sentinel-amber/20" },
  unguarded: { icon: ShieldX, color: "text-sentinel-red-dark", bg: "bg-gradient-red", label: "Unguarded", badge: "bg-sentinel-red-light text-sentinel-red-dark border-sentinel-red/20" },
  bypassing_gateway: { icon: ShieldOff, color: "text-sentinel-red-dark", bg: "bg-gradient-red", label: "Bypassing gateway", badge: "bg-sentinel-red-light text-sentinel-red-dark border-sentinel-red/20" },
  unknown: { icon: HelpCircle, color: "text-sentinel-text-muted", bg: "bg-sentinel-surface-alt", label: "Unknown", badge: "bg-sentinel-surface-alt text-sentinel-text-muted border-sentinel-border" },
} as const;

export function CoverageMap() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Coverage map</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Each AI system and whether it is governed by a guardrail. Partly governed, unguarded, and bypassing gateway systems are risks to address.
        </p>
      </div>

      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">AI system</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">Type</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Reason</th>
            </tr>
          </thead>
          <tbody>
            {aiSystemCoverage.map((system) => {
              const sc = statusConfig[system.status];
              return (
                <tr key={system.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${sc.bg} flex items-center justify-center flex-shrink-0`}>
                        <sc.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-medium text-sentinel-text">{system.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sentinel-text-secondary hidden sm:table-cell">{system.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border ${sc.badge}`}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-sentinel-text-secondary">{system.reason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(statusConfig).map(([key, sc]) => {
          const count = aiSystemCoverage.filter((s) => s.status === key).length;
          return (
            <div key={key} className="bg-sentinel-surface border border-sentinel-border rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <sc.icon className={`w-4 h-4 ${sc.color}`} />
                <span className="text-xs font-bold text-sentinel-text">{sc.label}</span>
              </div>
              <p className="text-2xl font-mono font-bold text-sentinel-text">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
