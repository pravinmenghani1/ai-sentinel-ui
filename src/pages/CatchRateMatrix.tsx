import { coverageRows } from "@/mock/data";
import { MeasurementBadge } from "@/components/MeasurementBadge";
import { Grid3x3 } from "lucide-react";

export function CatchRateMatrix() {
  const guardrailNames = coverageRows[0]?.guardrails.map((g) => g.guardrailName) || [];

  const cellColor = (percentage: number | null) => {
    if (percentage === null) return "";
    if (percentage >= 90) return "text-sentinel-green-dark";
    if (percentage >= 80) return "text-sentinel-teal-dark";
    if (percentage >= 70) return "text-sentinel-blue-dark";
    if (percentage >= 60) return "text-sentinel-amber-dark";
    return "text-sentinel-red-dark";
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Catch-rate matrix</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Which attack categories are tested against which guardrails. Gaps show where you have no measurement.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5"><MeasurementBadge state="measured" size="sm" /></div>
        <div className="flex items-center gap-1.5"><MeasurementBadge state="attested" size="sm" /></div>
        <div className="flex items-center gap-1.5"><MeasurementBadge state="not_measured" size="sm" /></div>
      </div>

      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide sticky left-0 bg-sentinel-surface-alt">Attack category</th>
                {guardrailNames.map((name) => (
                  <th key={name} className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide whitespace-nowrap">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coverageRows.map((row) => (
                <tr key={row.attackCategory} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                  <td className="px-4 py-3 font-semibold text-sentinel-text sticky left-0 bg-sentinel-surface">
                    {row.attackCategory}
                    <span className="block text-xs text-sentinel-text-muted font-mono">{row.total} prompts</span>
                  </td>
                  {row.guardrails.map((g) => (
                    <td key={g.guardrailId} className="px-4 py-3">
                      {g.tooFewToJudge ? (
                        <div>
                          <span className="text-xs font-bold text-sentinel-amber-dark">too few to judge</span>
                          <span className="block text-xs text-sentinel-text-muted font-mono">{g.caught} of {g.total}</span>
                        </div>
                      ) : g.state === "measured" && g.percentage !== null ? (
                        <div className="flex flex-col gap-1">
                          <span className={`font-mono font-bold ${cellColor(g.percentage)}`}>{g.percentage}%</span>
                          <span className="text-xs text-sentinel-text-muted font-mono">{g.caught} of {g.total}</span>
                        </div>
                      ) : g.state === "attested" ? (
                        <MeasurementBadge state="attested" size="sm" />
                      ) : (
                        <div className="w-16 h-6 rounded hatch-pattern-dark border border-sentinel-border" title="Not measured" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-gradient-violet flex items-center justify-center">
            <Grid3x3 className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-sentinel-text">Reading this matrix</h2>
        </div>
        <ul className="space-y-1.5 text-sm text-sentinel-text-secondary">
          <li className="flex items-start gap-2"><span className="text-sentinel-teal mt-0.5">·</span> Measured cells show the catch rate and sample count for that attack category and guardrail. Colors range from green (90%+) to red (below 60%).</li>
          <li className="flex items-start gap-2"><span className="text-sentinel-amber mt-0.5">·</span> "Too few to judge" means the sample size is too small to draw a reliable conclusion.</li>
          <li className="flex items-start gap-2"><span className="text-sentinel-text-muted mt-0.5">·</span> Hatched cells are gaps — no measurement exists. An empty value is a gap, not a pass.</li>
        </ul>
      </div>
    </div>
  );
}
