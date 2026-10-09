import { Link } from "react-router-dom";
import { ChevronRight, FlaskConical } from "lucide-react";
import { guardrails } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";
import { MeasurementBadge } from "@/components/MeasurementBadge";

export function Scorecards() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Scorecards</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Catch rate scorecard for each connected guardrail. Click a guardrail to see its full scorecard.
        </p>
      </div>

      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Guardrail</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Provider</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Catch rate</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Status</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {guardrails.map((g) => (
              <tr key={g.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <Link to={`/test/scorecard/${g.id}`} className="font-semibold text-sentinel-text hover:text-sentinel-teal transition-colors">
                        {g.name}
                      </Link>
                      <div className="mt-0.5"><MeasurementBadge state={g.state} size="sm" /></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sentinel-text-secondary">{g.provider}</td>
                <td className="px-4 py-3">
                  {g.catchRate ? (
                    <span className="font-mono font-medium text-sentinel-teal-dark">{g.catchRate.percentage}%</span>
                  ) : (
                    <span className="font-mono text-sentinel-text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3"><StatusPill status={g.status} label={g.statusLabel} size="sm" /></td>
                <td className="px-2 py-3"><ChevronRight className="w-4 h-4 text-sentinel-text-muted" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
