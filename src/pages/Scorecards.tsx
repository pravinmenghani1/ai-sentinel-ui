import { Link } from "react-router-dom";
import { ChevronRight, FlaskConical } from "lucide-react";
import { guardrailDefs, guardrails, interventionsByGuardrail } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";
import { MeasurementBadge } from "@/components/MeasurementBadge";

const categoryColors: Record<string, string> = {
  Security: "bg-sentinel-red-light text-sentinel-red-dark",
  Privacy: "bg-sentinel-blue-light text-sentinel-blue-dark",
  Safety: "bg-sentinel-amber-light text-sentinel-amber-dark",
  Reliability: "bg-sentinel-teal-light text-sentinel-teal-dark",
  Control: "bg-sentinel-violet-light text-sentinel-violet-dark",
  Cost: "bg-sentinel-green-light text-sentinel-green-dark",
  Fairness: "bg-sentinel-surface-alt text-sentinel-text",
};

export function Scorecards() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Guardrail scorecards</h1>
        <p className="text-sm text-sentinel-text-secondary">
          {guardrailDefs.length} guardrails across 7 categories. Click a guardrail to see its full scorecard, latency, false positive rate, and intervention history.
        </p>
      </div>

      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Guardrail</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden md:table-cell">Engine</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Catch rate</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">FP rate</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">P95 latency</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Interventions</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Status</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {guardrails.map((g) => {
                const def = guardrailDefs.find((d) => d.id === g.id);
                const interventions = interventionsByGuardrail.find((i) => i.guardrailId === g.id);
                return (
                  <tr key={g.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <FlaskConical className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <Link to={`/test/scorecard/${g.id}`} className="font-semibold text-sentinel-text hover:text-sentinel-teal transition-colors">{g.name}</Link>
                          <div className="mt-0.5"><MeasurementBadge state={g.state} size="sm" /></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {def && <span className={`text-xs font-bold px-2 py-0.5 rounded ${categoryColors[def.category]}`}>{def.category}</span>}
                    </td>
                    <td className="px-4 py-3 text-sentinel-text-secondary hidden md:table-cell text-xs">{g.engine}</td>
                    <td className="px-4 py-3">
                      {g.catchRate ? <span className="font-mono font-medium text-sentinel-teal-dark">{g.catchRate.percentage}%</span> : <span className="font-mono text-sentinel-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell font-mono text-xs text-sentinel-text-secondary">{g.fp}%</td>
                    <td className="px-4 py-3 hidden sm:table-cell font-mono text-xs text-sentinel-text-secondary">{g.lat}ms</td>
                    <td className="px-4 py-3 font-mono text-sm text-sentinel-text">{interventions?.count.toLocaleString() || "0"}</td>
                    <td className="px-4 py-3"><StatusPill status={g.status} label={g.statusLabel} size="sm" /></td>
                    <td className="px-2 py-3"><ChevronRight className="w-4 h-4 text-sentinel-text-muted" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
